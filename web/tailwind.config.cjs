const colors = require('tailwindcss/colors');
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:'class',
  theme: {
    extend: {
      colors:{
        primary:{
          light: '#FBAA2C',
          DEFAULT: '#F88F1D',
          dark: '#F95D0F',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        accent: colors.gray,
        background: '#ffffff',
        text: '#1a1a1a',
      }
    },
  },
  plugins: [],
};
