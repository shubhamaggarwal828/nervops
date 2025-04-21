const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       padding: {
        'content-top': '600px',
        'content-top-lg': '0px', // Custom padding for large screens and up
        'content-top-xl': '80px', // Custom padding class
      },
      maxWidth: {
        'custom-width': '1100px',

      },
      colors: {
        'custom-green-900': '#287150', // Your custom green color
      },
     
    },
    
    
  },
  darkMode: "class",
  plugins: [nextui()],
};
