/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stamp: {
          "0%": { transform: "scale(0) rotate(-45deg)" },
          "50%": { transform: "scale(1.2) rotate(-15deg)" },
          "100%": { transform: "scale(1) rotate(-15deg)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        stamp: "stamp 0.5s ease-out forwards",
      },
      colors: {
        "custom-yellow": "#FFE617",
        "custom-purple": "#2a3abf",
        "custom-violet": "#7378f6",
        "custom-background": "#171515",
        "custom-hover": "#0e0e0e",
      },
      fontFamily: {
        sans: ["CookieRun-Regular", "sans-serif"],
        nanumLight: ["NanumSquareNeoLight", "sans-serif"],
        yang: ["양진체", "돋움체"],
        NanumBarunGothic: ["NanumBarunGothic", "sans-serif"],
      },
      scrollbar: ["rounded"],
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
