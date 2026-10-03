import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";
import {
  FaCog as Settings,
  FaPause as Pause,
  FaHome as Home,
  FaThLarge as Layout,
  FaWpforms as FormInput,
  FaStar as Star,
  FaTh as Grid,
  FaEnvelope as Mail,
  FaImage as ImageIcon,
  FaQuestionCircle as HelpCircle,
  FaBars as HamburgerMenu,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import Draggable from "react-draggable";
import "@fontsource/poppins"; // Importing Poppins font

const responseTimeData = [
  { date: "Jul 20", value: 150 },
  { date: "15 Jul", value: 200 },
  { date: "Aug 20", value: 120 },
  { date: "15 Aug", value: 100 },
  { date: "Sep 20", value: 130 },
  { date: "15 Sep", value: 110 },
  { date: "Oct 20", value: 115 },
];

const incidentData = [
  { date: "21 Jun", value: 1 },
  { date: "25 Jun", value: 3 },
  { date: "29 Jun", value: 4 },
  { date: "03 Jul", value: 5 },
  { date: "07 Jul", value: 2 },
  { date: "10 Jul", value: 1 },
  { date: "13 Jul", value: 2 },
];

const NavItem = ({ icon: Icon, text, path, active = false }) => (
  <Link to={path}>
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
        active ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </div>
  </Link>
);

const StatsRow = ({
  period,
  availability,
  downtime,
  incidents,
  longestIncident,
  avgIncident,
}) => (
  <tr className="border-b border-gray-700">
    <td className="py-3 px-4 text-gray-300">{period}</td>
    <td className="py-3 px-4 text-gray-300">{availability}</td>
    <td className="py-3 px-4 text-red-500">{downtime}</td>
    <td className="py-3 px-4 text-gray-300">{incidents}</td>
    <td className="py-3 px-4 text-gray-300">{longestIncident}</td>
    <td className="py-3 px-4 text-gray-300">{avgIncident}</td>
  </tr>
);

const TempDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const chartOptions = {
    chart: {
      height: 300,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    series: [
      {
        name: "Visitors",
        data: [180, 51, 60, 38, 88, 50, 40, 52, 88, 80, 60, 70],
      },
    ],
    stroke: { curve: "smooth", width: 2, colors: ["#34d399"] },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#10b981"],
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      categories: [
        "Jan 25",
        "Jan 26",
        "Jan 27",
        "Jan 28",
        "Jan 29",
        "Jan 30",
        "Jan 31",
        "Feb 01",
        "Feb 02",
        "Feb 03",
        "Feb 04",
        "Feb 05",
      ],
      labels: {
        style: { colors: "#9ca3af", fontSize: "13px", fontFamily: "Poppins" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "13px", fontFamily: "Poppins" },
      },
    },
    tooltip: {
      theme: "dark",
      x: { format: "dd MMM" },
      y: { formatter: (value) => `${value} visits` },
    },
  };

  return (
    <div className="min-h-screen bg-[#282c31] text-gray-100 flex flex-col md:flex-row font-poppins">
      <div
        className={`w-full md:w-72 bg-[#1e2125] p-4 flex flex-col transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="text-2xl font-bold text-white px-4 mt-0">
          Uptime Fury
        </div>
        <nav className="flex-1 mt-6">
          <NavItem icon={Home} text="Dashboard" path="/uptime-dashboard" />
          <NavItem
            icon={Layout}
            text="Create An Uptime Check"
            path="/create-uptime-check"
          />
          <NavItem icon={FormInput} text="Temp" path="/temp-dashboard" />
          <NavItem icon={Star} text="Extra" />
          <NavItem icon={Grid} text="Layout" />
          <NavItem icon={Mail} text="Emails" />
          <NavItem icon={ImageIcon} text="Illustrations" />
          <NavItem icon={HelpCircle} text="Help" />
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4">
          <button onClick={toggleSidebar}>
            <HamburgerMenu className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h1 className="text-xl font-semibold">tabler-icons.io</h1>
                <div className="text-green-400 text-sm">
                  Up
                  <span className="text-gray-400 ml-2">
                    · Checked every 3 minutes
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-auto ms-auto d-print-none">
              <div className="btn-list flex gap-4">
                <a
                  href="#"
                  className="btn inline-flex items-center px-4 py-2 bg-transparent text-gray-400 hover:text-gray-200"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </a>
                <a
                  href="#"
                  className="btn inline-flex items-center px-4 py-2 bg-transparent text-gray-400 hover:text-gray-200"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Configure
                </a>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Draggable>
              <div className="bg-[#1e2125] p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Response Time</h2>
                <Chart
                  options={chartOptions}
                  series={chartOptions.series}
                  type="area"
                  height={300}
                />
              </div>
            </Draggable>

            <Draggable>
              <div className="bg-[#1e2125] p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Incidents</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={incidentData}>
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af" }} />
                    <YAxis tick={{ fill: "#9ca3af" }} />
                    <Bar dataKey="value" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Draggable>
          </div>

          <div className="bg-[#1e2125] p-6 rounded-lg overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Uptime Stats</h2>
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-400">Period</th>
                  <th className="py-3 px-4 text-gray-400">Availability</th>
                  <th className="py-3 px-4 text-gray-400">Downtime</th>
                  <th className="py-3 px-4 text-gray-400">Incidents</th>
                  <th className="py-3 px-4 text-gray-400">Longest Incident</th>
                  <th className="py-3 px-4 text-gray-400">Average Incident</th>
                </tr>
              </thead>
              <tbody>
                <StatsRow
                  period="Last 7 days"
                  availability="100%"
                  downtime="0m"
                  incidents="0"
                  longestIncident="-"
                  avgIncident="-"
                />
                <StatsRow
                  period="Last 30 days"
                  availability="99.96%"
                  downtime="16m"
                  incidents="1"
                  longestIncident="16m"
                  avgIncident="16m"
                />
                <StatsRow
                  period="Last 90 days"
                  availability="99.97%"
                  downtime="32m"
                  incidents="2"
                  longestIncident="16m"
                  avgIncident="16m"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempDash;