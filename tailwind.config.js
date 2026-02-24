/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00d4ff",
        secondary: "#ffcc00",
        dark: "#050505",
        surface: "#0a0a0a",
      },
    },
  },
  plugins: [],
};
