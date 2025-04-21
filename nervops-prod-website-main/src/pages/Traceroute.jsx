import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaLock,
  FaBolt,
  FaServer,
  FaUserTag,
  FaBalanceScale,
  FaChartLine,
  FaNetworkWired,
  FaSearchLocation,
} from "react-icons/fa";
import QuickStatsData from "../components/FineMetrics/QuickStatsData";
import SSLData from "../components/FineMetrics/SSLData";
import PingData from "../components/FineMetrics/PingData";
import HttpData from "../components/FineMetrics/HttpData";
import WhoisData from "../components/FineMetrics/WhoisData";
import TraceRouteData from "../components/FineMetrics/TraceRouteData";
import NSLookupData from "../components/FineMetrics/NSLookupData";
import DNSLookupDataData from "../components/FineMetrics/DNSLookupData";

const SSL = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sslmonitoring");

  useEffect(() => {
    const path = location.pathname.substring(1); // Remove leading '/'
    switch (path) {
      case "quickstats":
        setActiveTab("quickstats");
        break;
      case "ping":
        setActiveTab("pingmonitoring");
        break;
      case "http":
        setActiveTab("httpmonitoring");
        break;
      case "whois":
        setActiveTab("whoismonitoring");
        break;
      case "traceroute":
        setActiveTab("traceroutemonitoring");
        break;
      case "nslookup":
        setActiveTab("nslookupmonitoring");
        break;
      case "dnslookup":
        setActiveTab("dnslookupmonitoring");
        break;
      default:
        setActiveTab("sslmonitoring");
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "quickstats":
        navigate("/quickstats");
        break;
      case "pingmonitoring":
        navigate("/ping");
        break;
      case "httpmonitoring":
        navigate("/http");
        break;
      case "whoismonitoring":
        navigate("/whois");
        break;
      case "traceroutemonitoring":
        navigate("/traceroute");
        break;
      case "nslookupmonitoring":
        navigate("/nslookup");
        break;
      case "dnslookupmonitoring":
        navigate("/dnslookup");
        break;
      default:
        navigate("/ssl");
    }
  };

  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen lg:pt-20">
     

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul
          className="hidden lg:flex max-w-screen-xl flex-wrap items-center justify-center mx-auto text-sm font-medium"
          role="tablist"
        >
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "quickstats"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("quickstats")}
              role="tab"
            >
              <FaChartLine
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              Quick Stats
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "sslmonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("sslmonitoring")}
              role="tab"
            >
              <FaLock
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              SSL
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "pingmonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("pingmonitoring")}
              role="tab"
            >
              <FaBolt
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              Ping
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "httpmonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("httpmonitoring")}
              role="tab"
            >
              <FaServer
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              HTTP
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "whoismonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("whoismonitoring")}
              role="tab"
            >
              <FaUserTag
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              WhoIs
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "traceroutemonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("traceroutemonitoring")}
              role="tab"
            >
              <FaBalanceScale
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              Traceroute
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "nslookupmonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("nslookupmonitoring")}
              role="tab"
            >
              <FaNetworkWired
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              NS Lookup
            </button>
          </li>
          <li className="w-1/8 mx-auto" role="presentation">
            <button
              className={`inline-block p-4 w-full border-b-2 rounded-t-lg flex items-center justify-center ${
                activeTab === "dnslookupmonitoring"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "text-gray-700 border-gray-100 hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:border-transparent dark:hover:text-gray-300"
              }`}
              onClick={() => handleTabClick("dnslookupmonitoring")}
              role="tab"
            >
              <FaSearchLocation
                className="mr-2 text-gray-700 dark:text-gray-400"
                size={20}
              />
              DNS Lookup
            </button>
          </li>
        </ul>
      </div>

      <div id="default-styled-tab-content">
        {activeTab === "quickstats" && (
          <div className="w-full">
            <QuickStatsData />
          </div>
        )}
        {activeTab === "sslmonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <SSLData />
          </div>
        )}
        {activeTab === "pingmonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <PingData />
          </div>
        )}
        {activeTab === "httpmonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <HttpData />
          </div>
        )}
        {activeTab === "whoismonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <WhoisData />
          </div>
        )}
        {activeTab === "traceroutemonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <TraceRouteData />
          </div>
        )}
        {activeTab === "nslookupmonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <NSLookupData/>
          </div>
        )}
        {activeTab === "dnslookupmonitoring" && (
          <div className="p-4 rounded-lg bg-white dark:bg-[#121212]">
            <DNSLookupDataData/>
          </div>
        )}
      </div>
    </div>
  );
};

export default SSL;
