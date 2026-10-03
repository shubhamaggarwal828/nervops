import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Server, Globe, Folder, Database, MapPin, Cloud, CheckCircle, Zap, Shield, Cpu } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useAuthStore } from "../store/authStore";
import DetailedAzureMetrics from "../components/products/DetailedAzureMetrics";
import ServicesBarChart from "../components/products/ServicesBarChart";
import ServicesBarChartByResourceGroup from "../components/products/ServicesBarChartByResourceGroup";
import PieCharts from "../components/products/PieCharts";

/* =========================
   Primary & Secondary KPI Metric Cards
   ========================= */
const MetricsCards = ({ services }) => {
	const total = services.length;
	const succeeded = services.filter(
		(s) => s.properties && s.properties.provisioningState === "Succeeded"
	).length;
	const successRate = total ? ((succeeded / total) * 100).toFixed(1) : "100.0";

	// VM count
	const vmCount = services.filter(s =>
		s.type && s.type.toLowerCase().includes("microsoft.compute/virtualmachines")
	).length;

	// Public IP count
	const publicIpCount = services.filter(s =>
		s.type && s.type.toLowerCase().includes("microsoft.network/publicipaddresses")
	).length;

	// Resource Groups
	const getResourceGroup = (id) => {
		const match = id?.match(/resourceGroups\/([^/]+)\//i);
		return match ? match[1].toLowerCase() : null;
	};
	const resourceGroups = services
		.map(s => s.id ? getResourceGroup(s.id) : null)
		.filter(Boolean);
	const uniqueResourceGroups = Array.from(new Set(resourceGroups)).length;

	// Unique Providers
	const providers = services
		.map(s => s.type ? s.type.split("/")[0] : null)
		.filter(Boolean);
	const uniqueProviders = Array.from(new Set(providers)).length;

	// Zones Count
	const zones = services.flatMap(s =>
		s.zones && Array.isArray(s.zones) ? s.zones : []
	);
	const uniqueZones = Array.from(new Set(zones)).length;

	return (
		<motion.div
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<StatCard
				name="Total Services"
				icon={Server}
				value={total}
				description="Discovered resources"
				color="#06b6d4"
			/>
			<StatCard
				name="Provisioned OK"
				icon={CheckCircle}
				value={succeeded}
				description={`${successRate}% Success Rate`}
				color="#10b981"
			/>
			<StatCard
				name="Virtual Machines"
				icon={Cpu}
				value={vmCount}
				description="Compute instances"
				color="#8b5cf6"
			/>
			<StatCard
				name="Public IPs"
				icon={Globe}
				value={publicIpCount}
				description="Direct edge exposures"
				color="#f59e0b"
			/>
			<StatCard
				name="Resource Groups"
				icon={Folder}
				value={uniqueResourceGroups}
				description="Management boundaries"
				color="#ec4899"
			/>
			<StatCard
				name="ARM Providers"
				icon={Database}
				value={uniqueProviders}
				description="Compute, net, storage..."
				color="#3b82f6"
			/>
		</motion.div>
	);
};

/* =========================
   Pie Chart: Services by Type
   ========================= */
const ServicesPieChartByType = ({ services }) => {
	const counts = services.reduce((acc, service) => {
		const type = service.type ? service.type.split("/").pop() : "Unknown";
		acc[type] = (acc[type] || 0) + 1;
		return acc;
	}, {});

	const pieChartData = Object.entries(counts).map(([type, count]) => ({
		name: type,
		value: count,
	}));

	return <PieCharts data={pieChartData} heading="Resource Type Distribution" />;
};

/* =========================
   Pie Chart: Services by SKU Distribution
   ========================= */
const ServicesPieChartBySKU = ({ services }) => {
	const skuServices = services.filter((s) => s.sku && s.sku.name);
	const counts = skuServices.reduce((acc, service) => {
		const skuName = service.sku.name || "Default";
		acc[skuName] = (acc[skuName] || 0) + 1;
		return acc;
	}, {});

	const pieChartData = Object.entries(counts).map(([sku, count]) => ({
		name: sku,
		value: count,
	}));

	if (pieChartData.length === 0) {
		pieChartData.push({ name: "Standard / Default Tier", value: services.length || 1 });
	}

	return <PieCharts data={pieChartData} heading="SKU & Tier Allocation" />;
};

const ProductsPage = () => {
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
	const [loading, setLoading] = useState(true);

	// Fetch Azure account
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

	// Fetch Subscriptions
	useEffect(() => {
		if (!azureAccount) return;

		const fetchSubscriptions = async () => {
			try {
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
				setSubscriptions(result.data || []);
			} catch (error) {
				console.error("Error fetching Azure subscriptions:", error);
			}
		};
		fetchSubscriptions();
	}, [fetchSubscriptionsUrl, azureAccount]);

	// Fetch Services
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

				const response = await fetch(fetchServicesUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				if (!response.ok) throw new Error("Failed to fetch services data");
				const result = await response.json();
				setServices(result.data || []);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchServices();
	}, [fetchServicesUrl, azureAccount, azureSubscriptions]);

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
			<Header
				title="Detailed Azure Metrics & Mapping"
				subtitle="Granular resource distribution, compute topology, and regional mapping"
			/>
			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Top KPI Metrics */}
				<MetricsCards services={services} />

				{/* Resource Mapping & Distribution Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					<ServicesBarChart services={services} />
					<ServicesBarChartByResourceGroup services={services} />
					<ServicesPieChartByType services={services} />
					<ServicesPieChartBySKU services={services} />
				</div>

				{/* Detailed Resource Inspector */}
				<DetailedAzureMetrics servicesData={services} />
			</main>
		</div>
	);
};

export default ProductsPage;
