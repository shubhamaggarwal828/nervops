import React, { useState } from "react";
import {
  FaStar,
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaQuestionCircle,
  FaPhone,
  FaTag,
} from "react-icons/fa";
import FaqSection from "../components/FaqSection/FaqSection";
import GetStarted from "../components/GetStarted/GetStarted";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="bg-white dark:bg-[#121212] text-black dark:text-white min-h-screen border-b border-gray-200 dark:border-gray-700">
        <section className="w-full xl:py-24 lg:py-20 py-12 bg-slate-50 dark:bg-[#121212] border-b border-gray-300 dark:border-gray-700">
          <div className="w-full max-w-7xl px-6 lg:px-8 mx-auto">
            <div className="w-full text-center mb-12">
              <motion.div
                className="border p-1 w-full sm:w-auto mx-auto rounded-full flex items-center justify-center mb-6"
                style={{
                  color: isDarkMode ? "#35976b" : "#287150",
                  fontFamily: "Slabo 27px, serif",
                  fontWeight: 700,
                  maxWidth: "fit-content",
                }}
              >
                <span className="font-inter text-sm font-large text-gray-900 ml-3 dark:text-white">
                  Contact Us
                </span>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full flex justify-center items-center ml-3"
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
                className="font-manrope text-[#287150] dark:text-[#35976b] md:text-5xl text-4xl font-bold leading-tight mb-8"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Contact Us
              </motion.h1>
              <motion.p
                className="text-gray-900 dark:text-white text-lg font-normal leading-7"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                We're here to assist you! Whether you have questions, feedback,
                or inquiries, our team is ready to help.
              </motion.p>
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-between gap-x-16 xl:gap-x-24 gap-y-14 max-w-lg md:max-w-3xl lg:max-w-full mx-auto">
              <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
              <div className="my-12 grid grid-cols-1 gap-y-8">
  <motion.div
    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] p-7 group transition-all duration-500 hover:bg-[#287150] dark:hover:bg-[#35976b]"
    whileHover={{ scale: 1.05 }}
  >
    <a
      href="mailto:support@uptimefury.com"
      className="w-14 h-14 bg-[#287150] dark:bg-[#35976b] rounded-full flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-white cursor-pointer"
    >
      <FaQuestionCircle
        className="fill-white transition-all duration-500 group-hover:fill-[#287150] dark:group-hover:fill-[#35976b]"
        size={30}
      />
    </a>
    <h5 className="text-gray-900 dark:text-white text-xl font-semibold leading-8 mb-3 transition-all duration-500 group-hover:text-white">
      Support
    </h5>
    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5 transition-all duration-500 group-hover:text-white">
      For assistance with our services, reach out to our support team via email. We’re here to help.
    </p>
  </motion.div>

  <motion.div
    className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] p-7 group transition-all duration-500 hover:bg-[#287150] dark:hover:bg-[#35976b]"
    whileHover={{ scale: 1.05 }}
  >
    <a
      href="mailto:info@uptimefury.com"
      className="w-14 h-14 bg-[#287150] dark:bg-[#35976b] rounded-full flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-white cursor-pointer"
    >
      <FaPaperPlane
        className="fill-white transition-all duration-500 group-hover:fill-[#287150] dark:group-hover:fill-[#35976b]"
        size={30}
      />
    </a>
    <h5 className="text-gray-900 dark:text-white text-xl font-semibold leading-8 mb-3 transition-all duration-500 group-hover:text-white">
      General Inquiries
    </h5>
    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-5 transition-all duration-500 group-hover:text-white">
      For any general questions, feel free to contact us via email. We’re happy to assist with any inquiries.
    </p>
  </motion.div>
</div>

              </div>
              <div className="lg:w-2/3">
                <motion.form
                  action=""
                  className="h-fit bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 w-full mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-x-8 mb-4">
                    <div className="relative mb-4 md:mb-0">
                      <label className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-base leading-6 font-medium">
                        Name{" "}
                      </label>
                      <div className="relative text-gray-500 dark:text-gray-400 focus-within:text-gray-900 dark:focus-within:text-white">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                        <input
                          type="text"
                          id="default-name"
                          className="w-full block h-12 pr-5 pl-5 py-2.5 text-lg leading-7 font-normal shadow-xs text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                          placeholder="Enter Your Name"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-base leading-6 font-medium">
                        Phone Number{" "}
                      </label>
                      <div className="relative text-gray-500 dark:text-gray-400 focus-within:text-gray-900 dark:focus-within:text-white">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                        <input
                          type="text"
                          id="default-phone"
                          className="w-full block h-12 pr-5 pl-5 py-2.5 text-lg leading-7 font-normal shadow-xs text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                          placeholder="Enter Your Phone Number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-base leading-6 font-medium">
                      Email{" "}
                    </label>
                    <div className="relative text-gray-500 dark:text-gray-400 focus-within:text-gray-900 dark:focus-within:text-white">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                      <input
                        type="text"
                        id="default-email"
                        className="w-full block h-12 pr-5 pl-5 py-2.5 text-lg leading-7 font-normal shadow-xs text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                        placeholder="Enter Your Email"
                      />
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-base leading-6 font-medium">
                      Subject{" "}
                    </label>
                    <div className="relative text-gray-500 dark:text-gray-400 focus-within:text-gray-900 dark:focus-within:text-white">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                      <input
                        type="text"
                        id="default-subject"
                        className="w-full block h-12 pr-5 pl-5 py-2.5 text-lg leading-7 font-normal shadow-xs text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                        placeholder="Enter Subject"
                      />
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="flex items-center mb-2 text-gray-600 dark:text-gray-400 text-base leading-6 font-medium">
                      Message{" "}
                    </label>
                    <div className="relative">
                      <textarea
                        className="block w-full h-40 px-4 py-2.5 text-lg leading-7 font-normal shadow-xs text-gray-900 dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
                        placeholder="Write your message"
                      ></textarea>
                    </div>
                  </div>
                  <motion.button
                    className="w-full h-12 rounded-full bg-[#287150] dark:bg-[#35976b] hover:bg-[#1e5a3e] dark:hover:bg-[#2a6b4a] transition-all duration-700 shadow-sm text-white text-base font-semibold leading-6 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    Send message{" "}
                    <FaPaperPlane className="ml-2 fill-white" size={20} />
                  </motion.button>
                </motion.form>
              </div>
            </div>
          </div>
        </section>

        <FaqSection />

        <GetStarted />
      </main>
    </div>
  );
};

export default ContactUs;
