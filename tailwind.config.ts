import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          500: "#4f46e5",
          700: "#3730a3",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        heading: ["var(--font-heading)", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            // العناوين الفرعية جوه المقال (h2, h3...) بتستخدم فونت مختلف عن نص الفقرات
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-heading)",
              fontWeight: "700",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
