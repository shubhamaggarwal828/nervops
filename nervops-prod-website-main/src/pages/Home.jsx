import React from "react";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import AdvFeatures from "../components/AdvFeatures/AdvFeatures";
import GetNotified from "../components/GetNotified/GetNotified";
import RightImageSection from "../components/RightImageSection/RightImageSection";
import FaqSection from "../components/FaqSection/FaqSection";
import Uptime_Monitoring_Info from "../components/Uptime_Monitoring_Info/Uptime_Monitoring_Info";
import GetStarted from "../components/GetStarted/GetStarted";
import HowItWorks from "../components/HowItWorks/HowItWorks";

const Home = () => {
  return (
    <div>
      <Hero />
      <Uptime_Monitoring_Info />
      <Features />
      {/* <AdvFeatures /> */}
      {/* <GetNotified /> */}
      {/* <RightImageSection /> */}
      <HowItWorks />
      <FaqSection />
      <GetStarted />
    </div>
  );
};

export default Home;
