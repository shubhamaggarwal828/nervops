import GenericBarChart from "./GenericBarChart";

const ServicesBarChartByResourceGroup = ({ services }) => {
	// Reduce data to counts, preserving the original text
	const counts = services.reduce((acc, service) => {
		if (service.id) {
			// Extract resource group from the `id` field
			const match = service.id.match(/resourceGroups\/([^/]+)\//i);
			if (match) {
				const rg = match[1]; // Preserve the original text
				const key = rg.toLowerCase(); // Use lowercase for grouping
				acc[key] = acc[key] || { original: rg, count: 0 };
				acc[key].count += 1; // Increment count for the group
			}
		}
		return acc;
	}, {});

	// Convert the counts object to chart data
	const chartData = Object.values(counts).map(({ original, count }) => ({
		key: original, // Use the original name for display
		value: count,  // Count as the Y-axis value
	}));

	return (
		<GenericBarChart
			data={chartData}
			xKey="key"
			yKey="value"
			title="Services by Resource Group"
		/>
	);
};

export default ServicesBarChartByResourceGroup;
