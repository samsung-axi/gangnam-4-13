const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["FlightSans-Title", "sans-serif"],
        contents: ["RIDIBatang", "sans-serif"],
      },
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        pointer: "#3B48CC",
        pointer2: "#9DA3E5",
        main: "#2C2C2C",
      },
      height: {
        'screen-small': '100svh',
      },
      minHeight: {
        'screen-small': '100svh',
      },
      maxHeight: {
        'screen-small': '100svh',
      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
