import React, { useState, useEffect } from "react";
import { Server, Shield, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert } from "lucide-react";
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
	ResponsiveContainer,
	RadialBarChart,
	RadialBar,
	PieChart,
	Pie,
	Cell
} from "recharts";
import { motion } from "framer-motion";

// Helper: Shorten resource ID to "resourceGroup/resourceName"
const shortenResourceId = (id) => {
	if (!id) return "N/A";
	const match = id.match(/resourceGroups\/([^/]+)\/providers\/[^/]+\/[^/]+\/([^/]+)/i);
	return match ? `${match[1]}/${match[2]}` : id.split("/").pop();
};

// Helper: Map evaluation to label
const mapEvaluationToLabel = (evaluation) => {
	if (evaluation === "Not Secure") return "Critical";
	if (evaluation === "Warning") return "Warning";
	if (evaluation === "OK") return "Okay";
	return evaluation;
};

const UsersPage = () => {
	const { user } = useAuthStore();
	const [azureAccount, setAzureAccount] = useState(null);
	const [azureSubscriptions, setSubscriptions] = useState([]);
	const [securityData, setSecurityData] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
	const fetchSubscriptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
	const fetchSecurityMetricsUrl = import.meta.env.VITE_SECURITY_METRICS_API_URL;

	// 1. Fetch Azure account
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
				}
			} catch (error) {
				console.error("Error fetching Azure account:", error);
			}
		};
		fetchAccount();
	}, [fetchApiUrl]);

	// 2. Fetch subscriptions
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
				setSubscriptions(result.data || []);
			} catch (error) {
				console.error("Error fetching subscriptions:", error);
			}
		};
		fetchSubs();
	}, [fetchSubscriptionsUrl, azureAccount]);

	// 3. Fetch security metrics
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

	if (loading) {
		return (
			<div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
				<Header
					title="Cloud Security & Compliance Audit"
					subtitle="CIS Benchmarks, threat evaluation, and security posture score"
				/>
				<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
					<div className="flex h-96 items-center justify-center">
						<div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
					</div>
				</main>
			</div>
		);
	}

	const {
		totalResources = 0,
		securityIssues = [],
		securityGoodAspects = [],
		checkedServices = [],
		detailedNSGRules = []
	} = securityData || {};

	// Severity breakdown
	const severityCounts = { Critical: 0, Warning: 0, Okay: 0 };
	securityIssues.forEach((issue) => {
		let label = issue.severity;
		if (label === "Low") label = "Okay";
		if (label === "Medium") label = "Warning";
		if (severityCounts[label] !== undefined) severityCounts[label] += 1;
		else severityCounts[label] = 1;
	});
	if (detailedNSGRules) {
		detailedNSGRules.forEach((nsg) => {
			nsg.evaluatedRules?.forEach((rule) => {
				const label = mapEvaluationToLabel(rule.evaluation);
				if (severityCounts[label] !== undefined) severityCounts[label] += 1;
				else severityCounts[label] = 1;
			});
		});
	}
	const combinedSeverityData = [
		{ severity: "Critical", count: severityCounts.Critical, fill: "#f43f5e" },
		{ severity: "Warning", count: severityCounts.Warning, fill: "#f59e0b" },
		{ severity: "Passed", count: severityCounts.Okay + securityGoodAspects.length, fill: "#10b981" }
	];

	// Calculate overall security score (out of 100)
	let criticalCount = securityIssues.filter(
		(issue) => issue.severity === "Critical" || issue.evaluation === "Not Secure"
	).length;
	let warningCount = securityIssues.filter(
		(issue) => issue.severity === "Medium" || issue.evaluation === "Warning"
	).length;
	if (detailedNSGRules) {
		detailedNSGRules.forEach((nsg) => {
			nsg.evaluatedRules?.forEach((rule) => {
				if (rule.severity === "Critical" || rule.evaluation === "Not Secure") criticalCount++;
				else if (rule.severity === "Medium" || rule.evaluation === "Warning") warningCount++;
			});
		});
	}
	const securityScore = Math.max(0, 100 - (criticalCount * 5 + warningCount * 2));
	const scoreData = [
		{
			name: "Score",
			value: securityScore,
			fill: securityScore > 80 ? "#10b981" : securityScore > 50 ? "#f59e0b" : "#f43f5e"
		}
	];

	// Stacked NSG rules data
	const nsgStackedData = [];
	if (detailedNSGRules) {
		detailedNSGRules.forEach((nsg) => {
			const counts = { resource: shortenResourceId(nsg.resourceId), Critical: 0, Warning: 0, Okay: 0 };
			nsg.evaluatedRules?.forEach((rule) => {
				const label = mapEvaluationToLabel(rule.evaluation);
				counts[label] = (counts[label] || 0) + 1;
			});
			nsgStackedData.push(counts);
		});
	}

	return (
		<div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
			<Header
				title="Cloud Security & Compliance Audit"
				subtitle="CIS Benchmarks, threat evaluation, and security posture score"
			/>
			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				{/* Top Stat Cards */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<StatCard
						name="Evaluated Assets"
						icon={Server}
						value={totalResources}
						description="Resources audited against CIS"
						color="#06b6d4"
					/>
					<StatCard
						name="Security Posture"
						icon={ShieldCheck}
						value={`${securityScore}/100`}
						description={securityScore > 80 ? "Healthy Baseline" : "Action Recommended"}
						color={securityScore > 80 ? "#10b981" : "#f59e0b"}
					/>
					<StatCard
						name="Total Findings"
						icon={AlertTriangle}
						value={securityIssues.length}
						description={`${criticalCount} Critical, ${warningCount} Warning`}
						color="#f43f5e"
					/>
					<StatCard
						name="Hardened Baseline"
						icon={Shield}
						value={securityGoodAspects.length}
						description="Compliant control points"
						color="#10b981"
					/>
				</motion.div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					{/* Overall Security Score Gauge Card */}
					<motion.div
						className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between"
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div>
							<h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">
								Security Posture Score
							</h3>
							<p className="text-xs text-slate-400">Weighted deduction algorithm</p>
						</div>
						<div className="w-full h-52 relative flex items-center justify-center">
							<ResponsiveContainer width="100%" height="100%">
								<RadialBarChart
									cx="50%"
									cy="50%"
									innerRadius="75%"
									outerRadius="100%"
									data={scoreData}
									startAngle={180}
									endAngle={0}
								>
									<RadialBar
										background={{ fill: "#1e293b" }}
										clockWise
										dataKey="value"
										cornerRadius={8}
									/>
								</RadialBarChart>
							</ResponsiveContainer>
							<div className="absolute text-center mt-6">
								<span className="text-4xl font-extrabold font-mono text-white tracking-tight">
									{securityScore}%
								</span>
								<p className="text-[11px] font-mono text-slate-400 mt-0.5">
									{securityScore >= 80 ? "LOW RISK" : "HIGH RISK"}
								</p>
							</div>
						</div>
						<p className="text-[11px] text-slate-500 text-center font-mono">
							-5 pts per critical • -2 pts per warning
						</p>
					</motion.div>

					{/* Severity Distribution Chart */}
					<motion.div
						className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl"
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">
							Findings by Severity
						</h3>
						<p className="text-xs text-slate-400 mb-4">Total detected across all categories</p>
						<div className="w-full h-52">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={combinedSeverityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
									<XAxis dataKey="severity" stroke="#64748b" fontSize={12} tick={{ fill: "#94a3b8" }} />
									<YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tick={{ fill: "#94a3b8" }} />
									<RechartsTooltip
										contentStyle={{
											backgroundColor: "#0f172a",
											borderColor: "#1e293b",
											borderRadius: "0.75rem",
											fontSize: "12px",
										}}
									/>
									<Bar dataKey="count" radius={[6, 6, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</motion.div>

					{/* Service Coverage / Checked Services */}
					<motion.div
						className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between"
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div>
							<h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">
								Security Benchmark Coverage
							</h3>
							<p className="text-xs text-slate-400 mb-3">Core Azure services evaluated</p>
						</div>
						<div className="space-y-2 overflow-y-auto max-h-52 pr-1">
							{checkedServices.map((item, idx) => (
								<div
									key={idx}
									className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80"
								>
									<span className="text-xs font-medium text-slate-300 font-mono">
										{item.service}
									</span>
									<span
										className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
											item.used
												? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
												: "bg-slate-800 text-slate-400"
										}`}
									>
										{item.used ? "EVALUATED" : "NOT DEPLOYED"}
									</span>
								</div>
							))}
						</div>
					</motion.div>
				</div>

				{/* Stacked NSG Rules BarChart if available */}
				{nsgStackedData.length > 0 && (
					<motion.div
						className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl mb-8"
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">
							NSG Rule Risk Distribution per Security Group
						</h3>
						<p className="text-xs text-slate-400 mb-4">Breakdown of open and restricted ports across your NSGs</p>
						<div className="w-full h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={nsgStackedData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
									<XAxis dataKey="resource" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" tick={{ fill: "#94a3b8" }} />
									<YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tick={{ fill: "#94a3b8" }} />
									<RechartsTooltip
										contentStyle={{
											backgroundColor: "#0f172a",
											borderColor: "#1e293b",
											borderRadius: "0.75rem",
											fontSize: "12px",
										}}
									/>
									<RechartsLegend verticalAlign="top" height={36} />
									<Bar dataKey="Critical" stackId="a" fill="#f43f5e" radius={[0, 0, 0, 0]} />
									<Bar dataKey="Warning" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
									<Bar dataKey="Okay" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</motion.div>
				)}

				{/* Detailed Audit Tables */}
				<DetailedSecurityMetrics data={securityData} />
			</main>
		</div>
	);
};

export default UsersPage;
