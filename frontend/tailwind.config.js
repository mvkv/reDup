/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#4285F4',
        'main-text': '#54616C',
        'main-gray': {
          100: '#F7F7F7',
          200: '#E8E8E8',
          300: '#B7B7B7',
        },
      },
    },
  },
  plugins: [],
};
