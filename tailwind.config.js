/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        "Outfit": ['Outfit', 'sans-serif'], 
        "Inter": ['Inter', 'sans-serif'], 
        "Blinker": ['Blinker', 'sans-serif'] 
      }
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
}

