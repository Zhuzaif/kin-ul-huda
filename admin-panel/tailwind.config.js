/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nisa: {
          green: '#0B4D3C',
          gold: '#C9A24B',
          bg: '#F5F3EE'
        }
      }
    },
  },
  plugins: [],
}
