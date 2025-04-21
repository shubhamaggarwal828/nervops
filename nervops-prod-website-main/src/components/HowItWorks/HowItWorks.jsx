import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-24 relative bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-10 inline-flex">
          <div className="w-full flex-col justify-start items-center gap-3 flex">
            <h2 className="w-full text-center text-gray-900 dark:text-white text-4xl font-bold font-manrope leading-normal">
              How It Works
            </h2>
            <p className="w-full text-center text-gray-500 dark:text-gray-300 text-base font-normal leading-relaxed">
              Understand how our Cloud Management Platform enhances your cloud infrastructure and security.
            </p>
          </div>

          {/* Row 1 */}
          <div className="w-full flex justify-center items-center gap-6">
            {[...Array(3)].map((_, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-col justify-start items-center gap-2.5 inline-flex max-w-[30%] text-center">
                  <div className="flex-col justify-start items-center gap-0.5 flex">
                    <h3 className="text-[#287150] dark:text-[#35976b] text-4xl font-extrabold font-manrope">
                      {idx + 1}
                    </h3>
                    <h4 className="text-gray-900 dark:text-white text-xl font-semibold">
                      {["Connect Cloud Account", "Analyze Cloud Posture", "Enable Security Monitoring"][idx]}
                    </h4>
                  </div>
                  <p className="text-gray-400 dark:text-gray-300 text-base font-normal">
                    {[
                      "Integrate your cloud provider to fetch active services and configurations.",
                      "View detailed insights into active services, metadata, and resource utilization.",
                      "Activate continuous monitoring for vulnerabilities, open ports, and misconfigurations.",
                    ][idx]}
                  </p>
                </div>
                {idx < 2 && (
                  <svg
                    className="hidden md:block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004"
                      stroke="#287150"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Row 2 */}
          <div className="w-full flex justify-center items-center gap-6 mt-8">
            {[...Array(3)].map((_, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-col justify-start items-center gap-2.5 inline-flex max-w-[30%] text-center">
                  <div className="flex-col justify-start items-center gap-0.5 flex">
                    <h3 className="text-[#287150] dark:text-[#35976b] text-4xl font-extrabold font-manrope">
                      {idx + 4}
                    </h3>
                    <h4 className="text-gray-900 dark:text-white text-xl font-semibold">
                      {["Generate Security Audits", "Optimize Resources", "Receive Actionable Alerts"][idx]}
                    </h4>
                  </div>
                  <p className="text-gray-400 dark:text-gray-300 text-base font-normal">
                    {[
                      "Access comprehensive security audit reports with compliance tracking.",
                      "Identify cost-saving opportunities and optimize your cloud resources effectively.",
                      "Get instant notifications about potential risks to act quickly and ensure safety.",
                    ][idx]}
                  </p>
                </div>
                {idx < 2 && (
                  <svg
                    className="hidden md:block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004"
                      stroke="#287150"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
