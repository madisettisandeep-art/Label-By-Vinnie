/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        antique: {
          brown: "#67471A",
          dark: "#4E3512",
        },
        warm: {
          ivory: "#F3EDE1",
        },
        espresso: {
          DEFAULT: "#3B2819",
          deep: "#26190E",
        },
        taupe: {
          DEFAULT: "#A18F78",
          light: "#B8A894",
        },
        champagne: {
          gold: "#C5A059",
          beige: "#D8C8AD",
        },
        soft: {
          ivory: "#FAF7F0",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        editorial: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        luxury: ".35em",
      },
    },
  },
  plugins: [],
};
