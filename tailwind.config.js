/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    fontFamily: {
      bebas: "Bebas Neue",
    },
    screens: {
      sm: "375px",
      // => @media (min-width: 375px) { ... }
      smm: "480px",
      smd: "600px",

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {},
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
};

