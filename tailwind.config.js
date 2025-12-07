/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./styles/**/*.{js,jsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E50914",
          dark: "#0A0A0A",
          light: "#FFFFFF",
          gray: "#111111"
        },
        luxury: {
          black: "#0A0A0A",
          graphite: "#121212",
          chrome: "#D7D7D7",
          glow: "#E50914"
        }
      }
    }
  },
  plugins: []
};
