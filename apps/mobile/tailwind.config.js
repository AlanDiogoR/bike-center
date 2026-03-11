/** @type {import('tailwindcss').Config} */
/** Tema Bike Center - alinhado com web: #ec6e37 (laranja), preto, verde CTA */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#ec6e37",
          primaryText: "#ffffff",
          secondary: "#ec6e37",
          headerBg: "#0a0a0a",
          headerText: "#ffffff",
          cta: "#22c55e",
          ctaHover: "#16a34a",
          onSale: "#e34f4f",
          soldOut: "#bebdb9",
          background: "#ffffff",
          text: "#0a0a0a",
          dark: "#0a0a0a",
          neutral: "#6b7280",
          light: "#f9fafb",
          black: "#000000",
        },
      },
      fontFamily: {
        heading: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        button: "60px",
        input: "10px",
        block: "12px",
      },
    },
  },
  plugins: [],
};
