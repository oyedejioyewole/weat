import type { Config } from "tailwindcss";

export default {
  content: [],
  plugins: [],
  theme: {
    extend: {
      colors: {
        brand: "#5C87E4",
      },
      fontFamily: {
        sans: "Roboto, sans-serif",
        serif: "Cambria, serif",
      },
    },
  },
} satisfies Config;
