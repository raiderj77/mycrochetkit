/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#1a1a2e',
        navy: '#16213e',
        coral: '#ff6b6b',
        cream: '#f8f5f2',
        sage: '#4ade80',
      },
    },
  },
  plugins: [],
}
