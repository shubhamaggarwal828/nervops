import React, { useEffect, useRef } from "react";
import uptimevideo from "../../assets/img/uptime-video.mp4";

const VideoSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Create an IntersectionObserver to observe when the video comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play the video when it's in view
            videoRef.current.play();
          } else {
            // Pause the video when it's out of view
            videoRef.current.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the video is visible
      }
    );

    // Observe the video element
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // Cleanup the observer on unmount
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-[#121212] py-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Set Up Website Monitoring in Seconds
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-6xl break-words mx-auto">
          With Uptime Fury, you can quickly configure website monitoring to ensure your site stays online, 24/7. Get instant alerts when issues arise, so you can take action before your users even notice.
        </p>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-6xl">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-lg"
            muted
            loop
            playsInline
            style={{ minHeight: "500px" }}
          >
            <source
              src={uptimevideo}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="text-center">
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-300 max-w-6xl break-words mx-auto">
          Just enter your website’s URL, and we’ll take care of the rest. Set up in seconds, monitor continuously, and get peace of mind knowing your site is always being watched.
        </p>
        <button
          className="mt-5 w-full md:w-auto inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full"
          style={{
            backgroundColor: "#35976b",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#287150")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#35976b")}
        >
          Get Started
          <svg
            className="ml-2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

  );
};

export default VideoSection;
