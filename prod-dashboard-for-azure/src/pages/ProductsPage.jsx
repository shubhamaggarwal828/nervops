import { BarChart2, Heading, Import, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Server, Globe, Folder, Database, MapPin, Cloud } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import DetailedAzureMetrics from "../components/products/DetailedAzureMetrics";
import OrderDistribution from "../components/orders/OrderDistribution";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend as RechartsLegend,
	PieChart,
	Pie,
	Cell,
	Sector,
	LineChart,
	Line,
	RadialBarChart,
	RadialBar
  } from "recharts";
  import DailySalesTrend from "../components/sales/DailySalesTrend";
  import ServicesBarChart from "../components/products/ServicesBarChart";
  import ServicesBarChartByResourceGroup from "../components/products/ServicesBarChartByResourceGroup";
  import PieCharts from "../components/products/PieCharts";
/* =========================
   Basic Metrics Cards Component
   ========================= */
const MetricsCards = ({ services }) => {
	const total = services.length;
	const succeeded = services.filter(
		(s) => s.properties && s.properties.provisioningState === "Succeeded"
	).length;
	const successRate = total ? ((succeeded / total) * 100).toFixed(1) : "0.0";

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<StatCard
				name="Total Services"
				icon={Zap}
				value={total}
				color="#6366F1"
			/>
			<StatCard
				name="Succedeed"
				icon={Zap}
				value={succeeded}
				color="#6366F1"
			/>
			<StatCard
				name="Success Rate (%)"
				icon={Zap}
				value={successRate}
				color="#6366F1"
			/>
		</div>
	);
};

/* =========================
   Extra Metrics Cards Component
   ========================= */
const ExtraMetricsCards = ({ services }) => {
	// Count VMs: those whose type contains "Microsoft.Compute/virtualMachines"
	const vmCount = services.filter(s =>
		s.type && s.type.toLowerCase().includes("microsoft.compute/virtualmachines")
	).length;

	// Count Public IPs: type contains "Microsoft.Network/publicipaddresses"
	const publicIpCount = services.filter(s =>
		s.type && s.type.toLowerCase().includes("microsoft.network/publicipaddresses")
	).length;

	// Unique Resource Groups (extracted from id)
	const getResourceGroup = (id) => {
		const match = id.match(/resourceGroups\/([^/]+)\//i);
		return match ? match[1].toLowerCase() : null;
	};
	const resourceGroups = services
		.map(s => s.id ? getResourceGroup(s.id) : null)
		.filter(Boolean);
	const uniqueResourceGroups = Array.from(new Set(resourceGroups)).length;

	// Unique Providers: substring before "/" in type
	const providers = services
		.map(s => s.type ? s.type.split("/")[0] : null)
		.filter(Boolean);
	const uniqueProviders = Array.from(new Set(providers)).length;

	// Zones Count: Count distinct zones from resources with a "zones" array.
	const zones = services.flatMap(s =>
		s.zones && Array.isArray(s.zones) ? s.zones : []
	);
	const uniqueZones = Array.from(new Set(zones)).length;

	// DNS Count: Count resources that have properties.dnsSettings defined.
	const dnsCount = services.filter(s =>
		s.properties && s.properties.dnsSettings
	).length;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<StatCard
				name="VM Count"
				icon={Server}
				value={vmCount}
				color="#4F46E5"
			/>
			<StatCard
				name="Public IP Count"
				icon={Globe}
				value={publicIpCount}
				color="#2563EB"
			/>
			<StatCard
				name="Unique Resource Groups"
				icon={Folder}
				value={uniqueResourceGroups}
				color="#9333EA"
			/>
			<StatCard
				name="Unique Providers"
				icon={Database}
				value={uniqueProviders}
				color="#7C3AED"
			/>
			<StatCard
				name="Zones Count"
				icon={MapPin}
				value={uniqueZones}
				color="#DB2777"
			/>
			<StatCard
				name="DNS Count"
				icon={Cloud}
				value={dnsCount}
				color="#059669"
			/>
		</div>

	);
};








const ServicesPieChartByType = ({ services }) => {
	// Process data
	const counts = services.reduce((acc, service) => {
	  const type = service.type || "Unknown";
	  acc[type] = (acc[type] || 0) + 1;
	  return acc;
	}, {});
  
	// Format data for OrderDistribution
	const pieChartData = Object.entries(counts).map(([type, count]) => ({
	  name: type,
	  value: count,
	}));
	return (
	  <div className="mt-8">
		{/* Pass dynamic data to OrderDistribution */}
		<PieCharts data={pieChartData} heading={"Services by Type"} />
	  </div>
	);
  };


  const ServicesPieChartByProvisioning = ({ services }) => {
	// Process data
	const counts = services.reduce((acc, service) => {
	  const state = (service.properties && service.properties.provisioningState) || "N/A";
	  acc[state] = (acc[state] || 0) + 1;
	  return acc;
	}, {});
  
	// Format data for PieCharts
	const pieChartData = Object.entries(counts).map(([state, count]) => ({
	  name: state,
	  value: count,
	}));
  
	return (
	  <div className="mt-8">
		{/* Pass dynamic data to PieCharts */}
		<PieCharts data={pieChartData} heading={"Services by Provisioning State"} />
	  </div>
	);
  };
  

  const ServicesPieChartBySKU = ({ services }) => {
	// Filter and transform the services data
	const skuServices = services.filter((s) => s.sku && s.sku.name);
	const counts = skuServices.reduce((acc, service) => {
	  const skuName = service.sku.name || "Unknown";
	  acc[skuName] = (acc[skuName] || 0) + 1;
	  return acc;
	}, {});
  
	// Transform counts into chart data
	const pieChartData = Object.entries(counts).map(([sku, count]) => ({
	  name: sku,
	  value: count,
	}));
  
	return (
	  <div className="mt-8">
		<PieCharts data={pieChartData} heading="Services by SKU Distribution" />
	  </div>
	);
  };




