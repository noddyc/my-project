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
        inter:['Inter', 'sans-serif']
      },
      colors:{
        fontColor: '#666666',
        inputColor: '#CCCCCC',
        buttonColor: '#7A5CFA',
        formColor: 'rgba(103, 80, 164, 0.14)',
        cardBGColor: '#FCFCFC',
        cardBorderColor: '#F0F0F0',
        cardHoverColor: '#E6F2FB',
        bgColor: '#A8A8A8'
      },
    },
  },
  plugins: [],
}