import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          100: "#10451D",
          90: "#155D27",
          80: "#1A7431",
          70: "#208B3A",
          60: "#25A244",
          50: "#2DC653",
          40: "#4AD66D",
          30: "#6EDE8A",
          20: "#92E6A7",
          10: "#B7EFC5",
        },
        "custom-black": "#0A0908",
        "custom-white": "#fff",
        silver: "#A6A2A2",
      },
    },
  },
  plugins: [],
}
export default config
