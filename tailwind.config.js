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
    extend: {
      fontFamily:{
          play: ["Play", "sans-serif"],
          roboto: ['Roboto', 'sans-serif'],

      },
      colors:{
        fontColor: '#666666',
        inputColor: '#CCCCCC',
        buttonColor: '#7A5CFA',
        formColor: 'rgba(103, 80, 164, 0.14)'
      },
    },
  },
  plugins: [],
}