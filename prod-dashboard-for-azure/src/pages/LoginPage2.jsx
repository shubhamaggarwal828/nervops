import React, { useState } from "react";
import logo from "../images/logo.png";
import { motion } from "framer-motion";
import vectorGraphics from "../images/vector_graphic.svg";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

const LoginPage2 = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoading, error } = useAuthStore();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Call the login function and handle errors
    try {
      await login(formData.email, formData.password);
      // Optionally, handle successful login
    } catch (err) {
      // Show toast on error
      toast.error("Login failed. Please check your credentials."); // Customize the message
    }
  };

  return (
    <div className="flex w-screen flex-wrap text-slate-800">
      <div className="flex h-screen w-full flex-col md:w-2/4 bg-[#121212]">
        <div className="flex justify-center pt-8 md:justify-start md:pl-12 text-white">
          <img
            src={logo}
            alt="Uptime Fury Logo"
            className="mr-3 h-12 sm:h-12 transition-opacity duration-300"
          />

        </div>
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-6 md:justify-start lg:w-[28rem]">
          <p className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl text-[#ffff]">
            Welcome back <br />
            to <span className="text-[#35976b]">NervOps</span>
          </p>
          <p className="mt-6 text-center font-medium md:text-left text-[#ffff]">
            Sign in to your account below.
          </p>

          <form
            className="flex flex-col items-stretch pt-3 md:pt-8"
            onSubmit={handleLogin}
          >
            <div className="flex flex-col">
              <div className="relative flex overflow-hidden transition">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-green-500" />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col pt-4">
              <div className="relative flex overflow-hidden transition">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-green-500" />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <Link
              to="/forgot-password"
              className="text-center text-sm font-medium text-white md:text-left"
            >
              Forgot password?
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 mt-4 text-sm hover:bg-[#205c44]"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-t-4 border-t-[#35976b] border-gray-200 rounded-full animate-spin mx-auto" />
              ) : (
                "Log In"
              )}
            </motion.button>
          </form>
          <div className="py-8 text-center">
            <p className="text-white">
              Don't have an account?
              <Link
                to="/signup"
                className="whitespace-nowrap font-semibold text-[#35976b] underline underline-offset-4 ml-2"
              >
                Sign up for free.
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div
        className="relative hidden h-screen select-none bg-cover bg-center md:block md:w-1/2"
        style={{
          backgroundImage: `url(${vectorGraphics})`,
          backgroundPosition: "left center",
          backgroundSize: "cover",
        }}
      ></div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default LoginPage2;
