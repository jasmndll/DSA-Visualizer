/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.jsx"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A24",
        paper: "#FDFCF8",
        sand: {
          100: "#F2EBE1",
          200: "#E6DCCC"
        },
        pink: {
          200: "#FFB5E8",
          300: "#FF9CEE",
          400: "#FF85E3"
        },
        mint: {
          100: "#C1F8CF",
          200: "#9EEDBB"
        },
        lilac: {
          400: "#CDB4DB"
        },
        swap: "#FF9CEE",    // pink-300
        compare: "#9EEDBB", // mint-200
        sorted: "#C1F8CF"   // mint-100
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Fira Code', 'monospace']
      },
      borderRadius: {
        win: "4px"
      },
      boxShadow: {
        winSm: "2px 2px 0px 0px rgba(26, 26, 36, 1)"
      }
    },
  },
  plugins: [],
}
