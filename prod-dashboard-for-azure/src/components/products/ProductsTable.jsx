import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const PRODUCT_DATA = [
	{ id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200 },
	{ id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800 },
	{ id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650 },
	{ id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950 },
	{ id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720 },
];

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredServices, setFilteredServices] = useState(servicesData);
  
	// Update filteredServices when the incoming servicesData changes
	useEffect(() => {
	  setFilteredServices(servicesData);
	}, [servicesData]);
  
	const handleSearch = (e) => {
	  const term = e.target.value.toLowerCase();
	  setSearchTerm(term);
	  const filtered = servicesData.filter(
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
				  Actions
				</th>
			  </tr>
			</thead>
			<tbody className="divide-y divide-gray-700">
			  {filteredServices.map((service, index) => (
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
					<button className="text-indigo-400 hover:text-indigo-300 mr-2">
					  <Edit size={18} />
					</button>
					<button className="text-red-400 hover:text-red-300">
					  <Trash2 size={18} />
					</button>
				  </td>
				</motion.tr>
			  ))}
			</tbody>
		  </table>
		</div>
	  </motion.div>
	);
  };
export default ProductsTable;
