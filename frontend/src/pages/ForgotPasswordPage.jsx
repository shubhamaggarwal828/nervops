import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { Mail, Loader } from "lucide-react"; // Import Loader
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import vectorGraphics from "../images/vector_graphic.svg";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("If an account exists, a reset link has been sent.", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-wrap text-slate-800">
      <ToastContainer /> {/* ToastContainer to display toasts */}
      {/* Left Section */}
      <div className="flex min-h-screen w-full flex-col md:w-1/2 bg-[#121212]">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12 text-white">
          <img
            src={logo}
            alt="Uptime Fury Logo"
            className="mr-3 h-12 sm:h-12 transition-opacity duration-300"
          />
          <span className="self-center text-lg font-bold uppercase whitespace-nowrap">
            Uptime Fury
          </span>
        </div>
        <div className="my-20 mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#35976b] bg-clip-text">
              Forgot Password
            </h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-300 mb-6 text-center">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-[#205c44]"
                  type="submit"
                >
                  {isLoading ? (
                    <Loader className="size-6 animate-spin mx-auto" />
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-16 h-16 bg-[#287150] rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-gray-300 mb-6">
                  If an account exists for {email}, you will receive a password
                  reset link shortly.
                </p>
              </div>
            )}
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="whitespace-nowrap font-semibold text-[#35976b] underline underline-offset-4 ml-2"
            >
              Back To Login
            </Link>
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

export default ForgotPasswordPage;
