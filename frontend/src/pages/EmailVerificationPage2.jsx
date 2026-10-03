import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Added toast import
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import logo from "../images/logo.png";
import vectorGraphics from "../images/vector_graphic.svg";

const EmailVerificationPage2 = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Added state to track submission
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const validate = () => {
    let valid = true;
    let errors = "";

    if (code.join("").length !== 6) {
      errors = "Please enter the 6-digit verification code";
      valid = false;
    }

    return valid;
  };

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (validate()) {
      try {
        await verifyEmail(verificationCode);
        setIsSubmitted(true);
        toast.success("Email verified successfully");
        navigate("/");
      } catch (error) {
        toast.error("Verification failed. Please try again.");
      }
    } else {
      toast.error("Please enter the 6-digit verification code.");
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-wrap text-slate-800">
      <ToastContainer /> {/* Added ToastContainer to display toasts */}
      {/* Left Section */}
      <div className="flex min-h-screen w-full flex-col md:w-1/2 bg-[#121212]">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12 text-white">
          <img
            src={logo}
            alt="Uptime Fury Logo"
            className="mr-3 h-12 sm:h-12 transition-opacity duration-300"
          />
        </div>
        <div className="my-20 mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#35976b] bg-clip-text">
              Verify Your Email
            </h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-300 mb-6 text-center">
                  Enter the 6-digit code sent to your email address.
                </p>
                <div className="flex justify-between mb-6">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="6"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 font-semibold mt-2">{error}</p>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-[#205c44]"
                  disabled={isLoading || code.some((digit) => !digit)}
                  type="submit"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </motion.button>
              </form>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-gray-300 mb-6">
                  Your email has been verified!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Right Section (Image) */}
      <div
        className="relative hidden min-h-screen select-none bg-cover bg-center md:block md:w-1/2"
        style={{
          backgroundImage: `url(${vectorGraphics})`,
          backgroundPosition: "left center",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
};

export default EmailVerificationPage2;
