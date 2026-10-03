import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import logo from "../images/logo.png";
import vectorGraphics from "../images/vector_graphic.svg";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { Loader, Mail, Lock, User } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const SignUpPage2 = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate(); // Corrected the missing useNavigate

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email"); // Redirect after signup
    } catch (error) {
      console.log(error);
    }
  };

  // Handler for checkbox state change
  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  return (
    <div className="flex min-h-screen w-screen flex-wrap text-slate-800">
      {/* Left Section */}
      <div className="flex min-h-screen w-full flex-col md:w-1/2 bg-[#121212]">
        <div className="flex justify-center pt-8 md:justify-start md:pl-12 text-white">
          <img
            src={logo}
            alt="Uptime Fury Logo"
            className="mr-3 h-12 sm:h-12 transition-opacity duration-300"
          />

        </div>
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <h2 className="text-3xl font-bold text-center text-[#35976b] ">
            Create Your Account Here
          </h2>
          {/* Form */}
          <form
            className="flex flex-col items-stretch pt-3 md:pt-8"
            onSubmit={handleSignUp} // Corrected the onSubmit reference
          >
            <div className="flex flex-col">
              <div className="relative flex overflow-hidden transition">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-green-500" />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                  placeholder="Name"
                  value={name} // Fixed the value reference
                  onChange={(e) => setName(e.target.value)} // Updated handler
                />
              </div>
            </div>
            <div className="flex flex-col pt-4">
              <div className="relative flex overflow-hidden transition">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-green-500" />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                  placeholder="Email"
                  value={email} // Fixed the value reference
                  onChange={(e) => setEmail(e.target.value)} // Updated handler
                />
              </div>
            </div>
            <div className="flex flex-col mt-4 mb-6">
              <div className="relative flex overflow-hidden transition">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-green-500" />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                  placeholder="Password"
                  value={password} // Fixed the value reference
                  onChange={(e) => setPassword(e.target.value)} // Updated handler
                />
              </div>
              <PasswordStrengthMeter password={password} />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
                required // Handle checkbox state
              />
              <label htmlFor="terms" className="text-white">
                I accept the{" "}
                <a href="#" className="text-[#35976b] underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {error && (
                <p className="text-red-500 font-semibold mt-2 mb-4">{error}</p>
              )}
            <button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !termsAccepted} // Disable if loading or terms not accepted
              className="bg-[#287150] text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 py-3 px-6 text-sm hover:bg-[#205c44]"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Create an account"
              )}
            </button>
          </form>
          <div className="py-8 text-center">
            <p className="text-white">
              Already have an account?
              <Link
                to="/login"
                className="whitespace-nowrap font-semibold text-[#35976b] underline underline-offset-4 ml-2"
              >
                Log in here.
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div
        className="relative hidden min-h-screen select-none bg-cover bg-center md:block md:w-1/2"
        style={{
          backgroundImage: `url(${vectorGraphics})`,
          backgroundPosition: "left center", // Align image to the left
          backgroundSize: "cover", // Ensure the image covers the div without distorting
        }}
      ></div>
    </div>
  );
};

export default SignUpPage2;
