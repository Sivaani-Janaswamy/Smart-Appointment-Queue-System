/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-space': '#111119',
        'electric-magenta': '#F000B8',
        'cyber-purple': '#7A00F0',
        'plasma-green': '#33FF00',
        'ghost-white': '#F9F9F9',
        'light-grey': '#D1D1D1',
        'medium-grey': '#888888',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
