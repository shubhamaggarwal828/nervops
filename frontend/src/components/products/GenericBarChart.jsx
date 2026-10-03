import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const GenericBarChart = ({ data, xKey, yKey, title }) => {
	return (
		<motion.div
			className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<h3 className="text-base font-bold text-white font-heading mb-4 tracking-tight flex items-center justify-between">
				<span>{title}</span>
				<span className="text-xs font-normal text-cyan-400 font-mono">Count Distribution</span>
			</h3>
			<div className="w-full h-72">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
						<XAxis
							dataKey={xKey}
							stroke="#64748b"
							fontSize={11}
							angle={-20}
							textAnchor="end"
							tick={{ fill: "#94a3b8" }}
						/>
						<YAxis stroke="#64748b" fontSize={11} allowDecimals={false} tick={{ fill: "#94a3b8" }} />
						<Tooltip
							contentStyle={{
								backgroundColor: "#0f172a",
								borderColor: "#1e293b",
								borderRadius: "0.75rem",
								boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
								fontSize: "12px",
							}}
							itemStyle={{ color: "#22d3ee" }}
							cursor={{ fill: "rgba(30, 41, 59, 0.4)" }}
						/>
						<Bar dataKey={yKey} fill="#06b6d4" radius={[6, 6, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default GenericBarChart;
