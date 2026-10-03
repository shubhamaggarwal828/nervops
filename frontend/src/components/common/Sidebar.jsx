import {
	BarChart2,
	DollarSign,
	Menu,
	Settings,
	ShoppingBag,
	TrendingUp,
	Users,
	LogOut,
  } from "lucide-react";
  import { useState } from "react";
  import { AnimatePresence, motion } from "framer-motion";
  import { Link, useNavigate } from "react-router-dom";
  import logoFull from "../../images/logo.png";
  import logoIcon from "../../images/icon.png";
  
  const SIDEBAR_ITEMS = [
	{
	  name: "Azure Overview",
	  icon: BarChart2,
	  color: "#6366f1",
	  href: "/",
	},
	{
	  name: "Azure Detailed Metrics",
	  icon: ShoppingBag,
	  color: "#8B5CF6",
	  href: "/azure-detailed-metrics",
	},
	{
	  name: "Azure Audit Report",
	  icon: Users,
	  color: "#EC4899",
	  href: "/azure-audit-report",
	},
	{ name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
  ];
  
  const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();
  
	const handleLogout = async () => {
	  try {
		const response = await fetch(`${import.meta.env.VITE_DEV_API_URL}/logout`, {
		  method: "POST",
		  credentials: "include", // Include cookies if needed
		});
  
		const data = await response.json(); // Parse the JSON response
  
		if (response.ok && data.success) {
		  console.log("Logout successful:", data.message);
		  // Redirect to login page
		  window.location.href = "/login"; // Forces a full reload to reset state
		} else {
		  console.error("Logout failed:", data.message || "Unknown error");
		  alert("Failed to logout. Please try again.");
		}
	  } catch (error) {
		console.error("Logout error:", error);
		alert("An error occurred. Please try again.");
	  }
	};
  
	return (
	  <motion.div
		className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
		  isSidebarOpen ? "w-64" : "w-20"
		}`}
		animate={{ width: isSidebarOpen ? 256 : 80 }}
	  >
		<div className="h-full bg-[#1e2125] backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
		  {/* Toggle Button */}
		  <motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
		  >
			<Menu size={24} />
		  </motion.button>
  
		  {/* Logo Section */}
		  <div className="my-4 flex items-center justify-center">
			{isSidebarOpen ? (
			  <img src={logoFull} alt="Full Logo" className="w-40 object-contain" />
			) : (
			  <img src={logoIcon} alt="Logo Icon" className="w-14 object-contain" />
			)}
		  </div>
  
		  {/* Navigation Items */}
		  <nav className="mt-8 flex-grow">
			{SIDEBAR_ITEMS.map((item) => (
			  <Link key={item.href} to={item.href}>
				<motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
				  <item.icon
					size={20}
					style={{ color: item.color, minWidth: "20px" }}
				  />
				  <AnimatePresence>
					{isSidebarOpen && (
					  <motion.span
						className="ml-4 whitespace-nowrap"
						initial={{ opacity: 0, width: 0 }}
						animate={{ opacity: 1, width: "auto" }}
						exit={{ opacity: 0, width: 0 }}
						transition={{ duration: 0.2, delay: 0.3 }}
					  >
						{item.name}
					  </motion.span>
					)}
				  </AnimatePresence>
				</motion.div>
			  </Link>
			))}
		  </nav>
  
		  {/* Logout Button */}
		  <motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onClick={handleLogout}
			className="flex items-center mt-auto p-4 text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
		  >
			<LogOut size={20} style={{ color: "#F87171", minWidth: "20px" }} />
			<AnimatePresence>
			  {isSidebarOpen && (
				<motion.span
				  className="ml-4 whitespace-nowrap"
				  initial={{ opacity: 0, width: 0 }}
				  animate={{ opacity: 1, width: "auto" }}
				  exit={{ opacity: 0, width: 0 }}
				  transition={{ duration: 0.2, delay: 0.3 }}
				>
				  Logout
				</motion.span>
			  )}
			</AnimatePresence>
		  </motion.button>
		</div>
	  </motion.div>
	);
  };
  
  export default Sidebar;
  