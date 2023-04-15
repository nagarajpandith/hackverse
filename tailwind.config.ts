import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#24ECA3",
        secondary: "#16CDC8",
        tertiary: "#01A3F9",
      },
    },
  },
  plugins: [],
} satisfies Config;
