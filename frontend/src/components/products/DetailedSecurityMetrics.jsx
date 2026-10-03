import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

// Helper: Shorten resource ID to "resourceGroup / resourceName"
const shortenResourceId = (id) => {
  if (!id) return "N/A";
  const match = id.match(/resourceGroups\/([^/]+)\/providers\/[^/]+\/[^/]+\/([^/]+)/i);
  return match ? `${match[1]} / ${match[2]}` : id.split("/").pop();
};

const mapEvaluationToLabel = (evaluation) => {
  if (evaluation === "Not Secure") return "Critical";
  if (evaluation === "Warning") return "Warning";
  if (evaluation === "OK") return "Okay";
  return evaluation;
};

// Modern pill styling for severity
const getSeverityBadge = (sev) => {
  const s = sev?.toLowerCase();
  if (s === "critical" || s === "not secure" || s === "high") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <ShieldAlert size={12} />
        Critical
      </span>
    );
  }
  if (s === "medium" || s === "warning") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle size={12} />
        Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 size={12} />
      Passed
    </span>
  );
};

// Component to display NSG rules in separate tables by group
const NSGRulesTable = ({ detailedNSGRules }) => {
  const allRules = [];
  detailedNSGRules.forEach((nsg) => {
    if (nsg.evaluatedRules && Array.isArray(nsg.evaluatedRules)) {
      nsg.evaluatedRules.forEach((rule) => {
        allRules.push({ ...rule, resourceId: nsg.resourceId });
      });
    }
  });

  const groups = allRules.reduce((acc, rule) => {
    const groupKey = mapEvaluationToLabel(rule.evaluation);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(rule);
    return acc;
  }, {});

  const groupOrder = ["Critical", "Warning", "Okay"];

  return (
    <div className="mt-8">
      <h3 className="text-base font-bold text-white font-heading tracking-tight mb-4 flex items-center gap-2">
        <ShieldCheck size={18} className="text-cyan-400" />
        Evaluated Network Security Group (NSG) Rules
      </h3>
      {groupOrder.map((groupKey) => {
        const rules = groups[groupKey] || [];
        if (rules.length === 0) return null;
        return (
          <div key={groupKey} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {groupKey} Evaluations
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
                {rules.length} rule{rules.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="min-w-full divide-y divide-slate-800">
                <thead>
                  <tr className="bg-slate-950/80">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Resource Scope
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Rule Name
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Port / Proto
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Evaluation
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Security Analysis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                  {rules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-2.5 text-xs text-slate-300 font-mono">
                        {shortenResourceId(rule.resourceId)}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-white">
                        {rule.ruleName}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-300 font-mono">
                        {rule.destinationPortRange} / {rule.protocol}
                      </td>
                      <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                        {getSeverityBadge(groupKey)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-400 max-w-md">
                        {rule.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DetailedSecurityMetrics = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIssues, setFilteredIssues] = useState(data?.securityIssues || []);
  const [filteredGood, setFilteredGood] = useState(data?.securityGoodAspects || []);

  useEffect(() => {
    if (data && data.securityIssues) {
      const term = searchTerm.toLowerCase();
      const filtered = data.securityIssues.filter(
        (issue) =>
          issue.resourceId?.toLowerCase().includes(term) ||
          issue.group?.toLowerCase().includes(term) ||
          issue.issue?.toLowerCase().includes(term) ||
          issue.severity?.toLowerCase().includes(term)
      );
      setFilteredIssues(filtered);
    }
    if (data && data.securityGoodAspects) {
      const term = searchTerm.toLowerCase();
      const filtered = data.securityGoodAspects.filter(
        (good) =>
          good.resourceId?.toLowerCase().includes(term) ||
          good.group?.toLowerCase().includes(term) ||
          good.goodAspect?.toLowerCase().includes(term) ||
          good.comment?.toLowerCase().includes(term)
      );
      setFilteredGood(filtered);
    }
  }, [searchTerm, data]);

  return (
    <motion.div
      className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl mb-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-400" />
            Detailed Cloud Security & Compliance Audit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            CIS Benchmark and Microsoft Cloud Security Benchmark posture evaluations
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search findings by rule, group..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs placeholder-slate-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Security Issues Table */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-rose-400 font-heading tracking-wider uppercase mb-3 flex items-center gap-2">
          <AlertTriangle size={15} />
          Detected Vulnerabilities & Misconfigurations ({filteredIssues.length})
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="bg-slate-950/80">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Resource
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Domain / Category
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Audit Finding / Threat Vector
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono">
                      {shortenResourceId(issue.resourceId)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-cyan-300 font-mono text-[11px]">
                        {issue.group}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300 max-w-lg">
                      {issue.issue}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {getSeverityBadge(issue.severity || issue.evaluation)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-500">
                    No open security issues detected matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Good Aspects Table */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-emerald-400 font-heading tracking-wider uppercase mb-3 flex items-center gap-2">
          <CheckCircle2 size={15} />
          Compliant Controls & Hardened Configurations ({filteredGood.length})
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="bg-slate-950/80">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hardening Measure Verified
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Audit Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {filteredGood.length > 0 ? (
                filteredGood.map((good, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-xs text-slate-300 font-mono">
                      {shortenResourceId(good.resourceId)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-emerald-400 font-mono text-[11px]">
                        {good.group}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-300 font-medium">
                      {good.goodAspect}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {good.comment}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-500">
                    No compliant baseline items recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NSG Rules Table */}
      {data?.detailedNSGRules && <NSGRulesTable detailedNSGRules={data.detailedNSGRules} />}
    </motion.div>
  );
};

export default DetailedSecurityMetrics;
