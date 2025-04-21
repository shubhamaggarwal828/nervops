import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaChartLine, FaClock, FaLayerGroup } from "react-icons/fa";
import advancedFeatureImage from '../../assets/img/Advanced_feature_section.svg';

const AdvFeatures = () => {
  return (
    <section className="overflow-hidden bg-white dark:bg-[#121212] py-8 sm:py-16 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <motion.div
            className="lg:pr-8 lg:pt-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-[#287150] dark:text-[#35976b] text-center lg:text-left">
                Robust Monitoring Solutions
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl text-center lg:text-left">
                Advanced Features
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Our uptime monitor offers powerful features to ensure your website's reliability and performance.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaClock className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    Multi-Interval Monitoring
                  </dt>
                  <dd className="inline">
                    {" "}
                    Configure monitoring at various intervals for timely detection of outages.
                  </dd>
                </motion.div>
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaShieldAlt className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    SSL Certificate Monitoring
                  </dt>
                  <dd className="inline">
                    {" "}
                    Automatically track the status and expiration of your SSL certificates.
                  </dd>
                </motion.div>
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaChartLine className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    Detailed Performance Metrics
                  </dt>
                  <dd className="inline">
                    {" "}
                    Get insights into response times, uptime percentages, and server health.
                  </dd>
                </motion.div>
                <motion.div
                  className="relative pl-9"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <dt className="inline font-semibold text-gray-900 dark:text-white">
                    <FaLayerGroup className="absolute left-1 top-1 h-5 w-5 text-[#287150] dark:text-[#35976b]" />
                    Custom Notification Channels
                  </dt>
                  <dd className="inline">
                    {" "}
                    Receive alerts via email, SMS, Slack, and Discord to stay updated.
                  </dd>
                </motion.div>
              </dl>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src={advancedFeatureImage}
              alt="Advanced Features"
              className="w-full max-w-2xl ring-1 ring-gray-400/10 dark:ring-gray-600/10 dark:shadow-gray-500/50 sm:w-[80rem] h-full"
              width="3500"
              height="2500"
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

export default AdvFeatures;
