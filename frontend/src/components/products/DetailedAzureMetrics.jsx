import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { BarChart2, Import, ShoppingBag, Users, Zap } from "lucide-react";

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

/* =========================
   Pie Chart: Services by Type (label on hover)
   ========================= */
const ServicesPieChartByType = ({ services }) => {
  const counts = services.reduce((acc, service) => {
    const type = service.type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
  const [activeIndex, setActiveIndex] = useState(null);
  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.type}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`${payload.type} (${value})`}
        </text>
      </g>
    );
  };
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Services by Type</h3>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="count"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-type-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
        <RechartsLegend />
      </PieChart>
    </div>
  );
};

/* =========================
   Pie Chart: Services by Provisioning State
   ========================= */
const ServicesPieChartByProvisioning = ({ services }) => {
  const counts = services.reduce((acc, service) => {
    const state = (service.properties && service.properties.provisioningState) || "N/A";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666"];
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Services by Provisioning State</h3>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="count"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          label={({ payload, percent }) => `${payload.state}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-prov-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
        <RechartsLegend />
      </PieChart>
    </div>
  );
};

/* =========================
   Pie Chart: Services by SKU
   ========================= */
const ServicesPieChartBySKU = ({ services }) => {
  const skuServices = services.filter((s) => s.sku && s.sku.name);
  const counts = skuServices.reduce((acc, service) => {
    const skuName = service.sku.name || "Unknown";
    acc[skuName] = (acc[skuName] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts)
    .map(([sku, count]) => ({ sku, count }))
    .sort((a, b) => b.count - a.count);
  const colors = ["#FF8042", "#FFBB28", "#0088FE", "#00C49F", "#FF6666"];
  const [activeIndex, setActiveIndex] = useState(null);
  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);
  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.sku}
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`${payload.sku} (${value})`}
        </text>
      </g>
    );
  };
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Services by SKU</h3>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="count"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-sku-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
        <RechartsLegend />
      </PieChart>
    </div>
  );
};

// Derived Metric 2: Average Idle Timeout (min) from properties.idleTimeoutInMinutes
const AverageIdleTimeoutChart = ({ services }) => {
  const data = services
    .filter(s => s.properties && s.properties.idleTimeoutInMinutes !== undefined)
    .map(s => ({
      name: s.name,
      idleTimeout: s.properties.idleTimeoutInMinutes
    }));
  const totalTimeout = data.reduce((acc, d) => acc + d.idleTimeout, 0);
  const averageTimeout = data.length ? (totalTimeout / data.length).toFixed(1) : "N/A";
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        Average Idle Timeout (min) – {averageTimeout}
      </h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" allowDecimals={false} />
        <RechartsTooltip />
        <RechartsLegend />
        <Bar dataKey="idleTimeout" fill="#ffc658" />
      </BarChart>
    </div>
  );
};

// Derived Metric 3: Average Disk Size (GB) from properties.storageProfile.osDisk.diskSizeGB
const AverageDiskSizeChart = ({ services }) => {
  const vmServices = services.filter(s =>
    s.type.toLowerCase() === "microsoft.compute/virtualmachines" &&
    s.properties &&
    s.properties.storageProfile &&
    s.properties.storageProfile.osDisk &&
    s.properties.storageProfile.osDisk.diskSizeGB
  );
  const data = vmServices.map(s => ({
    name: s.name,
    diskSize: s.properties.storageProfile.osDisk.diskSizeGB
  }));
  const totalDisk = data.reduce((acc, d) => acc + d.diskSize, 0);
  const averageDisk = data.length ? (totalDisk / data.length).toFixed(1) : "N/A";
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        Average Disk Size (GB) – {averageDisk}
      </h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <RechartsTooltip />
        <RechartsLegend />
        <Bar dataKey="diskSize" fill="#ff8042" />
      </BarChart>
    </div>
  );
};

// Derived Metric 4: Resource Utilization Chart – aggregates CPU usage from cpuUsage arrays in each service.
const ResourceUtilizationChart = ({ services }) => {
  const cpuDataByTimestamp = {};
  services.forEach(s => {
    if (s.cpuUsage && Array.isArray(s.cpuUsage)) {
      s.cpuUsage.forEach(point => {
        const ts = point.timestamp;
        if (!cpuDataByTimestamp[ts]) {
          cpuDataByTimestamp[ts] = { timestamp: ts, total: 0, count: 0 };
        }
        cpuDataByTimestamp[ts].total += point.value;
        cpuDataByTimestamp[ts].count += 1;
      });
    }
  });
  const data = Object.values(cpuDataByTimestamp)
    .map(d => ({ timestamp: d.timestamp, average: d.total / d.count }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        Average CPU Utilization Over Time (%)
      </h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" stroke="#fff" />
        <YAxis stroke="#fff" />
        <RechartsTooltip />
        <RechartsLegend />
        <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

// Derived Metric 5: Uptime Gauge – computes overall uptime from properties.uptime
const UptimeGauge = ({ services }) => {
  const uptimeServices = services.filter(
    s => s.properties && typeof s.properties.uptime === "number"
  );
  const averageUptime = uptimeServices.length > 0
    ? uptimeServices.reduce((acc, s) => acc + s.properties.uptime, 0) / uptimeServices.length
    : 0;
  const data = [{ name: "Uptime", value: averageUptime }];
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Overall Uptime (%)</h3>
      <RadialBarChart
        width={300}
        height={300}
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar minAngle={15} background clockWise dataKey="value" fill="#82ca9d" />
        <RechartsTooltip />
      </RadialBarChart>
      <div className="text-center mt-2 text-white text-xl">{averageUptime.toFixed(1)}%</div>
    </div>
  );
};

// Derived Metric 6: Network Performance Chart – aggregates network latency from properties.networkMetrics
const NetworkPerformanceChart = ({ services }) => {
  const networkDataByTimestamp = {};
  services.forEach(s => {
    if (s.properties && s.properties.networkMetrics && Array.isArray(s.properties.networkMetrics)) {
      s.properties.networkMetrics.forEach(point => {
        const ts = point.timestamp;
        if (!networkDataByTimestamp[ts]) {
          networkDataByTimestamp[ts] = { timestamp: ts, total: 0, count: 0 };
        }
        networkDataByTimestamp[ts].total += point.latency;
        networkDataByTimestamp[ts].count += 1;
      });
    }
  });
  const data = Object.values(networkDataByTimestamp)
    .map(d => ({ timestamp: d.timestamp, latency: d.total / d.count }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Average Network Latency (ms)</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" stroke="#fff" />
        <YAxis stroke="#fff" />
        <RechartsTooltip />
        <RechartsLegend />
        <Line type="monotone" dataKey="latency" stroke="#0088FE" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

// Derived Metric 7: Error/Alert Rate Chart – aggregates errors from properties.errorMetrics
const ErrorAlertRateChart = ({ services }) => {
  const errorDataByTimestamp = {};
  services.forEach(s => {
    if (s.properties && s.properties.errorMetrics && Array.isArray(s.properties.errorMetrics)) {
      s.properties.errorMetrics.forEach(point => {
        const ts = point.timestamp;
        if (!errorDataByTimestamp[ts]) {
          errorDataByTimestamp[ts] = { timestamp: ts, total: 0 };
        }
        errorDataByTimestamp[ts].total += point.errors;
      });
    }
  });
  const data = Object.values(errorDataByTimestamp)
    .map(d => ({ timestamp: d.timestamp, errors: d.total }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Error/Alert Rate</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" stroke="#fff" />
        <YAxis stroke="#fff" allowDecimals={false} />
        <RechartsTooltip />
        <RechartsLegend />
        <Line type="monotone" dataKey="errors" stroke="#FF8042" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

// Derived Metric 8: Cost Breakdown Chart – aggregates cost by service.category
const CostBreakdownChart = ({ services }) => {
  const costCounts = {};
  services.forEach(s => {
    if (s.category && typeof s.cost === "number") {
      const cat = s.category;
      costCounts[cat] = (costCounts[cat] || 0) + s.cost;
    }
  });
  const data = Object.keys(costCounts).map(cat => ({
    category: cat,
    cost: costCounts[cat]
  }));
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Cost Breakdown by Category</h3>
      <PieChart width={400} height={300}>
        <Pie dataKey="cost" data={data} cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-cost-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value) => [`$${value}`, "Cost"]} />
        <RechartsLegend />
      </PieChart>
    </div>
  );
};

// Derived Metric 9: Trends Over Time Chart – groups services by createdDate (month)
const TrendsOverTimeChart = ({ services }) => {
  const trendCounts = {};
  services.forEach(s => {
    if (s.createdDate) {
      const date = new Date(s.createdDate);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
      trendCounts[month] = (trendCounts[month] || 0) + 1;
    }
  });
  const data = Object.keys(trendCounts)
    .map(month => ({ month, services: trendCounts[month] }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Total Services Trend Over Time</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#fff" />
        <YAxis stroke="#fff" allowDecimals={false} />
        <RechartsTooltip />
        <RechartsLegend />
        <Line type="monotone" dataKey="services" stroke="#82ca9d" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

/* =========================
   Main ServicesTable Component
   ========================= */
const DetailedAzureMetrics = ({ servicesData }) => {
  const initialServices = Array.isArray(servicesData)
    ? servicesData
    : servicesData && Array.isArray(servicesData.data)
    ? servicesData.data
    : [];
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState(initialServices);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const newServices = Array.isArray(servicesData)
      ? servicesData
      : servicesData && Array.isArray(servicesData.data)
      ? servicesData.data
      : [];
    setFilteredServices(newServices);
  }, [servicesData]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = initialServices.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        service.type.toLowerCase().includes(term) ||
        service.location.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(i => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const renderObjectDetails = (obj) => {
    if (obj === null) return "null";
    if (Array.isArray(obj)) {
      return (
        <ul className="list-disc pl-4">
          {obj.map((item, idx) => (
            <li key={idx}>
              {typeof item === "object" ? renderObjectDetails(item) : item?.toString()}
            </li>
          ))}
        </ul>
      );
    } else if (typeof obj === "object") {
      return (
        <table className="w-full text-xs border-collapse">
          <tbody>
            {Object.entries(obj).map(([key, value]) => (
              <tr key={key}>
                <td className="border px-1 py-0.5 font-medium text-gray-200">{key}</td>
                <td className="border px-1 py-0.5 text-gray-300">
                  {typeof value === "object" ? renderObjectDetails(value) : value?.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return obj?.toString();
  };

  const renderAdditionalDetails = (service) => {
    const keysToExclude = new Set(["name", "type", "location"]);
    const details = Object.entries(service).filter(([key]) => !keysToExclude.has(key));
    return (
      <div className="bg-[#282c31] rounded p-4">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {details.map(([key, value]) => (
              <tr key={key} className="border-b border-gray-700">
                <td className="px-2 py-1 font-medium text-gray-200 w-1/4">{key}</td>
                <td className="px-2 py-1 text-gray-300">
                  {typeof value === "object" ? renderObjectDetails(value) : value?.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-[#282c31] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Services List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>


      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Provisioning State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {Array.isArray(filteredServices) &&
              filteredServices.map((service, index) => (
                <React.Fragment key={index}>
                  <motion.tr
                    onClick={() => toggleRow(index)}
                    className="cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{service.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{service.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {(service.properties && service.properties.provisioningState) || "N/A"}
                    </td>
                  </motion.tr>
                  {expandedRows.includes(index) && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <td colSpan={4} className="px-6 py-4">{renderAdditionalDetails(service)}</td>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* Graphs & Derived Metrics */}
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <ServicesBarChart services={filteredServices} />
          <ServicesBarChartByResourceGroup services={filteredServices} /> */}
          {/* <ServicesPieChartByType services={filteredServices} />
          <ServicesPieChartByProvisioning services={filteredServices} />
          <ServicesPieChartBySKU services={filteredServices} /> */}
          {/* <AverageIdleTimeoutChart services={filteredServices} />
          <AverageDiskSizeChart services={filteredServices} /> */}
          {/* <AverageProvisioningTimeChart services={filteredServices} />
          {/* <ResourceUtilizationChart services={filteredServices} /> */}
          {/* <UptimeGauge services={filteredServices} /> */}
          {/* <NetworkPerformanceChart services={filteredServices} />
          <ErrorAlertRateChart services={filteredServices} />
          <TrendsOverTimeChart services={filteredServices} /> */} 
        </div>
      </div>
    </motion.div>
  );
};

export default DetailedAzureMetrics;
