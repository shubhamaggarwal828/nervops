import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#282c31] text-gray-400 py-4 px-6 mt-auto">
      {/* Horizontal Rule */}
      <hr className="border-gray-700 mb-4" />

      {/* Footer Content */}
      <div className="flex justify-between items-center">


        {/* Center - Copyright */}
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Your Company. All Rights Reserved.</p>
        </div>

        {/* Right - Privacy Policy */}
        <div className="text-sm">
          <Link to="/privacy-policy" className="hover:text-blue-500">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
