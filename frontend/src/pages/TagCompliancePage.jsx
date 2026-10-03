import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  FileCheck2
} from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useAuthStore } from "../store/authStore";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// Default Required Governance Tags for Enterprise Cloud Security
const DEFAULT_REQUIRED_TAGS = ["Environment", "Owner", "Project", "CostCenter"];

const TagCompliancePage = () => {
  const { user } = useAuthStore();
  const [azureAccount, setAzureAccount] = useState(null);
  const [azureSubscriptions, setSubscriptions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Policy configuration
  const [requiredTags, setRequiredTags] = useState(DEFAULT_REQUIRED_TAGS);
  const [newTagInput, setNewTagInput] = useState("");
  const [filterCompliance, setFilterCompliance] = useState("all"); // 'all' | 'compliant' | 'non-compliant'
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState([]);

  const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
  const fetchSubscriptionsUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL;
  const fetchServicesUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_SERVICES_API_URL;

  // 1. Fetch Azure Account
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
      } catch (err) {
        console.error("Error fetching account:", err);
      }
    };
    fetchAccount();
  }, [fetchApiUrl]);

  // 2. Fetch Subscriptions
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
        if (!response.ok) throw new Error("Failed to fetch subscriptions");
        const result = await response.json();
        setSubscriptions(result.data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    };
    fetchSubs();
  }, [fetchSubscriptionsUrl, azureAccount]);

  // 3. Fetch Services
  useEffect(() => {
    if (!azureAccount || !azureSubscriptions || azureSubscriptions.length === 0) return;
    const fetchServices = async () => {
      try {
        const encryptedData = {
          encryptedTenantId: azureAccount.tenantId,
          encryptedClientId: azureAccount.clientId,
          encryptedClientSecret: azureAccount.clientSecret,
          subscriptionId: azureSubscriptions[0].id
        };
        const response = await fetch(fetchServicesUrl, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(encryptedData)
        });
        if (!response.ok) throw new Error("Failed to fetch services");
        const result = await response.json();
        setServices(result.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [fetchServicesUrl, azureAccount, azureSubscriptions]);

  // Compliance Evaluation Logic
  const evaluatedResources = services.map((resource) => {
    const resourceTags = resource.tags || {};
    const presentTags = Object.keys(resourceTags);
    const missingTags = requiredTags.filter(
      (reqTag) =>
        !presentTags.some((t) => t.toLowerCase() === reqTag.toLowerCase())
    );

    const isCompliant = missingTags.length === 0;
    const compliancePercent = requiredTags.length
      ? Math.round(((requiredTags.length - missingTags.length) / requiredTags.length) * 100)
      : 100;

    return {
      ...resource,
      resourceTags,
      missingTags,
      isCompliant,
      compliancePercent
    };
  });

  const compliantCount = evaluatedResources.filter((r) => r.isCompliant).length;
  const nonCompliantCount = evaluatedResources.length - compliantCount;
  const overallComplianceRate = evaluatedResources.length
    ? Math.round((compliantCount / evaluatedResources.length) * 100)
    : 100;

  // Filtered resources for the table
  const filteredResources = evaluatedResources.filter((res) => {
    const matchesCompliance =
      filterCompliance === "all"
        ? true
        : filterCompliance === "compliant"
        ? res.isCompliant
        : !res.isCompliant;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      res.name?.toLowerCase().includes(term) ||
      res.type?.toLowerCase().includes(term) ||
      res.location?.toLowerCase().includes(term);

    return matchesCompliance && matchesSearch;
  });

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const formatted = newTagInput.trim();
    if (!requiredTags.includes(formatted)) {
      setRequiredTags([...requiredTags, formatted]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setRequiredTags(requiredTags.filter((t) => t !== tagToRemove));
  };

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  // Pie chart data
  const pieData = [
    { name: "Compliant", value: compliantCount, fill: "#10b981" },
    { name: "Non-Compliant", value: nonCompliantCount, fill: "#f43f5e" }
  ];

  // Missing tags distribution
  const missingTagDistribution = {};
  evaluatedResources.forEach((res) => {
    res.missingTags.forEach((tag) => {
      missingTagDistribution[tag] = (missingTagDistribution[tag] || 0) + 1;
    });
  });
  const barData = Object.entries(missingTagDistribution).map(([tag, count]) => ({
    tag,
    count
  }));

  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
        <Header
          title="Tag Governance & Compliance"
          subtitle="Audit required Azure resource metadata, cost allocation, and ownership tags"
        />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex h-96 items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#090d16]">
      <Header
        title="Tag Governance & Compliance"
        subtitle="Audit required Azure resource metadata, cost allocation, and ownership tags"
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatCard
            name="Compliance Rate"
            icon={FileCheck2}
            value={`${overallComplianceRate}%`}
            description={overallComplianceRate >= 80 ? "Passes Governance Policy" : "Breaches Policy"}
            color={overallComplianceRate >= 80 ? "#10b981" : "#f43f5e"}
          />
          <StatCard
            name="Fully Tagged"
            icon={CheckCircle2}
            value={compliantCount}
            description="Resources with 100% required tags"
            color="#10b981"
          />
          <StatCard
            name="Tag Violations"
            icon={ShieldAlert}
            value={nonCompliantCount}
            description="Resources missing required keys"
            color="#f43f5e"
          />
          <StatCard
            name="Enforced Policies"
            icon={Tag}
            value={requiredTags.length}
            description="Mandatory tag schema keys"
            color="#06b6d4"
          />
        </motion.div>

        {/* Governance Policy Manager & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Policy Config Card */}
          <motion.div
            className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl flex flex-col justify-between"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h3 className="text-base font-bold text-white font-heading tracking-tight mb-1 flex items-center gap-2">
                <Tag size={18} className="text-cyan-400" />
                Required Governance Schema
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Define the mandatory tags every resource in this tenant must possess
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {requiredTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs"
                  >
                    <span>{t}</span>
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-400 transition ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add tag form */}
            <form onSubmit={handleAddTag} className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
              <input
                type="text"
                placeholder="e.g. Department, SLA..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Add</span>
              </button>
            </form>
          </motion.div>

          {/* Compliance Ratio Donut */}
          <motion.div
            className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">
              Tag Compliance Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-4">Ratio of compliant vs missing resources</p>
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "0.75rem",
                      fontSize: "12px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Compliant ({compliantCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300">Violations ({nonCompliantCount})</span>
              </div>
            </div>
          </motion.div>

          {/* Most Frequently Missing Tags BarChart */}
          <motion.div
            className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-base font-bold text-white font-heading tracking-tight mb-1">
              Top Missing Tag Keys
            </h3>
            <p className="text-xs text-slate-400 mb-4">Frequency of missing governance tags</p>
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="tag" stroke="#64748b" fontSize={11} tick={{ fill: "#94a3b8" }} />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "0.75rem",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Resources Audit Table */}
        <motion.div
          className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" />
                Resource Tag Audit Ledger
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit each asset's key-value tags against the required governance baseline
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Filter Pills */}
              <div className="flex rounded-xl bg-slate-950/80 border border-slate-800 p-0.5 text-xs font-mono">
                <button
                  onClick={() => setFilterCompliance("all")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterCompliance === "all" ? "bg-slate-800 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({evaluatedResources.length})
                </button>
                <button
                  onClick={() => setFilterCompliance("compliant")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterCompliance === "compliant"
                      ? "bg-emerald-500/20 text-emerald-300 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Compliant ({compliantCount})
                </button>
                <button
                  onClick={() => setFilterCompliance("non-compliant")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterCompliance === "non-compliant"
                      ? "bg-rose-500/20 text-rose-300 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Violations ({nonCompliantCount})
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  type="text"
                  placeholder="Filter by name, type..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs placeholder-slate-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="bg-slate-950/80">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Resource Name
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    ARM Type
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Compliance Status
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Missing Mandatory Tags
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource, index) => {
                    const isExpanded = expandedRows.includes(index);
                    const tagEntries = Object.entries(resource.resourceTags);

                    return (
                      <React.Fragment key={index}>
                        <motion.tr
                          onClick={() => toggleRow(index)}
                          className={`cursor-pointer transition-colors ${
                            isExpanded ? "bg-slate-800/60" : "hover:bg-slate-800/40"
                          }`}
                        >
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-white font-mono">
                            {resource.name}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-cyan-300 font-mono text-[11px]">
                              {resource.type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-400 font-mono">
                            {resource.location}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                resource.isCompliant
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {resource.isCompliant ? (
                                <>
                                  <CheckCircle2 size={12} />
                                  <span>100% Compliant</span>
                                </>
                              ) : (
                                <>
                                  <XCircle size={12} />
                                  <span>{resource.compliancePercent}% (Violation)</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs">
                            {resource.missingTags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {resource.missingTags.map((mt) => (
                                  <span
                                    key={mt}
                                    className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-[10px]"
                                  >
                                    -{mt}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-xs italic font-mono">None (All present)</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-xs text-right text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-slate-300 mr-2">
                              {tagEntries.length} tag{tagEntries.length !== 1 ? "s" : ""}
                            </span>
                            <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition inline-flex align-middle">
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </td>
                        </motion.tr>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-slate-950/40"
                            >
                              <td colSpan={6} className="p-4">
                                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4">
                                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                                    Current Tags on {resource.name}
                                  </div>
                                  {tagEntries.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                      {tagEntries.map(([k, v]) => (
                                        <div
                                          key={k}
                                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs flex justify-between items-center"
                                        >
                                          <span className="text-cyan-400 font-semibold">{k}</span>
                                          <span className="text-slate-300">{v?.toString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-slate-500 text-xs italic">
                                      No tags currently assigned to this resource in Azure.
                                    </p>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-xs text-slate-500">
                      No resources found matching the specified filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TagCompliancePage;
