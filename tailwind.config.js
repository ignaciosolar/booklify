/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        'background-light': '#f8fafc',
        'background-dark': '#0b1220',
        'foreground-light': '#0f172a',
        'foreground-dark': '#e6eef8',
        'card-light': '#ffffff',
        'card-dark': '#071229',
        'muted-light': '#94a3b8',
        'muted-dark': '#94a3b8',
        'border-light': '#e6eef8',
        'border-dark': '#0b1220'
      },
      fontFamily: {
        display: ['Manrope', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
