import { motion } from "framer-motion";

const SettingSection = ({ icon: Icon, title, children }) => {
	return (
		<motion.div
			className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl mb-8"
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
				{Icon && <Icon className="text-cyan-400 size-5" />}
				<h2 className="text-base font-bold text-white font-heading tracking-tight">{title}</h2>
			</div>
			{children}
		</motion.div>
	);
};

export default SettingSection;
