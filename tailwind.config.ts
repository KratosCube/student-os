import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Tady říkáme Tailwindu: "Prohledej všechny soubory ve složce app"
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;