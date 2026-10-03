import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Layers, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

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
        service.name?.toLowerCase().includes(term) ||
        service.type?.toLowerCase().includes(term) ||
        service.location?.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((i) => i !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const renderObjectDetails = (obj) => {
    if (obj === null || obj === undefined) return <span className="text-slate-500 italic">null</span>;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span className="text-slate-500 italic">[]</span>;
      return (
        <ul className="list-disc pl-4 space-y-1">
          {obj.map((item, idx) => (
            <li key={idx} className="text-xs text-slate-300">
              {typeof item === "object" ? renderObjectDetails(item) : item?.toString()}
            </li>
          ))}
        </ul>
      );
    } else if (typeof obj === "object") {
      return (
        <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 font-mono text-[11px] space-y-1">
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <span className="text-cyan-400 font-semibold">{key}:</span>
              <span className="text-slate-300 break-all">
                {typeof value === "object" ? renderObjectDetails(value) : value?.toString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-slate-300 font-mono text-xs">{obj?.toString()}</span>;
  };

  const renderAdditionalDetails = (service) => {
    const keysToExclude = new Set(["name", "type", "location"]);
    const details = Object.entries(service).filter(([key]) => !keysToExclude.has(key));
    return (
      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 shadow-inner space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Raw Metadata & Properties Payload
          </span>
          <span className="text-[11px] font-mono text-cyan-400">Resource ID: {service.id || "N/A"}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {details.map(([key, value]) => (
            <div key={key} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                {key}
              </div>
              <div className="text-xs">{renderObjectDetails(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl mb-8"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white font-heading tracking-tight flex items-center gap-2">
            <Layers size={18} className="text-cyan-400" />
            Detailed Resource Telemetry & Properties
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any resource row to inspect deeply nested ARM specifications, SKU parameters, and tags
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search attributes, type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs placeholder-slate-500"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800">
          <thead>
            <tr className="bg-slate-950/80">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                ARM Resource Type
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                State
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Inspector
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
            {Array.isArray(filteredServices) && filteredServices.length > 0 ? (
              filteredServices.map((service, index) => {
                const isExpanded = expandedRows.includes(index);
                const state = service.properties?.provisioningState || "Succeeded";
                const isSuccess = state.toLowerCase() === "succeeded";

                return (
                  <React.Fragment key={index}>
                    <motion.tr
                      onClick={() => toggleRow(index)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? "bg-slate-800/60" : "hover:bg-slate-800/40"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-white font-mono">
                        {service.name}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 font-mono text-[11px] text-cyan-300">
                          {service.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-400 font-mono">
                        {service.location}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            isSuccess
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {isSuccess ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
                          {state}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-right text-slate-400">
                        <button className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                          <td colSpan={5} className="p-4">
                            {renderAdditionalDetails(service)}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-500">
                  No resources matching your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DetailedAzureMetrics;
