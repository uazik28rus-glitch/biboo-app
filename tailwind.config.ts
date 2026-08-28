import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#16161A",
        "surface-light": "#1E1E24",
        border: "#27272E",
        accent: {
          blue: "#5B8DEF",
          pink: "#E87878",
          coral: "#F0A04B",
          green: "#5BC88A",
          teal: "#4ECDC4",
        },
        muted: "#8B8B93",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
