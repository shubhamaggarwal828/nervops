import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CYBER_PALETTE = [
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#f59e0b", // Amber
  "#ec4899", // Rose
  "#3b82f6", // Blue
  "#14b8a6", // Teal
];

const PieCharts = ({ data, heading }) => {
  return (
    <motion.div
      className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white font-heading tracking-tight">
          {heading}
        </h2>
        <span className="text-[11px] font-mono text-slate-400">Ratio (%)</span>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CYBER_PALETTE[index % CYBER_PALETTE.length]}
                  stroke="#0f172a"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-slate-300 font-medium ml-1 mr-3">
                  {value.length > 22 ? `${value.slice(0, 22)}...` : value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PieCharts;
