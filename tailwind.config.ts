
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ou 'media' se preferir seguir o sistema
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          light: '#f8f9fa',
          dark: '#1f2937',
        },
        primary: {
          DEFAULT: '#2563eb', // Azul sereno
          dark: '#1d4ed8',
        },
        accent: {
          DEFAULT: '#fbbf24', // Amarelo dourado suave
          hover: '#f59e0b',
        },
        chord: '#fbbf24', // Mesmo amarelo para acordes destacados
        text: {
          light: '#111827',
          dark: '#f3f4f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}