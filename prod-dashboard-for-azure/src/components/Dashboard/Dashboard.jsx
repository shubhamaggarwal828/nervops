import React, { useState } from "react";
import {
  User,
  Menu,
  Settings,
  Pause,
  Home,
  Layout,
  FormInput,
  Star,
  Grid,
  Mail,
  Image as ImageIcon,
  HelpCircle,
  Bell,
  MoreHorizontal,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  PauseCircle,
  List,

} from "lucide-react";

import {
  FaHome,
  FaCheckCircle,
  FaShieldAlt,
  FaCogs,
  FaLock,
  FaFileAlt,
  FaGlobe,
  FaServer,
  FaUserShield,
  FaLink,
  FaCertificate,
  FaHeartbeat,
  FaHSquare,
  FaHackerNewsSquare
} from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../../images/logo.png';
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const monitorsByCategory = {
    Core: [
      {
        title: "piedpiper.com",
        status: "Up",
        duration: "66d 18h 26m",
        updateTime: "30s",
        incidents: 2,
      },
      {
        title: "developers.piedpiper.com",
        status: "Up",
        duration: "60d 9h 39m",
        updateTime: "30s",
        incidents: 4,
      },
      {
        title: "piedpiper.com/compression",
        status: "Up",
        duration: "35d 4h 22m",
        updateTime: "30s",
        incidents: 9,
      },
      {
        title: "hooli.com",
        status: "Paused",
        duration: "2d 18h 41m",
        updateTime: "30s",
      },
    ],
    Other: [
      {
        title: "Payments API",
        status: "Up",
        duration: "23d 1h 12m",
        updateTime: "30s",
        incidents: 22,
      },
      {
        title: "ping 158.195.26.1",
        status: "Down",
        duration: "1h 09m",
        updateTime: "30s",
        incidents: 1,
        hasOngoingIncident: true,
      },
    ],
    DNS: [
      {
        title: "8.8.8.8",
        status: "Up",
        duration: "165d 12h 35m",
        updateTime: "1m",
        incidents: 0,
      },
      {
        title: "CloudFlare DNS",
        status: "Up",
        duration: "3d 18h 32m",
        updateTime: "1m",
        incidents: 0,
      },
    ],
  };

  // Calculate statistics from actual monitor data
  const stats = Object.values(monitorsByCategory).reduce(
    (acc, monitors) => {
      monitors.forEach((monitor) => {
        acc.total += 1;
        if (monitor.status === "Up") acc.up += 1;
        if (monitor.status === "Down") acc.down += 1;
        if (monitor.status === "Paused") acc.paused += 1;
      });
      return acc;
    },
    { total: 0, up: 0, down: 0, paused: 0 }
  );

  // Determine which status count to show based on priority
  const getPriorityStatus = () => {
    if (stats.down > 0)
      return {
        count: stats.down,
        type: "Down",
        color: "text-red-500 bg-red-500/10",
      };
    if (stats.paused > 0)
      return {
        count: stats.paused,
        type: "Paused",
        color: "text-yellow-500 bg-yellow-500/10",
      };
    return {
      count: stats.up,
      type: "Up",
      color: "text-green-500 bg-green-500/10",
    };
  };

  const priorityStatus = getPriorityStatus();

  return (
    <div className="min-h-screen bg-[#282c31] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`w-full md:w-72 bg-[#1E2125] p-4 flex flex-col transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex items-center text-2xl font-bold text-white px-4 mt-0">
          <img
            src={logo}
            alt="Uptime Fury Logo"
            className="h-16 w-16 mr-2"
          />
          Uptime Fury
        </div>

        <nav className="flex-1 mt-6">
          <NavItem
            icon={FaHome}
            text="Dashboard"
            path="/uptime-dashboard"
            isActive={location.pathname === "/uptime-dashboard"}
            navigate={navigate}
          />
          <NavItem
            icon={FaCheckCircle}
            text="Create An Uptime Check"
            path="/create-uptime-check"
            isActive={location.pathname === "/create-uptime-check"}
            navigate={navigate}
          />
          <NavItem
            icon={FaShieldAlt}
            text="Create SSL Check"
            path="/create-ssl-check"
            isActive={location.pathname === "/create-ssl-check"}
            navigate={navigate}
          />
          <NavItem
            icon={FaCogs}
            text="Configure Uptime Checks"
            path="/configure-uptime-checks"
            isActive={location.pathname === "/configure-uptime-checks"}
            navigate={navigate}
          />
          <NavItem
            icon={FaLock}
            text="Configure SSL Checks"
            path="/configure-ssl-checks"
            isActive={location.pathname === "/configure-ssl-checks"}
            navigate={navigate}
          />
          <NavItem
            icon={FaFileAlt}
            text="Create Status Page"
            path="/create-status-page"
            isActive={location.pathname === "/create-status-page"}
            navigate={navigate}
          />
          <NavItem
            icon={FaGlobe}
            text="DNS Lookup"
            path="/dns-lookup"
            isActive={location.pathname === "/dns-lookup"}
            navigate={navigate}
          />
          <NavItem
            icon={FaServer}
            text="NS Lookup"
            path="/ns-lookup"
            isActive={location.pathname === "/ns-lookup"}
            navigate={navigate}
          />
          <NavItem
            icon={FaUserShield}
            text="WHOIS Lookup"
            path="/whois-lookup"
            isActive={location.pathname === "/whois-lookup"}
            navigate={navigate}
          />
          <NavItem
            icon={FaLink}
            text="HTTP Lookup"
            path="/http-lookup"
            isActive={location.pathname === "/http-lookup"}
            navigate={navigate}
          />
          <NavItem
            icon={FaCertificate}
            text="SSL Lookup"
            path="/ssl-lookup"
            isActive={location.pathname === "/ssl-lookup"}
            navigate={navigate}
          />
          <NavItem
            icon={FaHeartbeat}
            text="PING Test"
            path="/ping-test"
            isActive={location.pathname === "/ping-test"}
            navigate={navigate}
          />
        </nav>
      </div>

      <div className="flex-1">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden p-4">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <main className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Have a great day, Richard!
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search monitors"
                    className="bg-[#1E2125] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-md focus:outline-none w-64"
                  />
                </div>
              </div>
              <button className="bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-[#205c44]">
                Create Monitor
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-5 gap-4">
            {/* Priority Status */}
            <div className="bg-[#1E2125] rounded-lg p-4 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                {priorityStatus.type === "Down" && (
                  <XCircle className="text-red-500 w-6 h-6" />
                )}
                {priorityStatus.type === "Paused" && (
                  <PauseCircle className="text-yellow-500 w-6 h-6" />
                )}
                {priorityStatus.type === "Up" && (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                )}
                <div
                  className={`text-xl font-semibold ${priorityStatus.color}`}
                >
                  {priorityStatus.count} {priorityStatus.type}
                </div>
              </div>
            </div>

            {/* Total Checks */}
            <div className="bg-[#1E2125] rounded-lg p-4 flex items-center space-x-1">
              <List className="text-blue-500 w-10 h-10" />
              <div className="flex-1 text-center">
                <div className="text-sm text-white font-bold">Total Checks</div>
                <div className="text-xl font-semibold text-white">
                  {stats.total}
                </div>
              </div>
            </div>

            {/* Up Count */}
            <div className="bg-[#1E2125] rounded-lg p-4 flex items-center">
              <CheckCircle className="text-green-500 w-10 h-10" />
              <div className="flex-1 text-center">
                <div className="text-sm text-white font-bold">Up Checks</div>
                <div className="text-xl font-semibold text-white">
                  {stats.up}
                </div>
              </div>
            </div>

            {/* Down Count */}
            <div className="bg-[#1E2125] rounded-lg p-4 flex items-center ">
              <XCircle className="text-red-500 w-10 h-10" />
              <div className="flex-1 text-center">
                <div className="text-sm text-white font-bold">Down Checks</div>
                <div className="text-xl font-semibold text-white">
                  {stats.down}
                </div>
              </div>
            </div>

            {/* Paused Count */}
            <div className="bg-[#1E2125] rounded-lg p-4 flex items-center">
              <PauseCircle className="text-yellow-500 w-10 h-10" />
              <div className="flex-1 text-center">
                <div className="text-sm text-white font-bold ">
                  Paused Checks
                </div>
                <div className="text-xl font-semibold text-white">
                  {stats.paused}
                </div>
              </div>
            </div>
          </div>

          {/* Monitor Sections */}
          {Object.entries(monitorsByCategory).map(([category, monitors]) => (
            <section key={category} className="space-y-4">
              <h2 className="text-gray-400 text-sm font-medium">{category}</h2>
              <div className="bg-[#1E2125] rounded-lg divide-y divide-[#282C31]">
                {monitors.map((monitor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-[#282C31] transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${monitor.status === "Up"
                          ? "bg-green-500"
                          : monitor.status === "Paused"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                          }`}
                      />
                      <div>
                        <div className="text-white font-medium">
                          {monitor.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          <span
                            className={
                              monitor.status === "Down"
                                ? "text-red-400"
                                : monitor.status === "Paused"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            }
                          >
                            {monitor.status}
                          </span>
                          {" · "}
                          {monitor.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      {monitor.incidents !== undefined && (
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Shield size={16} />
                          <span>{monitor.incidents}</span>
                        </div>
                      )}
                      {monitor.hasOngoingIncident && (
                        <span className="text-sm text-red-400 bg-red-400/10 px-2 py-1 rounded">
                          Ongoing incident
                        </span>
                      )}
                      <span className="text-gray-400">
                        {monitor.updateTime}
                      </span>
                      <MoreHorizontal className="text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, text, path, navigate, isActive = false }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${isActive
      ? "bg-[#205C44] text-white"
      : "text-gray-400 hover:text-gray-200 hover:bg-[#282C31]"
      }`}
    onClick={() => path && navigate(path)}
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </div>
);

export default Dashboard;