const ProductsPage = () => {
	const { user } = useAuthStore();
	if (!user) {
		// Render a loading spinner or placeholder if user data is not yet available
		return <p>Loading user data...</p>;
	}

	// API endpoints from environment variables
	const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
	const storeApiUrl = import.meta.env.VITE_AZURE_DETAILS_STORE_API_URL;
	const updateApiUrl = import.meta.env.VITE_AZURE_DETAILS_UPDATE_API_URL;
	const deleteApiUrl = import.meta.env.VITE_AZURE_DETAILS_DELETE_API_URL;
	const fetchSubscriptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
	const fetchServicesUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SERVICES_API_URL;

	// Encryption parameters
	const key = import.meta.env.VITE_CRYPTO_KEY;
	const iv = import.meta.env.VITE_CRYPTO_IV;

	// Local state for the Azure account
	const [azureAccount, setAzureAccount] = useState(null);
	const [accountExists, setAccountExists] = useState(false);
	const [azureSubscriptions, setSubscriptions] = useState([]);
	const [subsLoading, setSubsLoading] = useState(true);
	const [services, setServices] = useState([]);

	// Search state
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredServices, setFilteredServices] = useState(services);

	// Update filtered services when services change
	useEffect(() => {
		setFilteredServices(services);
	}, [services]);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = services.filter(
			(service) =>
				service.name.toLowerCase().includes(term) ||
				service.type.toLowerCase().includes(term) ||
				service.location.toLowerCase().includes(term)
		);
		setFilteredServices(filtered);
	};

	// --- 1. Fetch the Azure account using GET ---
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

				// If at least one account is returned, store the first account
				if (data.azureAccounts && data.azureAccounts.length > 0) {
					const account = data.azureAccounts[0];
					setAzureAccount(account);
					setAccountExists(true);
				} else {
					setAzureAccount(null);
					setAccountExists(false);
					console.warn("No Azure account found");
				}
			} catch (error) {
				console.error("Error fetching Azure details:", error);
			}
		};
		fetchData();
	}, [fetchApiUrl]);

	// --- 2. Once the Azure account is available, call the subscriptions API using POST ---
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
				setSubscriptions(result.data);
				if (result.data && result.data.length > 0) {
					result.data.forEach((subscription, index) => {
						console.log(`Subscription ${index + 1} ID: ${subscription.id}`);
					});
				} else {
					console.log("No Azure subscriptions found.");
				}
			} catch (error) {
				console.error("Error fetching Azure subscriptions:", error);
			}
		};
		fetchSubscriptions();
	}, [fetchSubscriptionsUrl, azureAccount]);

	// --- 3. Once the Azure account and subscriptions are available, fetch services ---
	useEffect(() => {
		if (!azureAccount) return;
		if (!azureSubscriptions || azureSubscriptions.length === 0) return;

		const fetchServices = async () => {
			try {
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
					subscriptionId: azureSubscriptions[0].id,
				};

				console.log("Encrypted data:", encryptedData);

				const response = await fetch(fetchServicesUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				console.log("Response:", response);
				if (!response.ok) throw new Error("Failed to fetch services data");
				const result = await response.json();
				setServices(result.data);
				console.log("Services fetch: Full response:", result);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
				setSubsLoading(false);
			}
		};
		fetchServices();
	}, [fetchServicesUrl, azureAccount, azureSubscriptions]);

	useEffect(() => {
		if (azureSubscriptions && azureSubscriptions.length > 0) {
			azureSubscriptions.forEach((subscription, index) => {
				console.log(`Subscription ${index + 1} ID: ${subscription.id}`);
			});
		} else {
			console.log("No Azure subscriptions found or subscriptions are empty.");
		}
	}, [azureSubscriptions]);

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Overview" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* Search Input
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded w-full"
          />
        </div> */}

				{/* Metrics Cards */}
				<MetricsCards services={filteredServices} />
				<ExtraMetricsCards services={filteredServices} />
				{/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				<OrderDistribution />
				<OrderDistribution />
				</div> */}
				<div className="grid grid-cols-1 pb-8 lg:grid-cols-2 gap-8">

				<ServicesBarChart services={services} />
				<ServicesBarChartByResourceGroup services={services} />
				<ServicesPieChartByType services={filteredServices} />
				{/* <ServicesPieChartByProvisioning services={filteredServices} /> */}
				<ServicesPieChartBySKU services={filteredServices} />


				</div>
				{/* Detailed Azure Metrics */}
				<DetailedAzureMetrics servicesData={services} />

				{/* Charts (if needed) */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart /> */}


				</div>
			</main>
		</div>
	);
};

export default ProductsPage;


