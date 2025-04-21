import React from "react";
import { motion } from "framer-motion";
import { FaLayerGroup, FaCloud } from "react-icons/fa";
import dots from "../../assets/img/dots.svg";
import statusPage from "../../assets/img/status-page.jpeg";

const RightImageSection = () => {
  return (
    <section className="overflow-hidden bg-white dark:bg-[#121212] py-6 sm:py-16 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <motion.div
            className="lg:pr-8 lg:pt-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:max-w-lg">
              <motion.p
                className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center lg:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The Website Monitoring Service for{" "}
                <span className="text-[#287150] dark:text-[#35976b] text-center lg:text-left">
                  Reliable Status Pages
                </span>
              </motion.p>
              <motion.p
                className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Easily create public status pages to showcase your uptime, providing transparency to your users.
              </motion.p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaLayerGroup className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    Customizable Pages
                  </dt>
                  <dd className="inline ml-2">
                    Create and customize your own status pages to reflect your brand and communicate uptime effectively.
                  </dd>
                </motion.div>
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaCloud className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    Real-time Updates
                  </dt>
                  <dd className="inline ml-2">
                    Provide real-time updates on your service status to keep your users informed.
                  </dd>
                </motion.div>
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaLayerGroup className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    User-Friendly Interface
                  </dt>
                  <dd className="inline ml-2">
                    Our intuitive interface makes it easy for anyone to create and manage status pages.
                  </dd>
                </motion.div>
                <motion.div
                  className="flex space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  {/* Uncomment if you want to add a button */}
                  {/* <button className="bg-[#35976b] hover:bg-[#2e865f] text-white font-semibold py-2 px-4 rounded dark:bg-[#287150] dark:hover:bg-[#205c44]">
                    Create account
                  </button> */}
                </motion.div>
              </dl>
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <img
              src={dots}
              alt="Dots background"
              className="absolute top-[-250] right-[-250px] w-200 h-200 transform translate-x-1/4 -translate-y-1/4 z-0"
            />
            <img
              src={dots}
              alt="Dots background"
              className="absolute bottom-[-250] left-0 w-200 h-200 transform -translate-x-1/4 translate-y-1/4 z-0"
            /> */}
            <motion.img
              src={statusPage}
              alt="Status Page" 
              className="relative z-10 w-full max-w-3xl rounded-xl sm:w-[57rem] h-full"
              width="2432"
              height="1442"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RightImageSection;
