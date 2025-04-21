// export default Navbar;

import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  FiMoon,
  FiSun,
  FiBarChart2,
  FiLock,
  FiWifi,
  FiServer,
  FiUserCheck,
  FiMap,
  FiGlobe,
  FiCode,
} from "react-icons/fi";

import logo from "../../assets/img/logo.png";

const Navbar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isMenu1Open, setIsMenu1Open] = useState(false);
  const [isMenu2Open, setIsMenu2Open] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const resetDropdowns = () => {
    setIsMenu1Open(false);
    setIsMenu2Open(false);
  };

  const toggleMenu1 = () => {
    setIsMenu1Open(true);
    setIsMenu2Open(false);

    // Close menu1 automatically after 5 seconds
    setTimeout(() => {
      setIsMenu1Open(false);
    }, 5000);
  };

  const toggleMenu2 = () => {
    setIsMenu2Open(true);
    setIsMenu1Open(false);

    // Close menu2 automatically after 10 seconds
    setTimeout(() => {
      setIsMenu2Open(false);
    }, 10000); // Changed from 5000 to 10000 milliseconds (10 seconds)
  };


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`py-3 lg:fixed top-0 left-0 z-50 w-full border-b border-gray-700 ${isScrolled
          ? isDarkMode
            ? "bg-[#121212]"
            : "bg-[#f9f9f9]"
          : isDarkMode
            ? "bg-[#1f1f1f]"
            : "bg-[#f9f9f9]"
        } ${isDarkMode ? "text-white" : "text-black"}`}
    >
      <div className="mx-auto custom-width px-2 sm:px-4 lg:px-4">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="flex justify-between lg:flex-row">
            <Link to="/home" className="flex items-center">
              <img
                src={logo}
                alt="Uptime Fury Logo"
                className="mr-3 h-12 sm:h-12 transition-opacity duration-300"
              />
              <span className="self-center text-lg font-bold uppercase whitespace-nowrap">
                NERVOPS
              </span>
            </Link>
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleDarkMode}
                className="cursor-pointer font-semibold text-center transition-all duration-500 py-3 px-6 text-sm flex items-center order-1"
              >
                {isDarkMode ? (
                  <FiSun className="w-6 h-6" />
                ) : (
                  <FiMoon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={toggleNavbar}
                type="button"
                className="inline-flex items-center p-2 ml-3 text-sm rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 order-2"
                aria-controls="navbar-default"
                aria-expanded={isNavbarOpen}
              >
                <span className="sr-only">Open main menu</span>
                <FaBars className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div
            className={`w-full lg:flex lg:pl-11 max-lg:mt-1 max-lg:h-screen max-lg:overflow-y-auto ${isNavbarOpen ? "block" : "hidden"
              }`}
            id="navbar"
          >
            <ul className="flex lg:items-center lg:justify-center flex-col max-lg:gap-4 max-lg:pt-4 max-lg:mb-4 lg:mt-0 lg:flex-row lg:mx-auto">
              <li>
                <Link
                  onClick={resetDropdowns}
                  to="/home"
                  className="nav-link  block lg:mr-6 md:mb-0 lg:text-left xl:text-base lg:text-sm font-medium transition-all duration-500 hover:text-gray-300"
                >
                  Home
                </Link>
              </li>

              <li className="relative">
                <button
                  onClick={toggleMenu2}
                  className="dropdown-toggle flex items-center justify-between text-center xl:text-base lg:text-sm font-medium hover:text-gray-300 transition-all duration-500 lg:mr-6 lg:mb-0 mr-auto lg:text-left lg:m-0"
                >
                  Our Company
                  <svg
                    className={`ml-2 h-4 w-4 ${isDarkMode ? "text-white" : "text-black"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {/* <IoMdArrowDropdown className="w-3 h-2 ml-1.5" /> */}
                </button>
                {/* Dropdown menu */}
                <div
                  id="menu2"
                  aria-labelledby="menu2"
                  className={`dropdown-menu z-10 relative top-3 max-lg:mb-3 lg:absolute lg:top-14 font-normal rounded-lg w-64 xl:p-8 lg:p-4 p-2 ${isMenu2Open ? "block" : "hidden"
                    } ${isDarkMode ? "bg-[#1f1f1f]" : "bg-[#f9f9f9]"}`}
                >
                  <ul className="text-sm" aria-labelledby="dropdownLargeButton">
                    <li>
                      <Link
                        onClick={resetDropdowns}
                        to="/about-us"
                        className="block py-3 hover:text-gray-300 xl:text-base lg:text-sm font-semibold transition-all duration-500"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={resetDropdowns}
                        to="/websitemonitoring"
                        className="block py-3 hover:text-gray-300 xl:text-base lg:text-sm font-semibold transition-all duration-500"
                      >
                        Website Monitoring
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={resetDropdowns}
                        to="/contact-us"
                        className="block py-3 hover:text-gray-300 xl:text-base lg:text-sm font-semibold transition-all duration-500"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="relative">
                <button
                  onClick={toggleMenu1}
                  className="dropdown-toggle flex items-center justify-between text-center xl:text-base lg:text-sm font-medium hover:text-gray-300 transition-all duration-500 lg:mr-6 lg:mb-0 mr-auto lg:text-left lg:m-0"
                >
                  Fine Metrics
                  <svg
                    className={`ml-2 h-4 w-4 ${isDarkMode ? "text-white" : "text-black"
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {/* <IoMdArrowDropdown className="w-3 h-2 ml-1.5" /> */}
                </button>
                {/* Dropdown menu */}
                <div
                  id="menu1"
                  aria-labelledby="menu1"
                  className={`animate-fade z-10 relative top-3 max-lg:mb-3 lg:absolute lg:top-14 lg:-left-80 rounded-lg  max-lg:shadow-inner xl:p-8 lg:p-4 p-2 lg:min-w-[800px] md:min-w-[500px] min-w-full ${isMenu1Open ? "block" : "hidden"
                    } ${isDarkMode ? "bg-[#1f1f1f]" : "bg-[#f9f9f9]"}`}
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <ul
                      className="text-sm md:w-1/2"
                      aria-labelledby="dropdownLargeButton"
                    >
                      <li>
                        <Link
                          to="quickstats"
                          onClick={resetDropdowns}
                          className="px-3 py-5 transition-all duration-500 hover:bg-[#287150] hover:rounded-xl flex items-center"
                        >
                          <div className="bg-orange-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiBarChart2 className="w-6 h-6 text-orange-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              Quick Stats
                            </h5>
                            <p className="text-xs font-medium">
                              Instantly view your website’s uptime, response
                              time, and overall performance metrics
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="ssl"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150] hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-emerald-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiLock className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              SSL
                            </h5>
                            <p className="text-xs font-medium">
                              Check SSL certificate status and expiration to
                              ensure secure user connections
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="ping"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150] hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-blue-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiWifi className="w-6 h-6 text-blue-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              Ping
                            </h5>
                            <p className="text-xs font-medium">
                              Monitor server response times and evaluate network
                              latency from various locations
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="http"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150] hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-blue-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiServer className="w-6 h-6 text-blue-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              HTTP
                            </h5>
                            <p className="text-xs font-medium">
                              Test your website’s HTTP status for smooth
                              operation and identify performance issues
                            </p>
                          </div>
                        </Link>
                      </li>
                    </ul>
                    <ul
                      className="text-sm md:w-1/2"
                      aria-labelledby="dropdownLargeButton"
                    >
                      <li>
                        <Link
                          to="whois"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150] hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-rose-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiUserCheck className="w-6 h-6 text-rose-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              WHOIS
                            </h5>
                            <p className="text-xs font-medium">
                              Retrieve domain ownership and registration details
                              to stay informed about changes
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="traceroute"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150]hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-indigo-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiMap className="w-6 h-6 text-indigo-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              Traceroute
                            </h5>
                            <p className="text-xs font-medium">
                              Trace your data’s path through the internet to
                              identify slowdowns and issues
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="nslookup"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150] hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-cyan-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiGlobe className="w-6 h-6 text-cyan-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              NS Lookup
                            </h5>
                            <p className="text-xs font-medium">
                              Find authoritative name servers for any domain to
                              ensure correct DNS resolution
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="dnslookup"
                          onClick={resetDropdowns}
                          className="px-3 py-5 hover:bg-[#287150] hover:rounded-xl flex items-center transition-all duration-500"
                        >
                          <div className="bg-cyan-50 rounded-lg w-12 h-12 flex items-center justify-center">
                            <FiCode className="w-6 h-6 text-cyan-500" />
                          </div>
                          <div className="ml-4 w-4/5">
                            <h5 className="xl:text-base lg:text-sm mb-1.5 font-semibold">
                              DNS Lookup
                            </h5>
                            <p className="text-xs font-medium">
                              Access and verify DNS records like A, MX, and
                              TXT for accuracy
                            </p>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <li>
                <a
                  href={import.meta.env.VITE_SPEED_TEST_URL}
                  target="_blank"
                  className="nav-link block lg:mr-6 md:mb-0 lg:text-left xl:text-base lg:text-sm font-medium transition-all duration-500 hover:text-gray-300"
                >
                  Speed Test
                </a>

              </li>
            </ul>
            <div className="flex lg:items-center w-full justify-start flex-col lg:flex-row gap-4 lg:w-max max-lg:gap-4 lg:ml-14 lg:justify-end">
              <button className="bg-gray-700 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-gray-600">
              <a
                href={import.meta.env.VITE_DASHBOARD_URL_LOGIN}
                  target="_blank"
                >
                  Login
                </a> 
              </button>
              <button className="bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-[#205c44]">
              <a
                  href={import.meta.env.VITE_DASHBOARD_URL_REGISTER}
                  target="_blank"
                >
                 Register
                </a> 
              </button>
              <button
                onClick={toggleDarkMode}
                className="cursor-pointer font-semibold text-center transition-all duration-500 py-3 px-6 text-sm flex items-center hidden lg:block"
              >
                {isDarkMode ? (
                  <FiSun className="w-6 h-6" />
                ) : (
                  <FiMoon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
