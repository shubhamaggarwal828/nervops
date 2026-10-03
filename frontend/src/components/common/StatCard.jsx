import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color, description }) => {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 shadow-lg hover:border-cyan-500/30 hover:shadow-cyan-500/5 transition-all group"
    >
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-75 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color || "#06b6d4" }}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {name}
        </span>
        <div
          className="p-2 rounded-xl transition-all"
          style={{ backgroundColor: `${color || "#06b6d4"}15` }}
        >
          <Icon size={18} style={{ color: color || "#06b6d4" }} />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold font-heading text-white tracking-tight">
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
