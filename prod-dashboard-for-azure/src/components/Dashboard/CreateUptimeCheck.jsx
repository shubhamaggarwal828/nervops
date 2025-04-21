import React, { useState } from "react";
import {
  Menu,
  Home,
  Layout,
  FormInput,
  Star,
  Grid,
  Mail,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react";
import logo from '../../images/logo.png'; 
import { NavLink } from "react-router-dom";

const CreateUptimeCheck = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-[#282C31] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`w-full md:w-72 bg-[#1E2125] p-4 flex flex-col transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          <NavItem icon={Home} text="Dashboard" path="/uptime-dashboard" />
          <NavItem
            icon={Layout}
            text="Create An Uptime Check"
            path="/create-uptime-check"
          />
          <NavItem icon={FormInput} text="Temp" path="/temp-dashboard" />
          {/* <NavItem
            icon={Grid}
            text="Layout"
            path="/layout"
            isActive={location.pathname === "/layout"}
            navigate={navigate}
          />
          <NavItem
            icon={Mail}
            text="Emails"
            path="/emails"
            isActive={location.pathname === "/emails"}
            navigate={navigate}
          />
          <NavItem
            icon={ImageIcon}
            text="Illustrations"
            path="/illustrations"
            isActive={location.pathname === "/illustrations"}
            navigate={navigate}
          />
          <NavItem
            icon={HelpCircle}
            text="Help"
            path="/help"
            isActive={location.pathname === "/help"}
            navigate={navigate}
          /> */}
        </nav>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden p-4">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-semibold">
                  Create an Uptime Check
                </h1>
                <div className="text-green-400 text-base">
                  Start monitoring your service
                </div>
              </div>
            </div>
          </header>

          {/* Create Uptime Check Form and Image */}
          <div className="bg-[#282C31] p-6 rounded-lg flex flex-col md:flex-row gap-6">
            {/* Left Side: Form */}
            <div className="flex-1 bg-[#1E2125] p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">
                Create Uptime Check
              </h2>
              <form>
                {/* URL Input */}
                <div className="mb-4">
                  <label htmlFor="url" className="block text-gray-400 mb-2">
                    URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    className="w-full bg-[#282C31] rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Enter the URL to monitor"
                  />
                </div>

                {/* Check Type and Interval Dropdowns */}
                <div className="flex items-center gap-4 mb-4 w-full">
                  <div className="flex-1">
                    <label
                      htmlFor="checkType"
                      className="block text-gray-400 mb-2"
                    >
                      Check Type
                    </label>
                    <select
                      id="checkType"
                      className="w-full bg-[#282C31] text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="http">HTTP</option>
                      <option value="ping">Ping</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="interval"
                      className="block text-gray-400 mb-2"
                    >
                      Check Interval
                    </label>
                    <select
                      id="interval"
                      className="w-full bg-[#282C31] text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                      <option value="1">1 minute</option>
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    Test URL
                  </button>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  >
                    Create Uptime Check
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side: Image */}
            <div className="flex-1 bg-[#1E2125] p-6 rounded-lg flex justify-center items-center">
              <img
                src="https://img.freepik.com/free-photo/submitting-online-internet-loading-progress-website-concept_53876-124769.jpg"
                alt="Uptime Check Illustration"
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated NavItem component with new active color
const NavItem = ({ icon: Icon, text, path, active = false }) => (
  <NavLink
    to={path}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
      ${
        isActive
          ? "text-white bg-[#205c44]"
          : "text-gray-400 hover:text-gray-200"
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </NavLink>
);

export default CreateUptimeCheck;
