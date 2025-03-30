/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      cursor: {
        pointer: 'url(@/assets/cursor/link.png), pointer',
        text: 'url(@/assets/cursor/text.png), text',
      },
      width: {
        1280: '80rem',
      },
    },
  },
  plugins: [],
}
