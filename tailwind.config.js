/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, crafty palette
        brand: {
          50: '#fdf8f6',
          100: '#f9ebe5',
          200: '#f5d5c8',
          300: '#e9b8a6',
          400: '#d4897a',
          500: '#c76a5e',
          600: '#b54d4a',
          700: '#97403d',
          800: '#7c3636',
          900: '#672f30',
        },
        // Deep warm backgrounds
        surface: {
          900: '#1a1216',
          800: '#231a1d',
          700: '#2d2226',
          600: '#3d2f33',
          500: '#4a3a3f',
        },
        // Accent colors
        accent: {
          coral: '#e07a5f',
          gold: '#f2cc8f',
          sage: '#81b29a',
          cream: '#f4f1de',
          rose: '#d4a5a5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(224, 122, 95, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(224, 122, 95, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
