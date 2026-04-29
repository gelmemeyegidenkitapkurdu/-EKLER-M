/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shine: "shine 5s ease-in-out infinite",
      },
      keyframes: {
        shine: {
          "0%": { left: "150%" },
          "20%": { left: "-150%" },
          "100%": { left: "-150%" },
        },
      },
    },
  },
  plugins: [],
};
