import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { ClientSecretCredential } from "@azure/identity";
import { CostManagementClient } from "@azure/arm-costmanagement";

dotenv.config();
const router = express.Router();

const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY; // 32-byte key
const iv = process.env.ENCRYPTION_IV; // 16-byte IV

// Helper function to decrypt data
const decryptData = (encrypted) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

// Fetch cost details
export const fetchCurrentCosts = async (req, res) => {
  const {
    subscriptionId,
    encryptedTenantId,
    encryptedClientId,
    encryptedClientSecret,
  } = req.body;

  if (!subscriptionId || !encryptedTenantId || !encryptedClientId || !encryptedClientSecret) {
    return res.status(400).json({
      success: false,
      message: "Missing inputs. Please provide subscriptionId and encrypted credentials.",
    });
  }

  try {
    // Decrypt credentials
    const tenantId = decryptData(encryptedTenantId);
    const clientId = decryptData(encryptedClientId);
    const clientSecret = decryptData(encryptedClientSecret);

    // Authenticate
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const costClient = new CostManagementClient(credential);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Prepare the query for costs
    const costQuery = {
      type: "ActualCost",
      timeframe: "Custom",
      timePeriod: {
        from: firstDayOfMonth,
        to: lastDayOfMonth,
      },
      dataset: {
        aggregation: {
          totalCost: {
            name: "Cost",
            function: "Sum",
          },
        },
        granularity: "None",
        grouping: [
          {
            type: "Dimension",
            name: "ServiceName",
          },
        ],
      },
    };

    // Fetch cost details
    const costDetails = await costClient.query.usage(
      `subscriptions/${subscriptionId}`,
      costQuery
    );

    return res.status(200).json({
      success: true,
      data: costDetails,
    });
  } catch (err) {
    console.error("Error fetching current costs:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default router;
