import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "esland-cover": "url('/assets/bg.jpg')",
      },
      colors: {
        "esland-dark-blue": "#000527",
        "esland-light-blue": "#47AAE7",
      },
      boxShadow: {
        "candidate-card": "0 0 25px 7px #e2e4f559",
      },
    },
  },
  plugins: [],
};
export default config;
