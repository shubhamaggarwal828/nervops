// AdditionalCharts.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

// Example: Trends Over Time Chart (requires each security issue to have a createdDate field)
const TrendsOverTimeChart = ({ issues }) => {
  // Group issues by month/year (assuming createdDate is in ISO format)
  const trendData = issues.reduce((acc, issue) => {
    if (issue.createdDate) {
      const date = new Date(issue.createdDate);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});
  const data = Object.keys(trendData)
    .map((month) => ({ month, count: trendData[month] }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
  return (
    <div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Issues Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#fff" />
          <YAxis stroke="#fff" />
          <RechartsTooltip />
          <RechartsLegend />
          <Line type="monotone" dataKey="count" stroke="#F97316" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Example: Stacked Bar Chart for Issues by Group and Severity
const StackedIssuesChart = ({ issues }) => {
  // Create a data structure: for each group, count by severity.
  const groups = {};
  issues.forEach((issue) => {
    const group = issue.group;
    if (!groups[group]) {
      groups[group] = { group, Critical: 0, Warning: 0, Okay: 0 };
    }
    const sev = issue.severity;
    if (sev === "High" || sev === "Not Secure") groups[group].Critical += 1;
    else if (sev === "Medium" || sev === "Warning") groups[group].Warning += 1;
    else groups[group].Okay += 1;
  });
  const data = Object.values(groups);
  return (
    <div className="bg-[#282c31] rounded-lg p-4 shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Issues by Group & Severity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" stroke="#fff" />
          <YAxis stroke="#fff" />
          <RechartsTooltip />
          <RechartsLegend />
          <Bar dataKey="Critical" stackId="a" fill="#DC2626" />
          <Bar dataKey="Warning" stackId="a" fill="#FACC15" />
          <Bar dataKey="Okay" stackId="a" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export { TrendsOverTimeChart, StackedIssuesChart };
