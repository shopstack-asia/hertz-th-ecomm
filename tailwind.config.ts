import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        hertz: {
          yellow: "#FFCC00",
          black: "#000000",
          "black-90": "#434244",
          "black-80": "#58595B",
          "black-60": "#808285",
          gray: "#F5F5F5",
          border: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans-thai)", "sans-serif"],
        ride: ["var(--font-ibm-plex-sans-thai)", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
        "container-narrow": "960px",
      },
      spacing: {
        4.5: "18px",
        13: "52px",
        18: "72px",
      },
      minHeight: {
        tap: "48px",
      },
      minWidth: {
        tap: "48px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        card: "0 2px 8px rgba(0,0,0,0.06)",
        elevated: "0 4px 16px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        hertz: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
