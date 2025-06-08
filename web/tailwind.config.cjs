const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FBAA2C",
          DEFAULT: "#F88F1D",
          dark: "#F95D0F",
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"],
        },
        accent: colors.gray,
        background: "#ffffff",
        text: "#1a1a1a",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(100%)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
