import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import "./App.css";
import QuickStats from "./pages/QuickStats";
import SSL from "./pages/SSL";
import Ping from "./pages/Ping";
import Http from "./pages/Http";
import Whois from "./pages/Whois";
import TraceRoute from "./pages/Traceroute";
import NSLookup from "./pages/NSLookup";
import DNSLookup from "./pages/DNSLookup";
import Footer from "./components/Footer/Footer"; 
import ScrollToTop from "./ScrollToTop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import WebsiteMonitoring from "./pages/WebsiteMonitoring";


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/quickstats" element={<QuickStats/>} />
          <Route path="/ssl" element={<SSL/>} />
          <Route path="/ping" element={<Ping/>} />
          <Route path="/http" element={<Http/>} />
          <Route path="/whois" element={<Whois/>} />
          <Route path='/TraceRoute' element={<TraceRoute/>} />
          <Route path='/NSLookup' element={<NSLookup/>} />
          <Route path='/DNSLookup' element={<DNSLookup/>} />
          <Route path='/about-us' element={<AboutUs/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
          <Route path='/websitemonitoring' element={<WebsiteMonitoring/>} />



        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
