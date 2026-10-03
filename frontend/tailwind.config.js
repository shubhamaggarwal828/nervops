/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				brand: {
					50: "#ecfeff",
					100: "#cffafe",
					200: "#a5f3fc",
					300: "#67e8f9",
					400: "#22d3ee",
					500: "#06b6d4",
					600: "#0891b2",
					700: "#0e7490",
					800: "#155e75",
					900: "#164e63",
				},
				dark: {
					base: "#090d16",
					surface: "#0f172a",
					card: "rgba(15, 23, 42, 0.7)",
					border: "rgba(255, 255, 255, 0.08)",
				}
			},
			fontFamily: {
				sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
				heading: ["Outfit", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			animation: {
				"pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			}
		},
	},
	plugins: [],
};
