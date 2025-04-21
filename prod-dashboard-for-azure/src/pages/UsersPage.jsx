// UsersPage.jsx
import React, { useState, useEffect } from "react";
import { Server, Shield, AlertTriangle } from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DetailedSecurityMetrics from "../components/products/DetailedSecurityMetrics";
import { useAuthStore } from "../store/authStore";
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
	RadialBarChart,
	RadialBar,
	ResponsiveContainer
} from "recharts";

// Helper: Shorten resource ID to "resourceGroup/resourceName"
const shortenResourceId = (id) => {
	const match = id.match(/resourceGroups\/([^/]+)\/providers\/[^/]+\/[^/]+\/([^/]+)/i);
	return match ? `${match[1]}/${match[2]}` : id;
};

// Helper: Map evaluation to a label for grouping
const mapEvaluationToLabel = (evaluation) => {
	if (evaluation === "Not Secure") return "Critical";
	if (evaluation === "Warning") return "Warning";
	if (evaluation === "OK") return "Okay";
	return evaluation;
};

// Colors for severity labels
const severityColors = {
	Critical: "#DC2626", // red
	Warning: "#FACC15",  // yellow
	Okay: "#10B981"      // green
};

const UsersPage = () => {
	const { user } = useAuthStore();
	const [azureAccount, setAzureAccount] = useState(null);
	const [azureSubscriptions, setSubscriptions] = useState([]);
	const [securityData, setSecurityData] = useState(null); // holds security metrics report
	const [loading, setLoading] = useState(true);

	// API endpoints from environment variables
	const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
	const fetchSubscriptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
	const fetchSecurityMetricsUrl = import.meta.env.VITE_SECURITY_METRICS_API_URL;

	// --- 1. Fetch Azure account using GET ---
	useEffect(() => {
		const fetchAccount = async () => {
			try {
				const response = await fetch(fetchApiUrl, {
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json" }
				});
				if (!response.ok) throw new Error("Failed to fetch Azure account data");
				const data = await response.json();
				if (data.azureAccounts && data.azureAccounts.length > 0) {
					setAzureAccount(data.azureAccounts[0]);
				} else {
					setAzureAccount(null);
					console.warn("No Azure account found");
				}
			} catch (error) {
				console.error("Error fetching Azure account:", error);
			}
		};
		fetchAccount();
	}, [fetchApiUrl]);

	// --- 2. Fetch subscriptions ---
	useEffect(() => {
		if (!azureAccount) return;
		const fetchSubs = async () => {
			try {
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret
				};
				const response = await fetch(fetchSubscriptionsUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData)
				});
				if (!response.ok) throw new Error("Failed to fetch subscription data");
				const result = await response.json();
				setSubscriptions(result.data);
			} catch (error) {
				console.error("Error fetching subscriptions:", error);
			}
		};
		fetchSubs();
	}, [fetchSubscriptionsUrl, azureAccount]);

	// --- 3. Fetch security metrics ---
	useEffect(() => {
		if (!azureAccount || !azureSubscriptions || azureSubscriptions.length === 0) return;
		const fetchMetrics = async () => {
			try {
				const encryptedData = {
					encryptedTenantId: azureAccount.tenantId,
					encryptedClientId: azureAccount.clientId,
					encryptedClientSecret: azureAccount.clientSecret,
					subscriptionId: azureSubscriptions[0].id
				};
				const response = await fetch(fetchSecurityMetricsUrl, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(encryptedData)
				});
				if (!response.ok) throw new Error("Failed to fetch security metrics");
				const result = await response.json();
				setSecurityData(result.data);
			} catch (error) {
				console.error("Error fetching security metrics:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchMetrics();
	}, [fetchSecurityMetricsUrl, azureAccount, azureSubscriptions]);

	// Render blank placeholders while loading
	if (loading)
		return (
			<div className="flex-1 overflow-auto relative z-10">
				<Header title="Security Overview" />
				<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<StatCard name="Total Resources" icon={Server} value="" color="#4F46E5" />
						<StatCard name="Issues Found" icon={AlertTriangle} value="" color="#DC2626" />
						<StatCard name="Good Configurations" icon={Shield} value="" color="#16A34A" />
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700 min-h-[300px]"></div>
						<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700 min-h-[300px]"></div>
					</div>
					<div className="min-h-[400px]"></div>
				</main>
			</div>
		);

	// Destructure key metrics from securityData
	const { totalResources, securityIssues, securityGoodAspects, checkedServices, missingServices, detailedNSGRules } = securityData;

	// Chart Data: Issues by Severity (from securityIssues only)
	const severityCounts = securityIssues.reduce((acc, issue) => {
		// Map "Low" -> "Okay", "Medium" -> "Warning"
		let label = issue.severity;
		if (label === "Low") label = "Okay";
		if (label === "Medium") label = "Warning";
		acc[label] = (acc[label] || 0) + 1;
		return acc;
	}, {});
	// Also add NSG rules evaluations counts
	if (detailedNSGRules) {
		detailedNSGRules.forEach(nsg => {
			nsg.evaluatedRules.forEach(rule => {
				const label = mapEvaluationToLabel(rule.evaluation);
				severityCounts[label] = (severityCounts[label] || 0) + 1;
			});
		});
	}
	const combinedSeverityData = Object.entries(severityCounts).map(([severity, count]) => ({ severity, count }));

	// Chart Data: Issues by Group (from securityIssues)
	const issuesByGroup = securityIssues.reduce((acc, issue) => {
		const group = issue.group;
		acc[group] = (acc[group] || 0) + 1;
		return acc;
	}, {});
	const issuesGroupData = Object.entries(issuesByGroup).map(([group, count]) => ({ group, count }));

	// Chart Data: Good Configurations by Group (from securityGoodAspects)
	const goodByGroup = securityGoodAspects.reduce((acc, good) => {
		const group = good.group;
		acc[group] = (acc[group] || 0) + 1;
		return acc;
	}, {});
	const goodGroupData = Object.entries(goodByGroup).map(([group, count]) => ({ group, count }));

	// Chart Data: Overall Security Ratio (Issues vs Good)
	const overallRatioData = [
		{ name: "Issues", value: securityIssues.length },
		{ name: "Good", value: securityGoodAspects.length }
	];

	// Chart Data: Service Usage (from checkedServices)
	const usedCount = checkedServices.filter((s) => s.used).length;
	const notUsedCount = checkedServices.length - usedCount;
	const usageData = [
		{ name: "Used", value: usedCount },
		{ name: "Not Used", value: notUsedCount }
	];

	// Calculate overall security score (formula: 100 - (Critical issues × 5 + Warning issues × 2))
	let criticalCount = securityIssues.filter(
		(issue) => issue.severity === "Critical" || issue.evaluation === "Not Secure"
	).length;
	let warningCount = securityIssues.filter(
		(issue) => issue.severity === "Medium" || issue.evaluation === "Warning"
	).length;
	// Also include NSG rule counts
	if (detailedNSGRules) {
		detailedNSGRules.forEach(nsg => {
			nsg.evaluatedRules.forEach(rule => {
				if (rule.severity === "Critical" || rule.evaluation === "Not Secure") criticalCount++;
				else if (rule.severity === "Medium" || rule.evaluation === "Warning") warningCount++;
			});
		});
	}
	const securityScore = Math.max(0, 100 - (criticalCount * 5 + warningCount * 2));

	const scoreData = [{ name: "Score", value: securityScore }];

	// Impact Contributions: points deducted by critical and warning issues
	const impactData = [
		{ name: "Critical Impact", value: criticalCount * 5 },
		{ name: "Warning Impact", value: warningCount * 2 },
		{ name: "Remaining", value: Math.max(0, 100 - (criticalCount * 5 + warningCount * 2)) }
	];

	// Additional Chart: Stacked NSG Rules Chart
	const nsgStackedData = [];
	if (detailedNSGRules) {
		detailedNSGRules.forEach(nsg => {
			const counts = { resource: shortenResourceId(nsg.resourceId), Critical: 0, Warning: 0, Okay: 0 };
			nsg.evaluatedRules.forEach(rule => {
				const label = mapEvaluationToLabel(rule.evaluation);
				counts[label] = (counts[label] || 0) + 1;
			});
			nsgStackedData.push(counts);
		});
	}

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Security Overview" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				{/* Metrics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<StatCard name="Total Resources" icon={Server} value={totalResources} color="#4F46E5" />
					<StatCard name="Issues Found" icon={AlertTriangle} value={securityIssues.length} color="#DC2626" />
					<StatCard name="Good Configurations" icon={Shield} value={securityGoodAspects.length} color="#16A34A" />
				</div>
				{/* Detailed Security Metrics Tables */}
				<DetailedSecurityMetrics data={securityData} />

				{/* Table for Checked Services */}
				<div className="overflow-x-auto mb-8">
					<h3 className="text-xl font-semibold text-gray-100 mb-2">Services Usage</h3>
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Used</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{checkedServices.map((item, idx) => (
								<tr key={idx} className="hover:bg-gray-800">
									<td className="px-4 py-2 text-sm text-gray-300">{item.service}</td>
									<td
										className="px-4 py-2 text-sm font-bold"
										style={{ color: item.used ? "#10B981" : "#DC2626" }}
									>
										{item.used ? "Yes" : "No"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Dynamic Graphs */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Combined Issues by Severity Chart */}
					<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700">
						<h3 className="text-xl font-semibold text-gray-100 mb-4">Combined Issues by Severity</h3>
						<BarChart width={500} height={300} data={combinedSeverityData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="severity" stroke="#fff" />
							<YAxis stroke="#fff" />
							<RechartsTooltip />
							<RechartsLegend />
							<Bar dataKey="count" fill="#F97316" />
						</BarChart>
					</div>
					{/* Service Usage Chart
					<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700">
						<h3 className="text-xl font-semibold text-gray-100 mb-4">Service Usage</h3>
						<PieChart width={400} height={300}>
							<Pie
								dataKey="value"
								data={usageData}
								cx="50%"
								cy="50%"
								outerRadius={80}
								innerRadius={40}
								label={({ payload }) => `${payload.name}: ${payload.value}`}
							>
								{usageData.map((entry, index) => (
									<Cell key={`cell-usage-${index}`} fill={entry.name === "Used" ? "#10B981" : "#DC2626"} />
								))}
							</Pie>
							<RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
							<RechartsLegend />
						</PieChart>
					</div> */}


				{/* Additional Graphs */}
				

				{/* Overall Security Score Gauge */}
				<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700 mb-8">
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Overall Security Score</h3>
					<ResponsiveContainer width="100%" height={300}>
						<RadialBarChart
							cx="50%"
							cy="50%"
							innerRadius="70%"
							outerRadius="100%"
							data={scoreData}
							startAngle={180}
							endAngle={0}
						>
							<RadialBar minAngle={15} background clockWise dataKey="value" fill="#F97316" />
							<RechartsTooltip />
						</RadialBarChart>
					</ResponsiveContainer>
					<div className="text-center mt-2 text-white text-xl">{securityScore}%</div>
					<p className="text-gray-400 text-sm mt-1">
						Calculated as 100 - (Critical issues × 5 + Warning issues × 2)
					</p>
				</div>

				{/* Impact Contributions Chart */}
				<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700 mb-8">
					<h3 className="text-xl font-semibold text-gray-100 mb-4">Impact Contributions</h3>
					<BarChart width={500} height={300} data={impactData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" stroke="#fff" />
						<YAxis stroke="#fff" />
						<RechartsTooltip />
						<RechartsLegend />
						<Bar dataKey="value" fill="#F97316" />
					</BarChart>
					<p className="text-gray-400 text-sm mt-1">
						Shows points deducted: Critical issues (×5) and Warning issues (×2)
					</p>
				</div>

				{/* Stacked NSG Rules Chart */}
				{nsgStackedData.length > 0 && (
					<div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700 mb-8">
						<h3 className="text-xl font-semibold text-gray-100 mb-4">NSG Rules Summary (Stacked)</h3>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={nsgStackedData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="resource" stroke="#fff" />
								<YAxis stroke="#fff" />
								<RechartsTooltip />
								<RechartsLegend />
								<Bar dataKey="Critical" stackId="a" fill="#DC2626" />
								<Bar dataKey="Warning" stackId="a" fill="#FACC15" />
								<Bar dataKey="Okay" stackId="a" fill="#10B981" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				
				)}

</div>

			</main>
		</div>
	);
};

export default UsersPage;
