/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens:{
      'tablet' :'1px',
      'desktop':'980px',
      'navbarSM' : {'max':'880px'},
    },
    extend: {},
  },
  plugins: [],
}