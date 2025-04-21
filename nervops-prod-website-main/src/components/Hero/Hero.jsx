import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dashimage from "../../assets/img/dashboard1.png";
const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <motion.div
      className={`w-full md:pt-2 lg:pt-16 xl:pt-20 flex items-center justify-center transition-colors duration-300 ${isDarkMode ? "bg-[#121212]" : "bg-[#ffffff]"
        } border-b border-gray-200 dark:border-gray-700`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-full px-4 pt-8 text-center">
        <motion.div
          className="border p-1 w-full sm:w-80 mx-auto rounded-full flex items-center justify-between mb-4"
          style={{
            color: isDarkMode ? "#35976b" : "#287150",
            fontFamily: "Slabo 27px, serif",
            fontWeight: 700,
          }}
          variants={itemVariants}
        >
          <span className="font-inter text-sm pl-4 font-large text-gray-900 ml-3 dark:text-white">
              Monitor your Azure and website’s.
          </span>
          <a
            href="#"
            className="w-8 h-8 rounded-full flex justify-center items-center"
            style={{
              backgroundColor: isDarkMode ? "#2e865f" : "#35976b",
            }}
          >
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.83398 8.00019L12.9081 8.00019M9.75991 11.778L13.0925 8.44541C13.3023 8.23553 13.4073 8.13059 13.4073 8.00019C13.4073 7.86979 13.3023 7.76485 13.0925 7.55497L9.75991 4.22241"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
        <motion.h1
          className="max-w-2xl mx-auto font-manrope font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-5 md:text-5xl leading-tight"
          variants={itemVariants}
        >
  Optimize and secure your cloud with our
          <span
            className="mt-4 ml-1.5"
            style={{
              color: isDarkMode ? "#35976b" : "#287150",
              fontFamily: "Slabo 27px, serif",
              fontWeight: 700,
            }}
          >
    CPSM
    </span>
        </motion.h1>
        <motion.p
          className="max-w-xl mx-auto text-base font-medium leading-7 text-gray-500 dark:text-gray-300 mb-9"
          variants={itemVariants}
        >
           Gain complete visibility into your Azure cloud services and configurations. 
  Enhance security posture by monitoring vulnerabilities and ensuring compliance. 
  Empower your DevOps processes with seamless integration and high availability.
        </motion.p>
        <motion.div className="flex justify-center" variants={itemVariants}>
          <img
            src={dashimage}
            alt="Uptime Monitor Dashboard"
            className="rounded-t-3xl h-auto object-cover w-[80%] mx-auto"
          />

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
