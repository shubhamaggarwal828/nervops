import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import FAQs from "../../assets/img/faqs.svg";

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4 ">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={toggle}
      >
        <h3
          className={`text-lg font-medium ${
            isOpen
              ? "text-[#287150] dark:text-[#35976b]"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {question}
        </h3>
        {isOpen ? (
          <FaMinus className="text-gray-900 dark:text-[#287150]" />
        ) : (
          <FaPlus className="text-gray-900 dark:text-white" />
        )}
      </button>
      {isOpen && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {answer}
        </p>
      )}
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the platform monitor my cloud services?",
      answer:
        "Our platform integrates with your cloud provider to track active services, configurations, and usage in real-time.",
    },
    {
      question: "What kind of security checks are performed?",
      answer:
        "The platform continuously scans for vulnerabilities, open ports, and misconfigurations to enhance your cloud security.",
    },
    {
      question: "Can I generate compliance reports?",
      answer:
        "Yes, you can generate detailed security and compliance audit reports directly from the dashboard.",
    },
    {
      question: "How do I optimize cloud resource usage?",
      answer:
        "The platform provides insights into resource utilization and cost-saving opportunities to help you optimize your cloud setup.",
    },
    {
      question: "Is multi-cloud monitoring supported?",
      answer:
        "Not as of now, but we are working on adding support for monitoring across more cloud providers in the near future.",
    },
    
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex items-center justify-center overflow-hidden bg-white dark:bg-[#121212] py-12 sm:py-16 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section: Image */}
          <div className="hidden lg:block flex items-start justify-center lg:justify-start">
            <img
              src={FAQs}
              alt="FAQ Section"
              className="w-[600px] h-[450px] object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Right Section: FAQs */}
          <div className="text-center lg:text-left">
            {/* Subtitle */}
            <h2 className="text-base font-semibold leading-7 text-[#287150] dark:text-[#35976b]">
              Common Questions
            </h2>

            {/* Title */}
            <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
              FAQs
            </h2>

            {/* Description */}
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Explore answers to frequently asked questions about our Cloud Management Platform.
            </p>

            {/* FAQ Items */}
            <div className="mt-6 space-y-6">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  toggle={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
