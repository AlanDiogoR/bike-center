import type { Config } from "tailwindcss";

/**
 * Tema Bike Center: #ec6e37 (laranja), preto, verde para compra (estilo Pagani Design)
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#ffffff",
          text: "#0a0a0a",
          headerBg: "#0a0a0a",
          headerText: "#ffffff",
          footerBg: "#0a0a0a",
          footerText: "#ffffff",
          primary: "#ec6e37",
          primaryText: "#ffffff",
          secondary: "#ec6e37",
          secondaryText: "#ffffff",
          accent: "#ec6e37",
          cta: "#22c55e",
          ctaHover: "#16a34a",
          onSale: "#e34f4f",
          soldOut: "#bebdb9",
          badge: "#803cee",
          success: "#22c55e",
          warning: "#e37e16",
          error: "#aa2826",
          dialog: "#ffffff",
          productCard: "#ffffff",
        },
      },
      fontFamily: {
        heading: ["Outfit", "Century Gothic", "Trebuchet MS", "sans-serif"],
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1800px",
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

export default config;
