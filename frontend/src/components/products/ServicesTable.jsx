import { motion } from "framer-motion";
import { Search, Server, MapPin, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const ServicesTable = ({ servicesData }) => {
  const initialServices = Array.isArray(servicesData)
    ? servicesData
    : servicesData && Array.isArray(servicesData.data)
    ? servicesData.data
    : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState(initialServices);

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
            <Server size={18} className="text-cyan-400" />
            Azure Resources Inventory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Discovered compute, storage, and networking assets under active subscriptions
          </p>
        </div>

        {/* Search input with glass styling */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Filter resources by name, type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs placeholder-slate-500"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800">
          <thead>
            <tr className="bg-slate-950/70">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Resource Name
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Resource Type
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Region / Location
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Provisioning Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
            {Array.isArray(filteredServices) && filteredServices.length > 0 ? (
              filteredServices.map((service, index) => {
                const status = service.properties?.provisioningState || "Succeeded";
                const isSuccess = status.toLowerCase() === "succeeded";

                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-white font-mono">
                      {service.name}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-300">
                      <span className="px-2 py-1 rounded-md bg-slate-800/80 text-cyan-300 border border-slate-700/60 font-mono text-[11px]">
                        {service.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-500" />
                      {service.location}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          isSuccess
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {isSuccess ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-xs text-slate-500">
                  No resources discovered in this subscription yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ServicesTable;
