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
        inputColor: '#e2e8f0',
        buttonColor: '#7A5CFA',
        formColor: 'rgba(103, 80, 164, 0.14)',
        cardBorderColor: '#F0F0F0',
        cardBg: '#C4D7E0',
        cardHoverColor: '#B2C8DF',
        bgColor: '#A8A8A8',
        lightBg: '#f8fafc',
        darkBg: '#334155',
        warningBg: 'rgb(214 211 209)',
      },
    },
  },
  plugins: [],
}