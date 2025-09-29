/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
    './sharifgpt-website/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}
