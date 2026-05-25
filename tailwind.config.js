/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        blood: '#E63946',
        bloodLight: '#F1A208',
      },
    },
  },
  plugins: [],
}
