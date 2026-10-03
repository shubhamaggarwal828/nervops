import express from "express";
import { fetchSubscriptions } from "../controllers/getSubscriptions.js";
import { fetchResources } from "../controllers/getResources.js";
import { fetchManualSecurityMetrics } from "../controllers/securityMetrics.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
	addAzureAccount,
	getAzureAccounts,
	deleteAzureAccount,
    updateAzureAccount
} from "../controllers/azureAccount.controller.js";
import { fetchCurrentCosts } from "../controllers/getBilling.js";

const router = express.Router();

router.post("/getSubscription", fetchSubscriptions);
router.post("/getServices", fetchResources);

router.post("/addAzureAccount", verifyToken, addAzureAccount);
router.get("/getAzureAccount", verifyToken, getAzureAccounts);
router.put("/updateAzureAccount", verifyToken, updateAzureAccount);
router.delete("/deleteAzureAccount", verifyToken, deleteAzureAccount);
router.post("/billingInfo", fetchCurrentCosts);

router.post("/security/manual-metrics", fetchManualSecurityMetrics);

export default router;
