// securityManual.js
import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { ClientSecretCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { NetworkManagementClient } from "@azure/arm-network";

dotenv.config();

const router = express.Router();

// --- Encryption/Decryption Helpers ---
const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY; // 32-byte key in hex
const iv = process.env.ENCRYPTION_IV;   // 16-byte IV in hex

const decryptData = (encryptedData) => {
  if (!encryptedData) throw new Error("No data provided for decryption.");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

// --- Helper: Safely convert a value to lowercase if it's a string or number ---
const safeToLower = (value) => {
  if (typeof value === "string") return value.toLowerCase();
  if (typeof value === "number") return value.toString().toLowerCase();
  return "";
};

// --- Helper: Extract Resource Group from resource ID ---
const extractResourceGroup = (resourceId) => {
  const match = resourceId.match(/resourceGroups\/([^/]+)\//i);
  return match ? match[1] : null;
};

// --- Expected Services for Reporting ---
const expectedServiceTypes = [
  { name: "Network Security Groups", pattern: /microsoft\.network\/networksecuritygroups/i },
  { name: "Virtual Machines", pattern: /microsoft\.compute\/virtualmachines/i },
  { name: "SQL Servers", pattern: /microsoft\.sql\/servers/i },
  { name: "Load Balancers", pattern: /microsoft\.network\/loadbalancers/i },
  { name: "Storage Accounts", pattern: /microsoft\.storage\/storageaccounts/i },
  { name: "App Services", pattern: /microsoft\.web\/sites/i },
  { name: "Key Vaults", pattern: /microsoft\.keyvault\/vaults/i },
  { name: "Virtual Networks", pattern: /microsoft\.network\/virtualnetworks/i },
  { name: "Cosmos DB", pattern: /microsoft\.documentdb\/databaseaccounts/i },
  { name: "VM Scale Sets", pattern: /microsoft\.compute\/virtualmachinescalesets/i },
  { name: "API Management", pattern: /microsoft\.apimanagement\/service/i },
  { name: "Container Instances", pattern: /microsoft\.containerinstance\/containergroups/i },
  { name: "Azure Firewall", pattern: /microsoft\.network\/azurefirewalls/i },
  { name: "Azure Bastion", pattern: /microsoft\.network\/bastions/i },
  { name: "Function Apps", pattern: /microsoft\.web\/sites/i } // Function apps are typically under sites with kind "functionapp"
];

// --- Security Checks Configuration ---
const securityChecks = [
  // 1. NSG Detailed Evaluation
  {
    group: "NSG Detailed Evaluation",
    resourceTypePattern: /microsoft\.network\/networksecuritygroups/i,
    async check(resource) {
      const evaluations = [];
      if (resource.properties && Array.isArray(resource.properties.securityRules)) {
        resource.properties.securityRules.forEach(rule => {
          const props = rule.properties;
          let evaluation = "OK";
          let severity = "None";
          let message = "Rule appears secure.";
          const accessVal = safeToLower(props?.access);
          if (accessVal === "allow") {
            if (props.destinationPortRange === "22" &&
                (props.sourceAddressPrefix === "*" || props.sourceAddressPrefix === "0.0.0.0/0")) {
              evaluation = "Not Secure";
              severity = "Critical";
              message = "SSH (port 22) is open to all sources.";
            } else if (props.destinationPortRange === "80" &&
                       (props.sourceAddressPrefix === "*" || props.sourceAddressPrefix === "0.0.0.0/0")) {
              evaluation = "Not Secure";
              severity = "High";
              message = "HTTP (port 80) is open to all sources; switch to HTTPS (port 443).";
            } else if (props.destinationPortRange === "3389" &&
                       (props.sourceAddressPrefix === "*" || props.sourceAddressPrefix === "0.0.0.0/0")) {
              evaluation = "Not Secure";
              severity = "Critical";
              message = "RDP (port 3389) is open to all sources.";
            } else {
              evaluation = "Warning";
              severity = "Medium";
              message = "Allow rule detected; review source restrictions.";
            }
          } else if (accessVal === "deny") {
            evaluation = "OK";
            severity = "None";
            message = "Deny rule in effect.";
          }
          evaluations.push({
            ruleName: rule.name,
            destinationPortRange: props?.destinationPortRange,
            protocol: props?.protocol,
            sourceAddressPrefix: props?.sourceAddressPrefix,
            destinationAddressPrefix: props?.destinationAddressPrefix,
            access: props?.access,
            priority: props?.priority,
            evaluation,
            severity,
            message
          });
        });
      }
      return evaluations;
    }
  },
  // 2. Virtual Machine Basic Checks
  {
    group: "VM Basic Checks",
    resourceTypePattern: /microsoft\.compute\/virtualmachines/i,
    async check(resource) {
      const results = [];
      if (resource.properties?.securityProfile?.uefiSettings) {
        if (!resource.properties.securityProfile.uefiSettings.secureBootEnabled) {
          results.push({
            issue: "Secure Boot is disabled on VM",
            severity: "Medium",
            recommendation: "Enable Secure Boot to reduce firmware attack risks."
          });
        } else {
          results.push({
            goodAspect: "Secure Boot enabled",
            comment: "VM has Secure Boot enabled."
          });
        }
      }
      if (resource.properties?.storageProfile?.osDisk) {
        const osDisk = resource.properties.storageProfile.osDisk;
        if (!osDisk.encryptionSettings) {
          results.push({
            issue: "OS Disk encryption settings not found",
            severity: "Medium",
            recommendation: "Enable encryption on OS disks to protect data."
          });
        } else {
          results.push({
            goodAspect: "OS Disk encryption enabled",
            comment: "OS Disk encryption is configured properly."
          });
        }
      }
      return results;
    }
  },
  // 3. VM NIC & Port Detailed Check
  {
    group: "VM NIC & Port Detailed Check",
    resourceTypePattern: /microsoft\.compute\/virtualmachines/i,
    async check(resource, networkClient) {
      const results = [];
      if (resource.properties?.networkProfile?.networkInterfaces) {
        for (const nicRef of resource.properties.networkProfile.networkInterfaces) {
          const nicRG = extractResourceGroup(nicRef.id);
          const nicName = nicRef.id.split("/").pop();
          try {
            const nicDetails = await networkClient.networkInterfaces.get(nicRG, nicName);
            if (!nicDetails.networkSecurityGroup) {
              results.push({
                issue: `NIC ${nicName} has no NSG assigned`,
                severity: "High",
                recommendation: "Associate an NSG with this NIC to control inbound traffic."
              });
            } else {
              const nsgId = nicDetails.networkSecurityGroup.id;
              const nsgRG = extractResourceGroup(nsgId);
              const nsgName = nsgId.split("/").pop();
              try {
                const nsgDetails = await networkClient.networkSecurityGroups.get(nsgRG, nsgName);
                if (nsgDetails.properties?.securityRules) {
                  nsgDetails.properties.securityRules.forEach(rule => {
                    const props = rule.properties;
                    const directionVal = safeToLower(props?.direction);
                    const accessVal = safeToLower(props?.access);
                    if (directionVal === "inbound" && accessVal === "allow") {
                      if (
                        props.destinationPortRange === "80" &&
                        (props.sourceAddressPrefix === "*" || props.sourceAddressPrefix === "0.0.0.0/0")
                      ) {
                        results.push({
                          issue: `NSG rule on NIC ${nicName} allows HTTP (port 80) from all sources`,
                          severity: "High",
                          recommendation: "Restrict HTTP access or switch to HTTPS (port 443)."
                        });
                      }
                      if (
                        props.destinationPortRange === "3389" &&
                        (props.sourceAddressPrefix === "*" || props.sourceAddressPrefix === "0.0.0.0/0")
                      ) {
                        results.push({
                          issue: `NSG rule on NIC ${nicName} allows RDP (port 3389) from all sources`,
                          severity: "Critical",
                          recommendation: "Restrict RDP access to specific IP ranges or use Bastion/VPN."
                        });
                      }
                    }
                  });
                }
              } catch (nsgErr) {
                results.push({
                  issue: `Failed to fetch NSG details for NIC ${nicName}: ${nsgErr.message}`,
                  severity: "Medium"
                });
              }
            }
          } catch (nicErr) {
            results.push({
              issue: `Failed to fetch NIC details for ${nicName}: ${nicErr.message}`,
              severity: "Medium"
            });
          }
        }
      }
      return results;
    }
  },
  // 4. SQL Server Checks
  {
    group: "SQL Server Checks",
    resourceTypePattern: /microsoft\.sql\/servers/i,
    async check(resource) {
      const results = [];
      if (resource.properties?.publicNetworkAccess) {
        const publicAccess = safeToLower(resource.properties.publicNetworkAccess);
        if (publicAccess === "enabled") {
          results.push({
            issue: "SQL Server allows public network access",
            severity: "High",
            recommendation: "Restrict SQL Server access to private networks."
          });
        } else {
          results.push({
            goodAspect: "SQL Server restricted",
            comment: "Public network access is disabled."
          });
        }
      }
      return results;
    }
  },
  // 5. Load Balancer Checks
  {
    group: "Load Balancer Checks",
    resourceTypePattern: /microsoft\.network\/loadbalancers/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.frontendIPConfigurations || resource.properties.frontendIPConfigurations.length === 0) {
          results.push({
            issue: "Load Balancer has no frontend IP configurations",
            severity: "Medium",
            recommendation: "Configure a frontend IP for proper load balancing."
          });
        } else {
          results.push({
            goodAspect: "Load Balancer configured",
            comment: "Frontend IP configurations are present."
          });
        }
      }
      return results;
    }
  },
  // 6. Storage Account Checks
  {
    group: "Storage Account Checks",
    resourceTypePattern: /microsoft\.storage\/storageaccounts/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.supportsHttpsTrafficOnly) {
          results.push({
            issue: "Storage Account does not enforce HTTPS traffic only",
            severity: "Medium",
            recommendation: "Enable HTTPS traffic only."
          });
        } else {
          results.push({
            goodAspect: "HTTPS enforced on Storage Account",
            comment: "Storage Account enforces HTTPS."
          });
        }
        if (resource.properties.allowBlobPublicAccess) {
          results.push({
            issue: "Storage Account allows public blob access",
            severity: "High",
            recommendation: "Disable public blob access."
          });
        } else {
          results.push({
            goodAspect: "Public blob access disabled",
            comment: "Public blob access is restricted."
          });
        }
      }
      return results;
    }
  },
  // 7. App Service Checks
  {
    group: "App Service Checks",
    resourceTypePattern: /microsoft\.web\/sites/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.httpsOnly) {
          results.push({
            issue: "App Service is not configured to use HTTPS only",
            severity: "High",
            recommendation: "Enable HTTPS only."
          });
        } else {
          results.push({
            goodAspect: "HTTPS enforced on App Service",
            comment: "App Service forces HTTPS."
          });
        }
        if ("alwaysOn" in resource.properties) {
          if (!resource.properties.alwaysOn) {
            results.push({
              issue: "App Service Always On is disabled",
              severity: "Medium",
              recommendation: "Enable Always On for better availability."
            });
          } else {
            results.push({
              goodAspect: "Always On enabled",
              comment: "App Service Always On is enabled."
            });
          }
        }
      }
      return results;
    }
  },
  // 8. Key Vault Checks
  {
    group: "Key Vault Checks",
    resourceTypePattern: /microsoft\.keyvault\/vaults/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.enableSoftDelete) {
          results.push({
            issue: "Key Vault does not have soft-delete enabled",
            severity: "High",
            recommendation: "Enable soft-delete."
          });
        } else {
          results.push({
            goodAspect: "Soft-delete enabled",
            comment: "Key Vault has soft-delete enabled."
          });
        }
        if (!resource.properties.enablePurgeProtection) {
          results.push({
            issue: "Key Vault does not have purge protection enabled",
            severity: "High",
            recommendation: "Enable purge protection."
          });
        } else {
          results.push({
            goodAspect: "Purge protection enabled",
            comment: "Key Vault is protected with purge protection."
          });
        }
      }
      return results;
    }
  },
  // 9. Virtual Network Checks
  {
    group: "Virtual Network Checks",
    resourceTypePattern: /microsoft\.network\/virtualnetworks/i,
    async check(resource) {
      const results = [];
      if (resource.properties?.subnets) {
        resource.properties.subnets.forEach((subnet) => {
          if (!subnet.properties || !subnet.properties.networkSecurityGroup) {
            results.push({
              issue: `Subnet ${subnet.name} is not associated with an NSG`,
              severity: "Low",
              recommendation: "Associate an NSG to secure this subnet."
            });
          } else {
            results.push({
              goodAspect: "Subnet NSG association",
              comment: `Subnet ${subnet.name} is secured by an NSG.`
            });
          }
        });
      }
      return results;
    }
  },
  // 10. Cosmos DB Checks
  {
    group: "Cosmos DB Checks",
    resourceTypePattern: /microsoft\.documentdb\/databaseaccounts/i,
    async check(resource) {
      const results = [];
      if (resource.properties?.publicNetworkAccess) {
        const publicAccess = safeToLower(resource.properties.publicNetworkAccess);
        if (publicAccess === "enabled") {
          results.push({
            issue: "Cosmos DB allows public network access",
            severity: "High",
            recommendation: "Restrict Cosmos DB access to private networks."
          });
        } else {
          results.push({
            goodAspect: "Cosmos DB restricted",
            comment: "Cosmos DB public access is disabled."
          });
        }
      }
      return results;
    }
  },
  // 11. VM Scale Sets Checks
  {
    group: "VM Scale Sets Checks",
    resourceTypePattern: /microsoft\.compute\/virtualmachinescalesets/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (resource.properties.upgradePolicy?.mode !== "Automatic") {
          results.push({
            issue: "VM Scale Set upgrade policy is not set to Automatic",
            severity: "Medium",
            recommendation: "Set the upgrade policy to Automatic."
          });
        } else {
          results.push({
            goodAspect: "VM Scale Set upgrade policy",
            comment: "Automatic upgrade policy is configured."
          });
        }
      }
      return results;
    }
  },
  // 12. API Management Checks
  {
    group: "API Management Checks",
    resourceTypePattern: /microsoft\.apimanagement\/service/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.customProperties?.customHostname) {
          results.push({
            issue: "API Management service does not have a custom domain configured",
            severity: "Low",
            recommendation: "Configure a custom domain with an HTTPS certificate."
          });
        } else {
          results.push({
            goodAspect: "Custom domain configured",
            comment: "API Management service has a custom domain configured."
          });
        }
        if (resource.properties.developerPortalEnabled === false) {
          results.push({
            issue: "Developer portal is disabled",
            severity: "Low",
            recommendation: "Enable the developer portal for better management."
          });
        } else {
          results.push({
            goodAspect: "Developer portal enabled",
            comment: "Developer portal is enabled."
          });
        }
      }
      return results;
    }
  },
  // 13. Container Instance Checks
  {
    group: "Container Instance Checks",
    resourceTypePattern: /microsoft\.containerinstance\/containergroups/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.ipAddress) {
          results.push({
            goodAspect: "No public IP for Container Instance",
            comment: "Container instance is not exposed publicly."
          });
        } else {
          results.push({
            issue: "Container Instance has a public IP assigned",
            severity: "Medium",
            recommendation: "Consider deploying container groups inside a VNET."
          });
        }
      }
      return results;
    }
  },
  // 14. Azure Firewall Checks
  {
    group: "Azure Firewall Checks",
    resourceTypePattern: /microsoft\.network\/azurefirewalls/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        if (!resource.properties.ruleCollections || resource.properties.ruleCollections.length === 0) {
          results.push({
            issue: "Azure Firewall has no rule collections defined",
            severity: "Medium",
            recommendation: "Define rule collections to control traffic."
          });
        } else {
          results.push({
            goodAspect: "Azure Firewall rules defined",
            comment: "Firewall rule collections are configured."
          });
        }
      }
      return results;
    }
  },
  // 15. Azure Bastion Checks
  {
    group: "Azure Bastion Checks",
    resourceTypePattern: /microsoft\.network\/bastions/i,
    async check(resource) {
      const results = [];
      if (resource.properties) {
        results.push({
          goodAspect: "Azure Bastion deployed",
          comment: "Azure Bastion is deployed for secure VM connectivity."
        });
      }
      return results;
    }
  },
  // 16. Function App Checks
  {
    group: "Function App Checks",
    resourceTypePattern: /microsoft\.web\/sites/i,
    async check(resource) {
      const results = [];
      if (
        resource.properties && 
        resource.properties.kind && 
        typeof resource.properties.kind === "string" &&
        resource.properties.kind.toLowerCase().includes("functionapp")
      ) {
        if (!resource.properties.httpsOnly) {
          results.push({
            issue: "Function App is not configured to use HTTPS only",
            severity: "High",
            recommendation: "Enable HTTPS only."
          });
        } else {
          results.push({
            goodAspect: "Function App HTTPS enforced",
            comment: "Function App forces HTTPS."
          });
        }
      }
      return results;
    }
  }
  // ... Additional check groups can be added here.
];

