import { Cloud, Zap, Server, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
	const fetchSubscirptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
	const fetchServicessUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SERVICES_API_URL;

	const [azureAccount, setAzureAccount] = useState(null);
	const [azureSubscriptions, setSubscriptions] = useState([]);
	const [subsLoading, setSubsLoading] = useState(true);
	const [services, setServices] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(fetchApiUrl, {
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
				});
				if (!response.ok) throw new Error("Failed to fetch Azure account data");
				const data = await response.json();

				if (data.azureAccounts && data.azureAccounts.length > 0) {
					setAzureAccount(data.azureAccounts[0]);
				}
			} catch (error) {
				console.error("Error fetching Azure details:", error);
			}
		};
		fetchData();
	}, [fetchApiUrl]);

	useEffect(() => {
		if (!azureAccount) return;

		const fetchSubscriptions = async () => {
			try {
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
				};

				const response = await fetch(fetchSubscirptionsUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				if (!response.ok) throw new Error("Failed to fetch subscription data");
				const result = await response.json();
				setSubscriptions(result.data || []);
			} catch (error) {
				console.error("Error fetching Azure subscriptions:", error);
			}
		};
		fetchSubscriptions();
	}, [fetchSubscirptionsUrl, azureAccount]);

	useEffect(() => {
		if (!azureAccount || !azureSubscriptions || azureSubscriptions.length === 0) return;

		const fetchServices = async () => {
			try {
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
					subscriptionId: azureSubscriptions[0].id,
				};

				const response = await fetch(fetchServicessUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				if (!response.ok) throw new Error("Failed to fetch services data");
				const servicesData = await response.json();
				setServices(servicesData.data || []);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
				setSubsLoading(false);
			}
		};
		fetchServices();
	}, [fetchServicessUrl, azureAccount, azureSubscriptions]);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
			<Header
				title="Azure Infrastructure Overview"
				subtitle="Continuous telemetry, discovered inventory, and cloud posture health"
			/>

			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
						value={subsLoading ? "Loading..." : `${azureSubscriptions.length} Active`}
						description="Monitored cloud scopes"
						color="#34d399"
					/>
					<StatCard
						name="Primary Subscription"
						icon={Zap}
						value={
							subsLoading
								? "Loading..."
								: azureSubscriptions.length > 0
								? azureSubscriptions[0].name
								: "N/A"
						}
						description={azureSubscriptions[0]?.id ? `ID: ${azureSubscriptions[0].id.slice(0, 8)}...` : "None"}
						color="#f59e0b"
					/>
					<StatCard
						name="Discovered Resources"
						icon={Server}
						value={subsLoading ? "..." : services.length}
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
