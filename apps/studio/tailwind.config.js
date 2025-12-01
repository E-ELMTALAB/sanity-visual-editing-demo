/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Overriding fontFamily to use @next/font loaded families
      fontFamily: {
        mono: 'var(--font-mono)',
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
      },
    },
  },
  plugins: [
    import('@tailwindcss/typography'),
    import('tailwindcss-animate'),
  ],
}
