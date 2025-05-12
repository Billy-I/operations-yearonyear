/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '112': '448px', // Custom width for field group sidebar
      },
    },
  },
  plugins: [],
};
