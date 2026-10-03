import { Cloud, Zap, Server, ShieldCheck, Activity, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useAuthStore } from "../store/authStore";
import ServicesTable from "../components/products/ServicesTable";

const OverviewPage = () => {
	const { user } = useAuthStore();
	if (!user) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
	const fetchSubscriptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
	const fetchServicesUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SERVICES_API_URL;

	const [azureAccount, setAzureAccount] = useState(null);
	const [azureSubscriptions, setSubscriptions] = useState([]);
	const [services, setServices] = useState([]);
	const [subsLoading, setSubsLoading] = useState(true);
	const [servicesLoading, setServicesLoading] = useState(false);
	const [fetchError, setFetchError] = useState(null);

	// 1. Fetch Azure Account stored for the user
	const fetchAccount = useCallback(async () => {
		try {
			setFetchError(null);
			const response = await fetch(fetchApiUrl, {
				method: "GET",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});
			if (!response.ok) throw new Error("Failed to fetch Azure account data");
			const data = await response.json();

			if (data.azureAccounts && data.azureAccounts.length > 0) {
				setAzureAccount(data.azureAccounts[0]);
			} else {
				setAzureAccount(null);
				setSubsLoading(false);
			}
		} catch (error) {
			console.error("Error fetching Azure details:", error);
			setFetchError(error.message);
			setSubsLoading(false);
		}
	}, [fetchApiUrl]);

	useEffect(() => {
		fetchAccount();
	}, [fetchAccount]);

	// 2. Once Azure account is available, fetch active subscriptions
	useEffect(() => {
		if (!azureAccount) return;

		let isMounted = true;
		const fetchSubscriptions = async () => {
			try {
				setSubsLoading(true);
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
				};

				const response = await fetch(fetchSubscriptionsUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				if (!response.ok) throw new Error("Failed to fetch subscription data");
				const result = await response.json();
				if (isMounted) {
					setSubscriptions(result.data || []);
					setSubsLoading(false);
				}
			} catch (error) {
				console.error("Error fetching Azure subscriptions:", error);
				if (isMounted) {
					setFetchError(error.message);
					setSubsLoading(false);
				}
			}
		};
		fetchSubscriptions();

		return () => {
			isMounted = false;
		};
	}, [fetchSubscriptionsUrl, azureAccount]);

	// 3. Once subscriptions are loaded, fetch services inventory
	useEffect(() => {
		if (!azureAccount || !azureSubscriptions || azureSubscriptions.length === 0) return;

		let isMounted = true;
		const fetchServices = async () => {
			try {
				setServicesLoading(true);
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
					subscriptionId: azureSubscriptions[0].id,
				};

				const response = await fetch(fetchServicesUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				if (!response.ok) throw new Error("Failed to fetch services data");
				const servicesData = await response.json();
				if (isMounted) {
					setServices(servicesData.data || []);
				}
			} catch (error) {
				console.error("Error fetching services:", error);
				if (isMounted) {
					setFetchError(error.message);
				}
			} finally {
				if (isMounted) {
					setServicesLoading(false);
				}
			}
		};
		fetchServices();

		return () => {
			isMounted = false;
		};
	}, [fetchServicesUrl, azureAccount, azureSubscriptions]);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
			<Header
				title="Azure Infrastructure Overview"
				subtitle="Continuous telemetry, discovered inventory, and cloud posture health"
			/>

			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Optional Error Alert */}
				{fetchError && (
					<div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
						<div className="flex items-center gap-2">
							<AlertCircle size={16} />
							<span>Telemetry Sync Warning: {fetchError}</span>
						</div>
						<button
							onClick={() => fetchAccount()}
							className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 transition text-[11px] font-mono cursor-pointer"
						>
							Retry Sync
						</button>
					</div>
				)}

				{/* Top Status Cards */}
				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<StatCard
						name="Tenant Status"
						icon={Cloud}
						value={
							azureAccount ? "Connected & Active" : "No Account Linked"
						}
						description={azureAccount?.azureEmail || "Configure in Settings"}
						color="#22d3ee"
					/>
					<StatCard
						name="Subscriptions"
						icon={ShieldCheck}
						value={
							subsLoading
								? "Syncing..."
								: azureSubscriptions.length > 0
								? `${azureSubscriptions.length} Active`
								: "0 Active"
						}
						description={
							azureSubscriptions.length > 0
								? "Monitored cloud scopes"
								: "Check IAM Reader role"
						}
						color="#34d399"
					/>
					<StatCard
						name="Primary Subscription"
						icon={Zap}
						value={
							subsLoading
								? "Syncing..."
								: azureSubscriptions.length > 0
								? azureSubscriptions[0].name
								: "Not Found"
						}
						description={
							azureSubscriptions[0]?.id
								? `ID: ${azureSubscriptions[0].id.slice(0, 8)}...`
								: "Authorize Subscription"
						}
						color="#f59e0b"
					/>
					<StatCard
						name="Discovered Resources"
						icon={Server}
						value={servicesLoading ? "Scanning..." : services.length}
						description="Compute, network, & storage assets"
						color="#818cf8"
					/>
				</motion.div>

				{/* Resource Table */}
				<ServicesTable servicesData={services} />
			</main>
		</div>
	);
};

export default OverviewPage;
