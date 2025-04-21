import { BarChart2, Import, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import ServicesTable from "../components/products/ServicesTable";
const OverviewPage = () => {
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
	const fetchSubscirptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
	const fetchServicessUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SERVICES_API_URL;

	// Encryption parameters
	const key = import.meta.env.VITE_CRYPTO_KEY;
	const iv = import.meta.env.VITE_CRYPTO_IV;

	// Local state for the Azure account
	const [azureAccount, setAzureAccount] = useState(null);
	const [accountExists, setAccountExists] = useState(false);
	const [azureSubscriptions, setSubscriptions] = useState(null);
	const [subsLoading, setSubsLoading] = useState(true);
	const [services, setServices] = useState(true);



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
					//   console.log("Azure account found:", account);
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
		// Only run if we have an azureAccount
		if (!azureAccount) return;

		const fetchSubscriptions = async () => {
			try {
				// Prepare the encrypted data from the azureAccount fields
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
				};

				// console.log("Encrypted data:", encryptedData);

				const response = await fetch(fetchSubscirptionsUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				// console.log("Response:", response);
				if (!response.ok) throw new Error("Failed to fetch subscription data");
				const result = await response.json();
				// console.log("Subscription fetch: Full response:", result);
				setSubscriptions(result.data);
				// Check if the response has a "data" array with subscriptions
				if (result.data && result.data.length > 0) {
					//   console.log(`Total subscriptions found: ${result.data.length}`);
					result.data.forEach((subscription, index) => {
						// console.log(`Subscription ${index + 1} ID: ${subscription.id}`);
					});
				} else {
					console.log("No Azure subscriptions found.");
				}
			} catch (error) {
				console.error("Error fetching Azure subscriptions:", error);
			}
		};
		fetchSubscriptions();
	}, [fetchSubscirptionsUrl, azureAccount]);


	useEffect(() => {
		// Only run if we have an azureAccount
		if (!azureAccount) return;
		if (!azureSubscriptions) return;

		const fetchServices = async () => {
			try {
				// Prepare the encrypted data from the azureAccount fields
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
					subscriptionId: azureSubscriptions[0].id,
				};

				console.log("Encrypted data:", encryptedData);

				const response = await fetch(fetchServicessUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData),
				});
				console.log("Response:", response);
				if (!response.ok) throw new Error("Failed to fetch subscription data");
				const services = await response.json();
				// console.log("Subscription fetch: Full response:", result);
				setServices(services.data);
				console.log("Services fetch: Full response:", services);
				
				// // Check if the response has a "data" array with subscriptions
				// if (result.data && result.data.length > 0) {
				// 	  console.log(`Total services found: ${result.data.length}`);
				// 	result.data.forEach((subscription, index) => {
				// 		// console.log(`Subscription ${index + 1} ID: ${subscription.id}`);
				// 	});
				// } else {
				// 	console.log("No Azure subscriptions found.");
				// }
			} catch (error) {
				console.error("Error fetching Azure subscriptions:", error);
			}
			finally {
				setSubsLoading(false);
			}
		};
		fetchServices();
	}, [fetchServicessUrl, azureAccount , azureSubscriptions]);


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
				{/* STATS */}
				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name="Service Status"
						icon={Zap}
						value={
							subsLoading
								? "..."
								: azureSubscriptions.length > 0
									? "Services Running"
									: "No subscriptions"
						}
						color="#6366F1"
					/>
					<StatCard
						name="Total Subscriptions"
						icon={Zap}
						value={subsLoading ? "..." : azureSubscriptions.length}
						color="#6366F1"
					/>
					<StatCard
						name="Subscription Name"
						icon={Zap}
						value={
							subsLoading
								? "..."
								: azureSubscriptions.length > 0
									? azureSubscriptions[0].name
									: "No subscriptions"
						}
						color="#6366F1"
					/>
					<StatCard
						name="Total Services Used"
						icon={Zap}
						value={subsLoading ? "..." : services.length}
						color="#6366F1"
					/>
					

					
				</motion.div>
				<ServicesTable servicesData={services} />


				{/* CHARTS */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* <SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart /> */}
				</div>
			</main>
		</div>
	);
};

export default OverviewPage;
