/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00f2ff",
          purple: "#bc13fe",
          red: "#ff3131",
        },
      },
    },
  },
  plugins: [],
}
