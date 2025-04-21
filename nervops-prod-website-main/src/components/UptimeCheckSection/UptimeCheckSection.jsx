import React from "react";
import websiteMonitoringImg from "../../assets/img/Advanced_feature_section.svg";

const UptimeCheckSection = () => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121212]">
      <section className="mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8">
        <div className=" mt-12 space-y-4 flex-1 text-center lg:text-left">
          <h1 className="text-black dark:text-white font-bold mb-4 text-3xl sm:text-4xl">
          Sleep Easy with Reliable 
          <span className="text-[#287150] dark:text-[#35976b]">
              {" "}
              1-Minute Checks
            </span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed mx-auto lg:ml-0">
          Your website will be checked every minute, ensuring you receive instant notifications if anything goes wrong.

          </p>
          <div className="pt-4 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
            <button
              className="w-full md:w-auto inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full"
              style={{
                backgroundColor: "#35976b", // Dark green
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#287150")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#35976b")}
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
        </div>
        <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
          <img
            src={websiteMonitoringImg}
            className="w-full mx-auto sm:w-10/12 lg:w-full"
          />
        </div>
      </section>
    </div>
  );
};

export default UptimeCheckSection;
