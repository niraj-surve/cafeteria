/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff715b",
        secondary: "#2EC1E3",
        dark: "#4c5454",
        white: "#ffffff",
        muted: "#7b7b82",
        success: "#28a745",
      },
      fontFamily: {
        mulish: "Mulish, sans-serif",
        opensans: "Open Sans, sans-serif",
      },
      gridTemplateColumns: {
        split: "3.5fr 8.5fr",
      },
    },
  },
  plugins: [],
};
