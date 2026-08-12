/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Permite alternar modo claro/oscuro activando la clase 'dark'
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed', // Morado de tu prototipo CondoMaster Pro
          700: '#6d28d9',
        }
      }
    },
  },
  plugins: [],
}