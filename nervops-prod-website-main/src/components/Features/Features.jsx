import React, { useEffect } from "react";
import {
  FaProjectDiagram,
  FaAppStore,
  FaChartLine,
  FaCogs, 
  FaLock,
  FaRocket,
  FaEye,
  FaInfoCircle,
  FaRoute,
  FaGlobe,
  FaServer,
  FaSignal,
} from "react-icons/fa";
import { SiAiohttp } from "react-icons/si";

import {
  MdIntegrationInstructions,
  MdDataUsage,
  MdBuild,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Features = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const upperContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const lowerContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2, // Delay to ensure upper section is shown first
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-24 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="py-1 px-4 bg-[#287150] rounded-full text-xs font-medium text-white text-center">
            Features
          </span>
          <h2 className="text-4xl text-center font-bold text-gray-900 dark:text-white py-5">
            Revolutionary Features
          </h2>
          <p className="text-lg font-normal text-gray-500 dark:text-gray-400 max-w-md md:max-w-2xl mx-auto">
          Explore powerful tools designed to enhance your website monitoring experience.

          </p>
        </div>

        {/* Upper Section */}
        <motion.div
          className="flex justify-center items-center gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8"
          variants={upperContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative w-full text-center max-md:max-w-sm max-md:mx-auto group md:w-1/4 lg:w-1/4"
            onClick={() => navigate("/ssl")}
            variants={itemVariants}
          >
            <div className="bg-green-50 dark:bg-green-600 rounded-lg flex justify-center items-center mb-5 w-20 h-20 mx-auto transition-all duration-500 group-hover:bg-green-600 dark:group-hover:bg-green-800">
              <FaLock
                className="text-green-600 dark:text-white transition-all duration-500 group-hover:text-white"
                size={30}
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              SSL Check
            </h4>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Verify your SSL certificate status and expiration. Ensure your website's security is up-to-date.
            </p>
          </motion.div>
          <motion.div
            className="relative w-full text-center max-md:max-w-sm max-md:mx-auto group md:w-2/4 lg:w-1/4"
            onClick={() => navigate("/http")}
            variants={itemVariants}
          >
            <div className="bg-orange-50 dark:bg-orange-600 rounded-lg flex justify-center items-center mb-5 w-20 h-20 mx-auto transition-all duration-500 group-hover:bg-orange-600 dark:group-hover:bg-orange-800">
              <FaServer
                className="text-orange-600 dark:text-white transition-all duration-500 group-hover:text-white"
                size={30}
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              HTTP Test
            </h4>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Test your website's HTTP response and ensure it’s functioning smoothly.
            </p>
          </motion.div>
          <motion.div
            className="relative w-full text-center max-md:max-w-sm max-md:mx-auto group md:w-2/5 lg:w-1/4"
            onClick={() => navigate("/whois")}
            variants={itemVariants}
          >
            <div className="bg-purple-50 dark:bg-purple-600 rounded-lg flex justify-center items-center mb-5 w-20 h-20 mx-auto transition-all duration-500 group-hover:bg-purple-600 dark:group-hover:bg-purple-800">
              <FaInfoCircle
                className="text-purple-600 dark:text-white transition-all duration-500 group-hover:text-white"
                size={30}
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              WHOIS Lookup
            </h4>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Lookup domain ownership details and registration info. Stay informed about domain changes.
            </p>
          </motion.div>
        
        </motion.div>

        {/* Lower Section */}
        <motion.div
          className="flex justify-center items-center gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8 mt-10"
          variants={lowerContainerVariants}
          initial="hidden"
          animate="visible"
        >
         
          <motion.div
            className="relative w-full text-center max-md:max-w-sm max-md:mx-auto group md:w-2/5 lg:w-1/4"
            onClick={() => navigate("/traceroute")}
            variants={itemVariants}
          >
            <div className="bg-teal-50 dark:bg-teal-600 rounded-lg flex justify-center items-center mb-5 w-20 h-20 mx-auto transition-all duration-500 group-hover:bg-teal-600 dark:group-hover:bg-teal-800">
              <FaRoute
                className="text-teal-600 dark:text-white transition-all duration-500 group-hover:text-white"
                size={30}
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              Traceroute
            </h4>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Track the path your data takes across the internet. Visualize network paths to identify slowdowns.
            </p>
          </motion.div>

          <motion.div
            className="relative w-full text-center max-md:max-w-sm max-md:mx-auto group md:w-2/5 lg:w-1/4"
            onClick={() => navigate("/nslookup")}
            variants={itemVariants}
          >
            <div className="bg-red-50 dark:bg-red-600 rounded-lg flex justify-center items-center mb-5 w-20 h-20 mx-auto transition-all duration-500 group-hover:bg-red-600 dark:group-hover:bg-red-800">
              <FaGlobe
                className="text-red-600 dark:text-white transition-all duration-500 group-hover:text-white"
                size={30}
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              NS Lookup
            </h4>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Find the authoritative name servers for any domain. Get detailed DNS resolution information.
            </p>
          </motion.div>
          <motion.div
            className="relative w-full text-center max-md:max-w-sm max-md:mx-auto group md:w-2/5 lg:w-1/4"
            onClick={() => navigate("/dnslookup")}
            variants={itemVariants}
          >
            <div className="bg-yellow-50 dark:bg-yellow-600 rounded-lg flex justify-center items-center mb-5 w-20 h-20 mx-auto transition-all duration-500 group-hover:bg-yellow-600 dark:group-hover:bg-yellow-800">
              <SiAiohttp
                className="text-yellow-600 dark:text-white transition-all duration-500 group-hover:text-white"
                size={30}
              />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
              DNS Lookup
            </h4>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Retrieve DNS records such as A, MX, TXT, and more. Ensure your domain's DNS settings are configured.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
