import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { ClientSecretCredential } from "@azure/identity";
import { SubscriptionClient } from "@azure/arm-subscriptions";

dotenv.config();


// Encryption/Decryption Helpers
const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY; // 32-byte key
const iv = process.env.ENCRYPTION_IV; // 16-byte initialization vector

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};

// Fetch Azure subscriptions by decrypted credentials
export const fetchSubscriptions = async (req, res) => {
  const { encryptedTenantId, encryptedClientId, encryptedClientSecret } = req.body;

  try {
    // Decrypt credentials
    const tenantId = decryptData(encryptedTenantId);
    const clientId = decryptData(encryptedClientId);
    const clientSecret = decryptData(encryptedClientSecret);

    // Initialize Azure credential and subscription client
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const subscriptionClient = new SubscriptionClient(credential);

    // Fetch subscriptions
    const subscriptions = [];
    for await (const subscription of subscriptionClient.subscriptions.list()) {
      subscriptions.push({
        id: subscription.subscriptionId,
        name: subscription.displayName,
        state: subscription.state,
      });
    }

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


