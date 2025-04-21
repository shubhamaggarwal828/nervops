import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaDribbble,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Make sure to import Link
import logo from "../../assets/img/logo.png";
import logoFooter from "../../assets/img/logo_footer1.png";


const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] dark:bg-[#121212]">
      <hr className="border-gray-300 dark:border-gray-700 w-full" />

      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center">
              <img
                src={logoFooter}
                className="mx-auto -ml-2 pl-8 h-20 sm:h-20 md:h-40 lg:h-60 transition-opacity duration-300 opacity-100"
                alt="Logo"
              />

            </Link>       
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Services
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    1on1 Coaching
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Company Review
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Accounts Review
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    HR Consulting
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    SEO Optimisation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Company
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/about-us"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Meet the Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Accounts Review
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Helpful Links
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Legal</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Accessibility
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Returns Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    Hiring Statistics
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-gray-300 dark:border-gray-700 w-full" />
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-4">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={logo}
              className="mr-3 h-8 sm:h-12" // Increased logo size
              alt="Logo"
            />
            <p className="text-md font-bold text-gray-900 dark:text-white">UPTIME FURY</p> {/* Added text */}
          </div>
          <p className="text-md text-gray-500 dark:text-gray-400 text-center flex-1 mb-4 md:mb-0">
            &copy; 2025 NervOps. All rights reserved.
          </p>
          <div className="flex space-x-4 text-md text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:underline">Terms</a>
            <span>|</span>
            <a href="#" className="hover:underline">Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
