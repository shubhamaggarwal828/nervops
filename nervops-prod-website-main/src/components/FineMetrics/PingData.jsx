import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FaNetworkWired, FaExclamationTriangle, FaStopwatch } from "react-icons/fa";
import hero_img_light from "../images/quick-stats.svg";
import hero_img_dark from "../images/quick-stats-dark.svg";
import axios from 'axios';
import validator from 'validator';

const PingData = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  const validateURL = (url) => {
    // Check if the URL is valid
    if (!validator.isURL(url, { require_protocol: false })) {
      return null; // Reject if the URL is not valid
    }

    // If the URL is missing the protocol, add "https://"
    if (!validator.isURL(url, { require_protocol: true })) {
      url = `https://${url}`;
    }

    return url; // Return the validated and formatted URL
  };
  const renderTableRows = (data, isDarkMode, tableType) => {
    let headers = {};
    let rows = [];

    // Define headers and rows based on the table type
    switch (tableType) {
      case 'metrics':
        headers = {
          address: "IP Address",
          responseTime: "Response Time",
          ttl: "TTL",
          bytes: "Bytes",
        };
        rows = data.metrics || [];
        break;
      case 'packetSummary':
        headers = {
          sent: "Packets Sent",
          received: "Packets Received",
          loss: "Packet Loss",
          time: "Round-Trip Time",
        };
        rows = [data.packetSummary || {}];
        break;
      case 'latencySummary':
        headers = {
          min: "Minimum Latency",
          max: "Maximum Latency",
          avg: "Average Latency",
          stdDev: "Standard Deviation",
        };
        rows = [data.latencySummary || {}];
        break;
      default:
        return null;
    }

    return (
      <React.Fragment>
        <thead
          className={`text-xs uppercase ${isDarkMode
            ? "bg-[#1F1F1F] dark:bg-[#1F1F1F] dark:text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          <motion.tr
            className={`border-b ${isDarkMode
              ? 'border-white dark:border-gray-700 '
              : 'border-gray-300 '
              }`}
            variants={rowVariants}
          >
            {Object.values(headers).map((header, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"
                  } whitespace-nowrap xl:min-w-[300px]`}
              >
                {header}
              </th>
            ))}
          </motion.tr>
        </thead>


        {rows.map((row, rowIndex) => (
          <motion.tr
            key={rowIndex}
            className={`border-b ${isDarkMode
              ? 'border-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-custom-green-900'
              : 'border-gray-300 '
              }`}
            variants={rowVariants}
          >
            {Object.keys(headers).map((key, cellIndex) => (
              <td
                key={cellIndex}
                className={`px-6 py-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {row[key] !== undefined ? row[key] : 'N/A'}
              </td>
            ))}
          </motion.tr>
        ))}
      </React.Fragment>
    );
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (url.trim() === "") {
      setError(true);
      setErrorMessage("URL cannot be empty. Please enter a valid URL.");
      setShowTable(false);
    } else if (!validateURL(url)) {
      setError(true);
      setErrorMessage("Invalid URL format. Please enter a valid URL.");
      setShowTable(false);
    } else {
      setError(false);
      setIsLoading(true);
      try {
        const apiUri = import.meta.env.VITE_PING_DATA_STATS_API_ENDPOINT;
        const validatedUrl = validateURL(url); // Validate and format the URL
        const response = await axios.post(`${apiUri}`, { url: validatedUrl }); // Use the validated URL
        setData(response.data);
        setShowTable(true);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error); // Set the error message from backend
          // setErrorMessage(response.data.error); // Set the error message from backend
          setError(true);
          setShowTable(false);
        }
        else {
          setErrorMessage("Error Fetching Data");
          setError(true);
        }
      } finally {
        setIsLoading(false);
      }

    }
  };


  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const tableVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <section
        className={`min-h-[calc(100vh-15rem)] flex flex-col items-center justify-center px-4 lg:px-8 ${isDarkMode ? "bg-[#121212]" : "bg-[#ffffff]"
          }`}
      >
        <div className="relative grid py-8 mx-auto max-w-[1400px] lg:gap-8 xl:gap-0 lg:grid-cols-12 items-center">
          <motion.div
            className="place-self-center text-left lg:col-span-7"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.a
              href="#"
              className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              role="alert"
              variants={itemVariants}
            >
              <span
                className="text-xs rounded-full text-white px-4 py-1.5 mr-3"
                style={{ backgroundColor: isDarkMode ? "#287150" : "#35976b" }}
              >
                <FontAwesomeIcon icon={faChartLine} />
              </span>
              <span className="text-xs font-medium uppercase">Ping</span>
            </motion.a>
            <motion.h1
              className="mb-4 max-w-2xl text-3xl font-bold leading-none md:text-3xl xl:text-5xl dark:text-white"
              style={{ fontFamily: "Slabo 27px, serif", fontWeight: 500 }}
              variants={itemVariants}
            >
              Lightning-Fast Pings
              <br />
              <span
                className="mt-4 block"
                style={{
                  color: isDarkMode ? "#35976b" : "#287150",
                  fontFamily: "Slabo 27px, serif",
                  fontWeight: 500,
                }}
              >
                Flawless Connectivity
              </span>
            </motion.h1>
            <motion.p
              className="mb-8 max-w-2xl font-light text-black lg:mb-8 md:text-lg lg:text-xl dark:text-white"
              variants={itemVariants}
            >
              Ping Power, Performance Everywhere Your go-to tool for seamless, reliable connections.
            </motion.p>
            <motion.div
              className="flex flex-col items-start justify-start lg:col-span-7 w-full"
              variants={itemVariants}
            >
              <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                  <input
                    type="search"
                    id="default-search"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`block w-full p-4 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${error
                      ? "border-red-500"
                      : isDarkMode
                        ? "bg-[#121212] dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        : "bg-gray-50 border-gray-700"
                      }`}
                    placeholder="Enter your domain name"
                  />
                  <button
                    type="submit"
                    className="text-white absolute right-2.5 bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 focus:ring-4 focus:outline-none"
                    style={{
                      backgroundColor: isDarkMode ? "#287150" : "#35976b",
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 text-current mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                          />
                        </svg>
                        Loading...
                      </div>
                    ) : (
                      "Start Testing"
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
          <motion.div
            className="lg:mt-0 lg:col-span-5 flex justify-center lg:justify-end relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-full max-w-lg md:max-w-2xl lg:max-w-[600px] lg:max-h-full">
              <img
                src={isDarkMode ? hero_img_dark : hero_img_light}
                alt="mockup"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
        {/* Conditionally render the table section */}
        {data && (

          <motion.div
            className="relative overflow-x-auto shadow-md sm:rounded-lg my-8 max-w-[1280px] mx-auto w-full"
            initial="hidden"
            animate="visible"
            variants={tableVariants}
          >
            <div className="bg-white dark:bg-[#121212] rounded-lg">
              <motion.a
                href="#"
                className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                role="alert"
                variants={itemVariants}
              >
                <span
                  className="text-xs rounded-full text-white px-4 py-1.5 mr-3"
                  style={{
                    backgroundColor: isDarkMode ? "#287150" : "#35976b",
                  }}
                >
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                <span className="text-m font-medium uppercase">
                  PING METRICS
                </span>
              </motion.a>
              <table
                className={`w-full text-sm text-left rtl:text-right text-gray-500 rounded-lg`}
              >


                {renderTableRows(data, isDarkMode, 'metrics')}

              </table>

            </div>
          </motion.div>

        )}

        {data && (

          <motion.div
            className="relative overflow-x-auto shadow-md sm:rounded-lg my-8 max-w-[1280px] mx-auto w-full"
            initial="hidden"
            animate="visible"
            variants={tableVariants}
          >
            <div className="bg-white dark:bg-[#121212] rounded-lg">
              <motion.a
                href="#"
                className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                role="alert"
                variants={itemVariants}
              >
                <span
                  className="text-xs rounded-full text-white px-4 py-1.5 mr-3"
                  style={{
                    backgroundColor: isDarkMode ? "#287150" : "#35976b",
                  }}
                >
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                <span className="text-m font-medium uppercase">
                  PACKET SUMMARY
                </span>
              </motion.a>
              <table
                className={`w-full text-sm text-left rtl:text-right text-gray-500 rounded-lg`}
              >


                {renderTableRows(data, isDarkMode, 'packetSummary')}
              </table>

            </div>
          </motion.div>

        )}

        {data && (

          <motion.div
            className="relative overflow-x-auto shadow-md sm:rounded-lg my-8 max-w-[1280px] mx-auto w-full"
            initial="hidden"
            animate="visible"
            variants={tableVariants}
          >
            <div className="bg-white dark:bg-[#121212] rounded-lg">
              <motion.a
                href="#"
                className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-[#1F1F1F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                role="alert"
                variants={itemVariants}
              >
                <span
                  className="text-xs rounded-full text-white px-4 py-1.5 mr-3"
                  style={{
                    backgroundColor: isDarkMode ? "#287150" : "#35976b",
                  }}
                >
                  <FontAwesomeIcon icon={faChartLine} />
                </span>
                <span className="text-m font-medium uppercase">
                  LATENCY SUMMARY
                </span>
              </motion.a>
              <table
                className={`w-full text-sm text-left rtl:text-right text-gray-500 rounded-lg`}
              >


                {renderTableRows(data, isDarkMode, 'latencySummary')}
              </table>

            </div>
          </motion.div>

        )}
        {/* Features Description */}
        <div
          className={`max-w-[1280px] py-8 lg:py-12 ${isDarkMode ? "bg-[#121212]" : "bg-[#ffffff]"
            }`}
        >
          <motion.div
            className="flex flex-col lg:flex-row flex-wrap justify-between items-start gap-6 px-4 lg:px-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Ping Statistics */}
            <motion.div
              className="text-left space-y-2 flex-1 min-w-[200px]"
              variants={itemVariants}
            >
              <div
                className={`flex justify-start text-4xl ${isDarkMode ? "text-gray-500" : "text-gray-700"}`}
              >
                <FaNetworkWired /> {/* Example Icon */}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Network Latency
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Measure the time it takes for data to travel from your device to a server.
              </p>
            </motion.div>

            {/* Packet Loss */}
            <motion.div
              className="text-left space-y-2 flex-1 min-w-[200px]"
              variants={itemVariants}
            >
              <div
                className={`flex justify-start text-4xl ${isDarkMode ? "text-gray-500" : "text-gray-700"}`}
              >
                <FaExclamationTriangle /> {/* Example Icon */}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Packet Loss
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Monitor the percentage of packets lost during transmission.
              </p>
            </motion.div>

            {/* Response Time */}
            <motion.div
              className="text-left space-y-2 flex-1 min-w-[200px]"
              variants={itemVariants}
            >
              <div
                className={`flex justify-start text-4xl ${isDarkMode ? "text-gray-500" : "text-gray-700"}`}
              >
                <FaStopwatch /> {/* Example Icon */}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Response Time
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Track the total time taken for a server to respond to your requests.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PingData;
