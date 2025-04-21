import { AzureAccount } from "../models/user.model.js";

// ADD AZURE ACCOUNT
export const addAzureAccount = async (req, res) => {
	const { azureEmail, clientId, clientSecret, tenantId, subscriptionId } = req.body;

	try {
		if (!req.userId) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		if (!azureEmail || !clientId || !clientSecret || !tenantId || !subscriptionId ) {
			throw new Error("All Azure account fields are required");
		}

		const azureAccount = new AzureAccount({
			userId: req.userId,
			azureEmail,
			clientId,
			clientSecret,
			tenantId,
			subscriptionId,
		});

		await azureAccount.save();

		res.status(201).json({
			success: true,
			message: "Azure account added successfully",
			azureAccount,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// GET AZURE ACCOUNTS
export const getAzureAccounts = async (req, res) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const azureAccounts = await AzureAccount.find({ userId: req.userId });

		res.status(200).json({
			success: true,
			azureAccounts,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Update an existing Azure account
export const updateAzureAccount = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { azureEmail, clientId, clientSecret, tenantId, subscriptionId } = req.body;
    if (!azureEmail || !clientId || !clientSecret || !tenantId) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    const account = await AzureAccount.findOneAndUpdate(
      { userId: req.userId },
      { azureEmail, clientId, clientSecret, tenantId, subscriptionId },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ success: false, message: "Azure account not found" });
    }
    res.status(200).json({ success: true, message: "Azure account updated successfully", azureAccount: account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete the Azure account
export const deleteAzureAccount = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const account = await AzureAccount.findOneAndDelete({ userId: req.userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Azure account not found" });
    }
    res.status(200).json({ success: true, message: "Azure account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};