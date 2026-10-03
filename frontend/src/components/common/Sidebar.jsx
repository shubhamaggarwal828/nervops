import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cloud,
  Tag
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const SIDEBAR_ITEMS = [
  {
    name: "Azure Overview",
    icon: LayoutDashboard,
    href: "/",
    color: "#22d3ee", // cyan-400
  },
  {
    name: "Detailed Metrics",
    icon: Activity,
    href: "/azure-detailed-metrics",
    color: "#34d399", // emerald-400
  },
  {
    name: "Audit & Security Report",
    icon: ShieldAlert,
    href: "/azure-audit-report",
    color: "#f59e0b", // amber-500
  },
  {
    name: "Tag Compliance",
    icon: Tag,
    href: "/tag-compliance",
    color: "#a855f7", // purple-500
  },
  {
    name: "Settings & Cloud Sync",
    icon: Settings,
    href: "/settings",
    color: "#94a3b8", // slate-400
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.div
      className={`relative z-20 flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-[#0b0f19] border-r border-slate-800/80 flex flex-col justify-between p-4 shadow-xl select-none">
        {/* Top Branding Section */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <ShieldCheck className="size-5 text-slate-950 font-bold" />
                </div>
                <div>
                  <span className="text-lg font-bold font-heading tracking-tight text-white block leading-none">
                    Nerv<span className="text-cyan-400">Ops</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                    CSPM Console
                  </span>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <ShieldCheck className="size-5 text-slate-950 font-bold" />
              </div>
            )}

            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {!isSidebarOpen && (
            <div className="flex justify-center my-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} to={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={`flex items-center p-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <Icon
                      size={20}
                      style={{ color: isActive ? "#22d3ee" : item.color }}
                      className="flex-shrink-0"
                    />

                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-3.5 whitespace-nowrap font-medium"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Button */}
        <div className="pt-4 border-t border-slate-800/60">
          {isSidebarOpen && user && (
            <div className="mb-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold uppercase">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user.name || "Operator"}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isSidebarOpen ? "px-3.5 py-2.5 justify-start" : "p-2.5 justify-center"
            } text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all cursor-pointer`}
          >
            <LogOut size={16} className="text-rose-400 flex-shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className="ml-2.5 whitespace-nowrap"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;