import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const ServicesTable = ({ servicesData }) => {
  // Normalize the incoming data.
  // If servicesData is an array, use it directly.
  // If it's an object with a data key, use that.
  const initialServices = Array.isArray(servicesData)
    ? servicesData
    : servicesData && Array.isArray(servicesData.data)
    ? servicesData.data
    : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState(initialServices);

  // Update filteredServices whenever servicesData changes
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
    // Filter from the normalized services array
    const filtered = initialServices.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        service.type.toLowerCase().includes(term) ||
        service.location.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  return (
    <motion.div
      className="bg-[#282c31] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Provisioning State
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {Array.isArray(filteredServices) && filteredServices.map((service, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {service.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {service.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {service.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {service.properties?.provisioningState || "N/A"}
                 </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ServicesTable;

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Edit, Search, Trash2 } from "lucide-react";

// const ServicesTable = ({ servicesData }) => {
//   // Normalize the incoming data
//   const initialServices = Array.isArray(servicesData)
//     ? servicesData
//     : servicesData && Array.isArray(servicesData.data)
//     ? servicesData.data
//     : [];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredServices, setFilteredServices] = useState(initialServices);
//   const [expandedRows, setExpandedRows] = useState([]); // holds indexes of expanded rows

//   // Update filteredServices whenever servicesData changes.
//   useEffect(() => {
//     const newServices = Array.isArray(servicesData)
//       ? servicesData
//       : servicesData && Array.isArray(servicesData.data)
//       ? servicesData.data
//       : [];
//     setFilteredServices(newServices);
//   }, [servicesData]);

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     // Filter from the normalized services array.
//     const filtered = initialServices.filter(
//       (service) =>
//         service.name.toLowerCase().includes(term) ||
//         service.type.toLowerCase().includes(term) ||
//         service.location.toLowerCase().includes(term)
//     );
//     setFilteredServices(filtered);
//   };

//   // Toggle expansion for the clicked row.
//   const toggleRow = (index) => {
//     if (expandedRows.includes(index)) {
//       setExpandedRows(expandedRows.filter((i) => i !== index));
//     } else {
//       setExpandedRows([...expandedRows, index]);
//     }
//   };

//   // Helper: Render an object or array in a pretty, nested table format.
//   const renderObjectDetails = (obj) => {
//     if (obj === null) return "null";
//     if (Array.isArray(obj)) {
//       return (
//         <ul className="list-disc pl-4">
//           {obj.map((item, idx) => (
//             <li key={idx}>
//               {typeof item === "object" ? renderObjectDetails(item) : item?.toString()}
//             </li>
//           ))}
//         </ul>
//       );
//     } else if (typeof obj === "object") {
//       return (
//         <table className="w-full text-xs border-collapse">
//           <tbody>
//             {Object.entries(obj).map(([key, value]) => (
//               <tr key={key}>
//                 <td className="border px-1 py-0.5 font-medium text-gray-200">{key}</td>
//                 <td className="border px-1 py-0.5 text-gray-300">
//                   {typeof value === "object" ? renderObjectDetails(value) : value?.toString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       );
//     }
//     return obj?.toString();
//   };

//   // Render the additional details for a service as a subtable.
//   // Here we exclude the main fields (name, type, location) that are already shown.
//   const renderAdditionalDetails = (service) => {
//     const keysToExclude = new Set(["name", "type", "location"]);
//     const details = Object.entries(service).filter(([key]) => !keysToExclude.has(key));

//     return (
//       <div className="bg-bg-[#282c31] rounded p-4">
//         <table className="w-full text-sm border-collapse">
//           <tbody>
//             {details.map(([key, value]) => (
//               <tr key={key} className="border-b border-gray-700">
//                 <td className="px-2 py-1 font-medium text-gray-200 w-1/4">{key}</td>
//                 <td className="px-2 py-1 text-gray-300">
//                   {typeof value === "object" ? renderObjectDetails(value) : value?.toString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <motion.div
//       className="bg-[#282c31] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       {/* Search input */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-100">Services List</h2>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search services..."
//             className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onChange={handleSearch}
//             value={searchTerm}
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Main table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Type
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Provisioning State
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             {Array.isArray(filteredServices) &&
//               filteredServices.map((service, index) => (
//                 <React.Fragment key={index}>
//                   {/* Main row */}
//                   <motion.tr
//                     onClick={() => toggleRow(index)}
//                     className="cursor-pointer"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
//                       {service.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {service.type}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {service.location}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {service.properties?.provisioningState || "N/A"}
//                     </td>
//                   </motion.tr>

//                   {/* Expanded details row */}
//                   {expandedRows.includes(index) && (
//                     <motion.tr
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <td colSpan={4} className="px-6 py-4">
//                         {renderAdditionalDetails(service)}
//                       </td>
//                     </motion.tr>
//                   )}
//                 </React.Fragment>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// export default ServicesTable;








// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Edit, Search, Trash2 } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   Legend as RechartsLegend,
//   PieChart,
//   Pie,
//   Cell,
//   Sector,
// } from "recharts";

// /* =========================
//    Metrics Cards Component
//    ========================= */
// const MetricsCards = ({ services }) => {
//   const total = services.length;
//   const succeeded = services.filter(
//     (s) => s.properties?.provisioningState === "Succeeded"
//   ).length;
//   const others = total - succeeded;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//       <div className="bg-gray-800 text-white p-4 rounded shadow">
//         <h3 className="text-xl font-semibold">Total Services</h3>
//         <p className="text-3xl">{total}</p>
//       </div>
//       <div className="bg-gray-800 text-white p-4 rounded shadow">
//         <h3 className="text-xl font-semibold">Succeeded</h3>
//         <p className="text-3xl">{succeeded}</p>
//       </div>
//       <div className="bg-gray-800 text-white p-4 rounded shadow">
//         <h3 className="text-xl font-semibold">Other States</h3>
//         <p className="text-3xl">{others}</p>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    Bar Chart: Services by Location
//    ========================= */
// const ServicesBarChart = ({ services }) => {
//   const counts = services.reduce((acc, service) => {
//     const location = service.location || "Unknown";
//     acc[location] = (acc[location] || 0) + 1;
//     return acc;
//   }, {});
//   const chartData = Object.keys(counts).map((location) => ({
//     location,
//     count: counts[location],
//   }));

//   return (
//     <div className="mt-8">
//       <h3 className="text-xl font-semibold text-gray-100 mb-4">
//         Services by Location
//       </h3>
//       <BarChart width={600} height={300} data={chartData}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="location" stroke="#fff" />
//         <YAxis stroke="#fff" allowDecimals={false} />
//         <RechartsTooltip />
//         <RechartsLegend />
//         <Bar dataKey="count" fill="#8884d8" />
//       </BarChart>
//     </div>
//   );
// };

// /* =========================
//    Bar Chart: Services by Resource Group
//    (Extracted from the service.id)
//    ========================= */
// const ServicesBarChartByResourceGroup = ({ services }) => {
//   const counts = services.reduce((acc, service) => {
//     if (service.id) {
//       const parts = service.id.split("/resourceGroups/");
//       if (parts.length > 1) {
//         const rg = parts[1].split("/")[0];
//         acc[rg] = (acc[rg] || 0) + 1;
//       }
//     }
//     return acc;
//   }, {});
//   const data = Object.keys(counts).map((rg) => ({
//     resourceGroup: rg,
//     count: counts[rg],
//   }));

//   return (
//     <div className="mt-8">
//       <h3 className="text-xl font-semibold text-gray-100 mb-4">
//         Services by Resource Group
//       </h3>
//       <BarChart width={600} height={300} data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="resourceGroup" stroke="#fff" />
//         <YAxis stroke="#fff" allowDecimals={false} />
//         <RechartsTooltip />
//         <RechartsLegend />
//         <Bar dataKey="count" fill="#82ca9d" />
//       </BarChart>
//     </div>
//   );
// };

// /* =========================
//    Pie Chart: Services by Type
//    (Shows label only on hover)
//    ========================= */
// const ServicesPieChartByType = ({ services }) => {
//   const counts = services.reduce((acc, service) => {
//     const type = service.type || "Unknown";
//     acc[type] = (acc[type] || 0) + 1;
//     return acc;
//   }, {});
//   const data = Object.entries(counts)
//     .map(([type, count]) => ({ type, count }))
//     .sort((a, b) => b.count - a.count);

//   const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

//   const [activeIndex, setActiveIndex] = useState(null);

//   const onPieEnter = (_, index) => {
//     setActiveIndex(index);
//   };
//   const onPieLeave = () => {
//     setActiveIndex(null);
//   };

//   const renderActiveShape = (props) => {
//     const {
//       cx,
//       cy,
//       midAngle,
//       innerRadius,
//       outerRadius,
//       startAngle,
//       endAngle,
//       fill,
//       payload,
//       percent,
//       value,
//     } = props;
//     const RADIAN = Math.PI / 180;
//     const sin = Math.sin(-RADIAN * midAngle);
//     const cos = Math.cos(-RADIAN * midAngle);
//     const sx = cx + (outerRadius + 10) * cos;
//     const sy = cy + (outerRadius + 10) * sin;
//     const mx = cx + (outerRadius + 30) * cos;
//     const my = cy + (outerRadius + 30) * sin;
//     const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//     const ey = my;
//     const textAnchor = cos >= 0 ? "start" : "end";
    
//     return (
//       <g>
//         <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//           {payload.type}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//         <Sector
//           cx={cx}
//           cy={cy}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           innerRadius={outerRadius + 6}
//           outerRadius={outerRadius + 10}
//           fill={fill}
//         />
//         <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//         <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//         <text
//           x={ex + (cos >= 0 ? 1 : -1) * 12}
//           y={ey}
//           textAnchor={textAnchor}
//           fill="#333"
//         >{`${payload.type} (${value})`}</text>
//       </g>
//     );
//   };

//   return (
//     <div className="mt-8">
//       <h3 className="text-xl font-semibold text-gray-100 mb-4">
//         Services by Type
//       </h3>
//       <PieChart width={400} height={300}>
//         <Pie
//           dataKey="count"
//           data={data}
//           cx="50%"
//           cy="50%"
//           outerRadius={80}
//           innerRadius={40}
//           activeIndex={activeIndex}
//           activeShape={renderActiveShape}
//           onMouseEnter={onPieEnter}
//           onMouseLeave={onPieLeave}
//           // No default label so the chart remains uncluttered.
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-type-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>
//         <RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
//         <RechartsLegend />
//       </PieChart>
//     </div>
//   );
// };

// /* =========================
//    Pie Chart: Services by Provisioning State
//    ========================= */
// const ServicesPieChartByProvisioning = ({ services }) => {
//   const counts = services.reduce((acc, service) => {
//     const state = service.properties?.provisioningState || "N/A";
//     acc[state] = (acc[state] || 0) + 1;
//     return acc;
//   }, {});

//   const data = Object.entries(counts)
//     .map(([state, count]) => ({ state, count }))
//     .sort((a, b) => b.count - a.count);

//   const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666"];

//   return (
//     <div className="mt-8">
//       <h3 className="text-xl font-semibold text-gray-100 mb-4">
//         Services by Provisioning State
//       </h3>
//       <PieChart width={400} height={300}>
//         <Pie
//           dataKey="count"
//           data={data}
//           cx="50%"
//           cy="50%"
//           outerRadius={80}
//           innerRadius={40}
//           label={({ payload, percent }) =>
//             `${payload.state}: ${(percent * 100).toFixed(0)}%`
//           }
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-prov-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>
//         <RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
//         <RechartsLegend />
//       </PieChart>
//     </div>
//   );
// };

// /* =========================
//    Pie Chart: Services by SKU
//    (Only for services that have a sku property)
//    ========================= */
// const ServicesPieChartBySKU = ({ services }) => {
//   // Filter only services with a sku.
//   const skuServices = services.filter((s) => s.sku && s.sku.name);
//   const counts = skuServices.reduce((acc, service) => {
//     const skuName = service.sku.name || "Unknown";
//     acc[skuName] = (acc[skuName] || 0) + 1;
//     return acc;
//   }, {});
//   const data = Object.entries(counts)
//     .map(([sku, count]) => ({ sku, count }))
//     .sort((a, b) => b.count - a.count);
//   const colors = ["#FF8042", "#FFBB28", "#0088FE", "#00C49F", "#FF6666"];

//   const [activeIndex, setActiveIndex] = useState(null);
//   const onPieEnter = (_, index) => setActiveIndex(index);
//   const onPieLeave = () => setActiveIndex(null);

//   const renderActiveShape = (props) => {
//     const {
//       cx,
//       cy,
//       midAngle,
//       innerRadius,
//       outerRadius,
//       startAngle,
//       endAngle,
//       fill,
//       payload,
//       percent,
//       value,
//     } = props;
//     const RADIAN = Math.PI / 180;
//     const sin = Math.sin(-RADIAN * midAngle);
//     const cos = Math.cos(-RADIAN * midAngle);
//     const sx = cx + (outerRadius + 10) * cos;
//     const sy = cy + (outerRadius + 10) * sin;
//     const mx = cx + (outerRadius + 30) * cos;
//     const my = cy + (outerRadius + 30) * sin;
//     const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//     const ey = my;
//     const textAnchor = cos >= 0 ? "start" : "end";
//     return (
//       <g>
//         <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//           {payload.sku}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//         <Sector
//           cx={cx}
//           cy={cy}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           innerRadius={outerRadius + 6}
//           outerRadius={outerRadius + 10}
//           fill={fill}
//         />
//         <path
//           d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
//           stroke={fill}
//           fill="none"
//         />
//         <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//         <text
//           x={ex + (cos >= 0 ? 1 : -1) * 12}
//           y={ey}
//           textAnchor={textAnchor}
//           fill="#333"
//         >{`${payload.sku} (${value})`}</text>
//       </g>
//     );
//   };

//   return (
//     <div className="mt-8">
//       <h3 className="text-xl font-semibold text-gray-100 mb-4">
//         Services by SKU
//       </h3>
//       <PieChart width={400} height={300}>
//         <Pie
//           dataKey="count"
//           data={data}
//           cx="50%"
//           cy="50%"
//           outerRadius={80}
//           innerRadius={40}
//           activeIndex={activeIndex}
//           activeShape={renderActiveShape}
//           onMouseEnter={onPieEnter}
//           onMouseLeave={onPieLeave}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-sku-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>
//         <RechartsTooltip formatter={(value) => [`${value}`, "Count"]} />
//         <RechartsLegend />
//       </PieChart>
//     </div>
//   );
// };

// /* =========================
//    Main ServicesTable Component
//    ========================= */
// const ServicesTable = ({ servicesData }) => {
//   // Normalize the incoming data (array or object with a "data" property).
//   const initialServices = Array.isArray(servicesData)
//     ? servicesData
//     : servicesData && Array.isArray(servicesData.data)
//     ? servicesData.data
//     : [];

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredServices, setFilteredServices] = useState(initialServices);
//   const [expandedRows, setExpandedRows] = useState([]); // holds indexes of expanded rows

//   // Update filteredServices whenever servicesData changes.
//   useEffect(() => {
//     const newServices = Array.isArray(servicesData)
//       ? servicesData
//       : servicesData && Array.isArray(servicesData.data)
//       ? servicesData.data
//       : [];
//     setFilteredServices(newServices);
//   }, [servicesData]);

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     // Filter from the normalized services array.
//     const filtered = initialServices.filter(
//       (service) =>
//         service.name.toLowerCase().includes(term) ||
//         service.type.toLowerCase().includes(term) ||
//         service.location.toLowerCase().includes(term)
//     );
//     setFilteredServices(filtered);
//   };

//   // Toggle expansion for the clicked row.
//   const toggleRow = (index) => {
//     if (expandedRows.includes(index)) {
//       setExpandedRows(expandedRows.filter((i) => i !== index));
//     } else {
//       setExpandedRows([...expandedRows, index]);
//     }
//   };

//   // Helper: Render an object or array in a pretty, nested table format.
//   const renderObjectDetails = (obj) => {
//     if (obj === null) return "null";
//     if (Array.isArray(obj)) {
//       return (
//         <ul className="list-disc pl-4">
//           {obj.map((item, idx) => (
//             <li key={idx}>
//               {typeof item === "object" ? renderObjectDetails(item) : item?.toString()}
//             </li>
//           ))}
//         </ul>
//       );
//     } else if (typeof obj === "object") {
//       return (
//         <table className="w-full text-xs border-collapse">
//           <tbody>
//             {Object.entries(obj).map(([key, value]) => (
//               <tr key={key}>
//                 <td className="border px-1 py-0.5 font-medium text-gray-200">{key}</td>
//                 <td className="border px-1 py-0.5 text-gray-300">
//                   {typeof value === "object" ? renderObjectDetails(value) : value?.toString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       );
//     }
//     return obj?.toString();
//   };

//   // Render additional details for a service (excluding the main fields).
//   const renderAdditionalDetails = (service) => {
//     const keysToExclude = new Set(["name", "type", "location"]);
//     const details = Object.entries(service).filter(
//       ([key]) => !keysToExclude.has(key)
//     );

//     return (
//       <div className="bg-[#282c31] rounded p-4">
//         <table className="w-full text-sm border-collapse">
//           <tbody>
//             {details.map(([key, value]) => (
//               <tr key={key} className="border-b border-gray-700">
//                 <td className="px-2 py-1 font-medium text-gray-200 w-1/4">
//                   {key}
//                 </td>
//                 <td className="px-2 py-1 text-gray-300">
//                   {typeof value === "object"
//                     ? renderObjectDetails(value)
//                     : value?.toString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <motion.div
//       className="bg-[#282c31] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//     >
//       {/* Search Input */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-gray-100">Services List</h2>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search services..."
//             className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onChange={handleSearch}
//             value={searchTerm}
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Metrics Cards */}
//       <MetricsCards services={filteredServices} />

//       {/* Main Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-700">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Type
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                 Provisioning State
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             {Array.isArray(filteredServices) &&
//               filteredServices.map((service, index) => (
//                 <React.Fragment key={index}>
//                   {/* Main Row */}
//                   <motion.tr
//                     onClick={() => toggleRow(index)}
//                     className="cursor-pointer"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
//                       {service.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {service.type}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {service.location}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {service.properties?.provisioningState || "N/A"}
//                     </td>
//                   </motion.tr>

//                   {/* Expanded Details Row */}
//                   {expandedRows.includes(index) && (
//                     <motion.tr
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <td colSpan={4} className="px-6 py-4">
//                         {renderAdditionalDetails(service)}
//                       </td>
//                     </motion.tr>
//                   )}
//                 </React.Fragment>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Graphs & Additional Metrics */}
//       <div className="mt-8">
//         <h3 className="text-2xl font-semibold text-gray-100 mb-4">
//           Graphs and Metrics
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <ServicesBarChart services={filteredServices} />
//           <ServicesBarChartByResourceGroup services={filteredServices} />
//           <ServicesPieChartByType services={filteredServices} />
//           <ServicesPieChartByProvisioning services={filteredServices} />
//           <ServicesPieChartBySKU services={filteredServices} />
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ServicesTable;
