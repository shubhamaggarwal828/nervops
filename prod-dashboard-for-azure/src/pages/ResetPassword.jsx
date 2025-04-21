import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link, useParams } from "react-router-dom"; // Added useParams import
import Input from "../components/Input";
import { Lock } from "lucide-react";
import logo from "../images/logo.png";
import vectorGraphics from "../images/vector_graphic.svg";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Added state to track submission
  const { resetPassword, error, isLoading, message } = useAuthStore();
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); // Replaced alert with toast
      return;
    }

    try {
      await resetPassword(token, password);
      setIsSubmitted(true); // Set form submission state
      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-wrap text-slate-800">
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
              Reset Password
            </h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {message && (
              <p className="text-green-500 text-sm mb-4">{message}</p>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-300 mb-6 text-center">
                  Enter your new password below.
                </p>
                <Input
                  icon={Lock} // Using Lock icon for new password
                  type="password"
                  placeholder="New Password"
                  value={password} // Corrected variable name
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  icon={Lock} // Using Lock icon for confirm password
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-[#205c44]"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Set New Password"}
                </motion.button>
              </form>
            ) : (
              <p className="text-gray-300 text-center mt-6">
                Password reset successfully. Redirecting...
              </p> // Added fallback UI for submitted state
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

export default ResetPassword;
