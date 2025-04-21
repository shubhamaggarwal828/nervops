import React from "react";
import websiteMonitoringImg from "../assets/img/website-monitoring-hero.png";
import Uptime_Monitoring_Info from "../components/Uptime_Monitoring_Info/Uptime_Monitoring_Info";
import GetNotified from "../components/GetNotified/GetNotified";
import RightImageSection from "../components/RightImageSection/RightImageSection";
import VideoSection from "../components/VideoSection/VideoSection";
import UptimeCheckSection from "../components/UptimeCheckSection/UptimeCheckSection";
import GetStarted from "../components/GetStarted/GetStarted";

const WebsiteMonitoring = () => {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center py-12 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700">
        {/* Main Container */}
        <div className="max-w-8xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 px-8">
          {/* Left Side: Image Only */}
          <div className="relative">
            {/* Image */}
            <img
              src={websiteMonitoringImg}
              alt="Website Monitoring"
              className="w-full"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="flex flex-col justify-center space-y-6">
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
  Keep Your Website Online with{" "}
  <span className="text-[#287150] dark:text-[#35976b]">
    Reliable Uptime Monitoring
  </span>
</h1>
<p className="text-gray-600 dark:text-gray-300 text-lg">
  Welcome to Uptime Fury, your solution for seamless website monitoring. Say goodbye to unexpected downtime and hello to consistent, reliable performance.
</p>


            {/* CTA Buttons */}
            <div className="space-x-4">
              <button
                className="w-full md:w-auto inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full"
                style={{
                  backgroundColor: "#35976b", // Dark green
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#287150")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#35976b")
                }
              >
                Get Started
                <svg
                  className="ml-2"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Stats Section */}
            <div className="flex space-x-12 pt-8">
  <div className="flex flex-col items-start">
    <h3 className="text-2xl font-bold text-[#287150] dark:text-[#35976b]">
      Monitor Your Websites
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Ensure continuous availability with real-time uptime checks.
    </p>
  </div>
  <div className="flex flex-col items-start">
    <h3 className="text-2xl font-bold text-[#287150] dark:text-[#35976b]">
      Get Instant Alerts
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      Stay informed with timely notifications for any downtime.
    </p>
  </div>
</div>

          </div>
        </div>
      </div>

      <Uptime_Monitoring_Info />

      <UptimeCheckSection />

      <GetNotified />

      <RightImageSection />

      <VideoSection />

      <GetStarted />
    </div>
  );
};

export default WebsiteMonitoring;
