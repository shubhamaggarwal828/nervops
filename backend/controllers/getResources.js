// import express from "express";
// import crypto from "crypto";
// import dotenv from "dotenv";
// import { ClientSecretCredential } from "@azure/identity";
// import { ResourceManagementClient  } from "@azure/arm-resources";

// dotenv.config();

// const router = express.Router();

// // Encryption/Decryption Helpers
// const algorithm = "aes-256-cbc";
// const key = process.env.ENCRYPTION_KEY; // 32-byte key
// const iv = process.env.ENCRYPTION_IV; // 16-byte initialization vector

// const decryptData = (encryptedData) => {
//   if (!encryptedData) {
//     throw new Error("No data provided for decryption.");
//   }
//   const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
//   let decrypted = decipher.update(encryptedData, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return JSON.parse(decrypted);
// };

// // Fetch resources by subscription ID
// export const fetchResources = async (req, res) => {
//   const { subscriptionId } = req.body;
//   const { encryptedTenantId, encryptedClientId, encryptedClientSecret } = req.body;

//   try {
//     // Validate subscriptionId and credentials
//     if (!subscriptionId || !encryptedTenantId || !encryptedClientId || !encryptedClientSecret) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required subscription ID or encrypted credentials.",
//       });
//     }

//     // Decrypt credentials
//     const tenantId = decryptData(encryptedTenantId);
//     const clientId = decryptData(encryptedClientId);
//     const clientSecret = decryptData(encryptedClientSecret);

//     // Initialize Azure credential and resource client
//     const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
//     const resourceClient = new ResourceManagementClient(credential, subscriptionId);

//     // Fetch resources
//     const resources = [];
//     // for await (const resource of resourceClient.resources.list()) {
//     //   resources.push({
//     //     name: resource.name,
//     //     type: resource.type,
//     //     location: resource.location,
//     //   });
//     // }
//     for await (const resource of resourceClient.resources.list()) {
//         console.log(`Resource: ${resource}`);
//         resources.push({
//           id: resource.id,
//           name: resource.name,
//           type: resource.type,
//           location: resource.location,
//           status: resource.status,
//           properties: resource.properties  // This will include additional config details
//         });
//       }
  

//     res.status(200).json({ success: true, data: resources });
//   } catch (error) {
//     console.error(`Error fetching resources for subscription ${subscriptionId}:`, error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Routes
// import express from "express";
// import crypto from "crypto";
// import dotenv from "dotenv";
// import { ClientSecretCredential } from "@azure/identity";
// import { ResourceManagementClient } from "@azure/arm-resources";

// dotenv.config();

// const router = express.Router();

// // Encryption/Decryption Helpers
// const algorithm = "aes-256-cbc";
// const key = process.env.ENCRYPTION_KEY; // 32-byte key
// const iv = process.env.ENCRYPTION_IV; // 16-byte initialization vector

// const decryptData = (encryptedData) => {
//   if (!encryptedData) {
//     throw new Error("No data provided for decryption.");
//   }
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(key, "hex"),
//     Buffer.from(iv, "hex")
//   );
//   let decrypted = decipher.update(encryptedData, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return JSON.parse(decrypted);
// };

// // Fetch resources by subscription ID
// export const fetchResources = async (req, res) => {
//   const { subscriptionId, encryptedTenantId, encryptedClientId, encryptedClientSecret } = req.body;

//   try {
//     // Validate subscriptionId and credentials
//     if (!subscriptionId || !encryptedTenantId || !encryptedClientId || !encryptedClientSecret) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required subscription ID or encrypted credentials.",
//       });
//     }

//     // Decrypt credentials
//     const tenantId = decryptData(encryptedTenantId);
//     const clientId = decryptData(encryptedClientId);
//     const clientSecret = decryptData(encryptedClientSecret);

//     // Initialize Azure credential and resource client
//     const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
//     const resourceClient = new ResourceManagementClient(credential, subscriptionId);

//     // Fetch resources and then get full details for each using getById
//     const resources = [];
//     for await (const resource of resourceClient.resources.list()) {
//       // Determine a valid API version: if missing, supply a default based on resource type.
//       let apiVersion = resource.apiVersion;
//       if (!apiVersion) {
//         if (resource.type.toLowerCase() === "microsoft.compute/disks") {
//           apiVersion = "2021-07-01";
//         } else {
//           // Generic fallback; adjust this default version as needed.
//           apiVersion = "2021-04-01";
//         }
//         console.warn(`Using default apiVersion ${apiVersion} for resource ${resource.id}`);
//       }