// --- Asynchronous Evaluation Function ---
const evaluateResourceAsync = async (resource, networkClient) => {
  const aggregated = { issues: [], goodAspects: [], detailedNSGRules: [] };
  for (const checkConfig of securityChecks) {
    if (checkConfig.resourceTypePattern.test(resource.type)) {
      const result = await checkConfig.check(resource, networkClient);
      if (checkConfig.group === "NSG Detailed Evaluation") {
        aggregated.detailedNSGRules.push(...result);
      } else {
        result.forEach((entry) => {
          if (entry.issue) {
            aggregated.issues.push({ resourceId: resource.id, group: checkConfig.group, ...entry });
          } else if (entry.goodAspect) {
            aggregated.goodAspects.push({ resourceId: resource.id, group: checkConfig.group, ...entry });
          }
        });
      }
    }
  }
  return aggregated;
};

// --- Endpoint Implementation ---
export const fetchManualSecurityMetrics = async (req, res) => {
  const { subscriptionId, encryptedTenantId, encryptedClientId, encryptedClientSecret } = req.body;
  if (!subscriptionId || !encryptedTenantId || !encryptedClientId || !encryptedClientSecret) {
    return res.status(400).json({
      success: false,
      message: "Missing required subscription ID or encrypted credentials.",
    });
  }
  try {
    // Decrypt credentials
    const tenantId = decryptData(encryptedTenantId);
    const clientId = decryptData(encryptedClientId);
    const clientSecret = decryptData(encryptedClientSecret);

    // Initialize Azure clients
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const resourceClient = new ResourceManagementClient(credential, subscriptionId);
    const networkClient = new NetworkManagementClient(credential, subscriptionId);

    // Fetch all resources in the subscription
    const resources = [];
    const apiVersionMap = {
      "Microsoft.Web/staticSites": "2024-04-01",
      "Microsoft.Compute/virtualMachines": "2024-07-01",
      "Microsoft.Compute/disks": "2024-03-02",
    };
    
    for await (const resource of resourceClient.resources.list()) {
      let fullResource;
      const resourceType = resource.type; // Extract the type of the resource
      const apiVersion = apiVersionMap[resourceType] || "2024-01-01"; // Default to a fallback API version
      
      try {
        fullResource = await resourceClient.resources.getById(resource.id, apiVersion);
      } catch (err) {
        console.error(`Error fetching details for resource ${resource.id}:`, err.message);
        fullResource = resource; // Fallback to partial data if fetching fails
      }
      
      resources.push(fullResource);
    }
    

    // Evaluate each resource asynchronously
    const evaluations = await Promise.allSettled(
      resources.map(resource => evaluateResourceAsync(resource, networkClient))
    );
    const aggregatedIssues = [];
    const aggregatedGoodAspects = [];
    const aggregatedNSGDetails = [];
    evaluations.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const evalResult = result.value;
        if (evalResult.issues.length > 0) aggregatedIssues.push(...evalResult.issues);
        if (evalResult.goodAspects.length > 0) aggregatedGoodAspects.push(...evalResult.goodAspects);
        if (evalResult.detailedNSGRules.length > 0) {
          aggregatedNSGDetails.push({
            resourceId: resources[index].id,
            evaluatedRules: evalResult.detailedNSGRules
          });
        }
      } else {
        console.error(`Error evaluating resource ${resources[index].id}:`, result.reason);
      }
    });

    // Determine which expected services were encountered
    const encounteredServices = new Set(resources.map(r => (typeof r.type === "string" ? r.type.toLowerCase() : "")));
    const missingServices = expectedServiceTypes
      .filter(service => ![...encounteredServices].some(s => service.pattern.test(s)))
      .map(s => s.name);

    // Build final report
    const report = {
      totalResources: resources.length,
      securityIssues: aggregatedIssues,
      securityGoodAspects: aggregatedGoodAspects,
      detailedNSGRules: aggregatedNSGDetails,
      checkedServices: expectedServiceTypes.map(s => ({
        service: s.name,
        used: [...encounteredServices].some(type => s.pattern.test(type))
      })),
      missingServices
    };

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error(`Error fetching security metrics for subscription ${subscriptionId}:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post("/security/manual-metrics", fetchManualSecurityMetrics);

export default router;
