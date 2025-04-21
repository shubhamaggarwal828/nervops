import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/img/logo.png"; // Adjust the logo path as needed

const GetStarted = ({ isDarkMode }) => {
  return (
    <section className="bg-white dark:bg-[#121212] text-black dark:text-white py-16 border-b border-gray-200 dark:border-gray-700">
      <motion.div
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28" // Adjust the logo size if needed
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Get Started Now
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Start your cloud monitoring in less than 30 sec.
        </motion.p>

        {/* Get Started Button */}
        <motion.button
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
        </motion.button>
      </motion.div>
    </section>
  );
};

export default GetStarted;