//       try {
//         const fullResource = await resourceClient.resources.getById(resource.id, apiVersion);
//         resources.push(fullResource);
//       } catch (err) {
//         console.error(`Error fetching full details for resource ${resource.id}:`, err.message);
//         // Fallback: push minimal resource info if full details can't be fetched.
//         resources.push({
//           id: resource.id,
//           name: resource.name,
//           type: resource.type,
//           location: resource.location,
//           status: resource.status,
//           properties: resource.properties,
//         });
//       }
//     }

//     res.status(200).json({ success: true, data: resources });
//   } catch (error) {
//     console.error(`Error fetching resources for subscription ${subscriptionId}:`, error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export default router;
import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { ClientSecretCredential } from "@azure/identity";
import { ResourceManagementClient } from "@azure/arm-resources";
import { ComputeManagementClient } from "@azure/arm-compute";
import { NetworkManagementClient } from "@azure/arm-network";

dotenv.config();

const router = express.Router();

// Encryption/Decryption Helpers
const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY; // 32-byte key
const iv = process.env.ENCRYPTION_IV; // 16-byte IV

const decryptData = (encryptedData) => {
  if (!encryptedData) {
    throw new Error("No data provided for decryption.");
  }
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

// Helper to extract resource group name from a resource id
const extractResourceGroup = (resourceId) => {
  const match = resourceId.match(/resourceGroups\/([^/]+)\//i);
  return match ? match[1] : null;
};

// Fetch resources by subscription ID with detailed info and security state
export const fetchResources = async (req, res) => {
  const { subscriptionId, encryptedTenantId, encryptedClientId, encryptedClientSecret } = req.body;

  try {
    // Validate required fields
    if (!subscriptionId || !encryptedTenantId || !encryptedClientId || !encryptedClientSecret) {
      return res.status(400).json({
        success: false,
        message: "Missing required subscription ID or encrypted credentials.",
      });
    }

    // Decrypt credentials
    const tenantId = decryptData(encryptedTenantId);
    const clientId = decryptData(encryptedClientId);
    const clientSecret = decryptData(encryptedClientSecret);

    // Initialize clients
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const resourceClient = new ResourceManagementClient(credential, subscriptionId);
    const computeClient = new ComputeManagementClient(credential, subscriptionId);
    const networkClient = new NetworkManagementClient(credential, subscriptionId);

    const resources = [];
    for await (const resource of resourceClient.resources.list()) {
      // Determine a valid API version; if missing, provide a default.
      let apiVersion = resource.apiVersion;
      if (!apiVersion) {
        if (resource.type.toLowerCase() === "microsoft.compute/disks") {
          apiVersion = "2021-04-01";
        } else {
          apiVersion = "2021-04-01";
        }
        console.warn(`Using default apiVersion ${apiVersion} for resource ${resource.id}`);
      }

      let fullResource;
      const resourceGroup = extractResourceGroup(resource.id);
      try {
        // For VMs, get full details and then fetch instance view for current state.
        if (resource.type.toLowerCase() === "microsoft.compute/virtualmachines" && resourceGroup) {
          fullResource = await resourceClient.resources.getById(resource.id, apiVersion);
          try {
            const instanceView = typeof computeClient.virtualMachines.instanceView === "function"
              ? await computeClient.virtualMachines.instanceView(resourceGroup, resource.name)
              : typeof computeClient.virtualMachines.getInstanceView === "function"
              ? await computeClient.virtualMachines.getInstanceView(resourceGroup, resource.name)
              : null;
            // Attach the full instance view details for security analysis.
            if (instanceView) {
              fullResource.instanceView = instanceView;
            }
          } catch (vmErr) {
            console.error(`Error fetching instance view for VM ${resource.id}:`, vmErr.message);
          }
        }
        // For Public IP addresses, get full details and additional IP info.
        else if (resource.type.toLowerCase() === "microsoft.network/publicipaddresses" && resourceGroup) {
          fullResource = await resourceClient.resources.getById(resource.id, apiVersion);
          try {
            const publicIP = await networkClient.publicIPAddresses.get(resourceGroup, resource.name);
            fullResource.publicIPDetails = publicIP;
          } catch (ipErr) {
            console.error(`Error fetching public IP details for ${resource.id}:`, ipErr.message);
          }
        } else {
          // For other resource types, simply retrieve full details.
          fullResource = await resourceClient.resources.getById(resource.id, apiVersion);
        }
        resources.push(fullResource);
      } catch (err) {
        console.error(`Error fetching full details for resource ${resource.id}:`, err.message);
        // Fallback: push minimal resource info if full details can't be fetched.
        resources.push({
          id: resource.id,
          name: resource.name,
          type: resource.type,
          location: resource.location,
          properties: resource.properties,
        });
      }
    }

    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    console.error(`Error fetching resources for subscription ${subscriptionId}:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default router;