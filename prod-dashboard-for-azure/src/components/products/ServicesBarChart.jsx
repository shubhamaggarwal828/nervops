import GenericBarChart from "./GenericBarChart";

const ServicesBarChart = ({ services }) => {
	const counts = services.reduce((acc, service) => {
		const location = service.location || "Unknown";
		acc[location] = (acc[location] || 0) + 1;
		return acc;
	}, {});
	const chartData = Object.keys(counts).map((location) => ({
		key: location,
		value: counts[location],
	}));

	return <GenericBarChart data={chartData} xKey="key" yKey="value" title="Services by Location" />;
};

export default ServicesBarChart;
