// DetailedSecurityMetrics.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from "recharts";

// Helper: Shorten resource ID to "resourceGroup/resourceName"
const shortenResourceId = (id) => {
  // Example ID: /subscriptions/xxx/resourceGroups/UpTimeFury/providers/Microsoft.Compute/virtualMachines/UpTimeFury
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

// Colors for each evaluation label
const evaluationColors = {
  Critical: "#DC2626", // red
  Warning: "#FACC15",  // yellow
  Okay: "#10B981"      // green
};

// Component to display NSG rules in separate tables by group
const NSGRulesTable = ({ detailedNSGRules }) => {
  // Flatten evaluated rules from each NSG resource
  const allRules = [];
  detailedNSGRules.forEach((nsg) => {
    if (nsg.evaluatedRules && Array.isArray(nsg.evaluatedRules)) {
      nsg.evaluatedRules.forEach((rule) => {
        allRules.push({ ...rule, resourceId: nsg.resourceId });
      });
    }
  });

  // Group rules by evaluation label
  const groups = allRules.reduce((acc, rule) => {
    const groupKey = mapEvaluationToLabel(rule.evaluation);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(rule);
    return acc;
  }, {});

  // Define the desired order of groups
  const groupOrder = ["Critical", "Warning", "Okay"];

  return (
    <div className="overflow-x-auto mb-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">NSG Rules Evaluation (Grouped)</h3>
      {groupOrder.map((groupKey) => {
        const rules = groups[groupKey] || [];
        if (rules.length === 0) return null;
        return (
          <div key={groupKey} className="mb-6">
            <h4 className="text-lg font-bold text-gray-100 mb-2">{groupKey} Rules</h4>
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rule Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Port</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-gray-800">
                    <td className="px-4 py-2 text-sm text-gray-300">{shortenResourceId(rule.resourceId)}</td>
                    <td className="px-4 py-2 text-sm text-gray-300">{rule.ruleName}</td>
                    <td className="px-4 py-2 text-sm text-gray-300">{rule.destinationPortRange}</td>
                    <td className="px-4 py-2 text-sm text-gray-300">{rule.protocol}</td>
                    <td
                      className="px-4 py-2 text-sm"
                      style={{ color: evaluationColors[groupKey] || "#fff" }}
                    >
                      {groupKey}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300">{rule.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

const DetailedSecurityMetrics = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIssues, setFilteredIssues] = useState(data.securityIssues || []);
  const [filteredGood, setFilteredGood] = useState(data.securityGoodAspects || []);

  useEffect(() => {
    if (data && data.securityIssues) {
      const filtered = data.securityIssues.filter((issue) =>
        issue.resourceId.toLowerCase().includes(searchTerm) ||
        issue.group.toLowerCase().includes(searchTerm) ||
        issue.issue.toLowerCase().includes(searchTerm) ||
        issue.severity.toLowerCase().includes(searchTerm)
      );
      setFilteredIssues(filtered);
    }
    if (data && data.securityGoodAspects) {
      const filtered = data.securityGoodAspects.filter((good) =>
        good.resourceId.toLowerCase().includes(searchTerm) ||
        good.group.toLowerCase().includes(searchTerm) ||
        good.goodAspect.toLowerCase().includes(searchTerm) ||
        good.comment.toLowerCase().includes(searchTerm)
      );
      setFilteredGood(filtered);
    }
  }, [searchTerm, data]);

  // Prepare data for a bar chart (optional) showing issue counts by severity.
  const severityCounts = filteredIssues.reduce((acc, issue) => {
    const sev = issue.severity;
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});
  const severityData = Object.entries(severityCounts).map(([severity, count]) => ({
    severity,
    count
  }));

  return (
    <motion.div
      className="bg-[#282c31] rounded-lg p-6 mb-8 shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Detailed Security Metrics</h2>
    
      {/* Comprehensive Issues Table */}
      <div className="overflow-x-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Security Issues</h3>
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Group</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Issue</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredIssues.map((issue, idx) => (
              <tr key={idx} className="hover:bg-gray-800">
                <td className="px-4 py-2 text-sm text-gray-300">{shortenResourceId(issue.resourceId)}</td>
                <td className="px-4 py-2 text-sm text-gray-300">{issue.group}</td>
                <td className="px-4 py-2 text-sm text-gray-300">{issue.issue}</td>
                <td
                  className="px-4 py-2 text-sm"
                  style={{ color: evaluationColors[mapEvaluationToLabel(issue.evaluation || issue.severity)] || "#fff" }}
                >
                  {mapEvaluationToLabel(issue.evaluation || issue.severity)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-300">{issue.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NSG Rules Tables (Grouped by Critical, Warning, Okay) */}
      {data.detailedNSGRules && data.detailedNSGRules.length > 0 && (
        <NSGRulesTable detailedNSGRules={data.detailedNSGRules} />
      )}

      {/* Positive Security Configurations Table */}
      <div className="overflow-x-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Positive Security Configurations</h3>
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Group</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Good Aspect</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredGood.map((good, idx) => (
              <tr key={idx} className="hover:bg-gray-800">
                <td className="px-4 py-2 text-sm text-gray-300">{shortenResourceId(good.resourceId)}</td>
                <td className="px-4 py-2 text-sm text-gray-300">{good.group}</td>
                <td className="px-4 py-2 text-sm text-gray-300">{good.goodAspect}</td>
                <td className="px-4 py-2 text-sm text-gray-300">{good.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DetailedSecurityMetrics;
