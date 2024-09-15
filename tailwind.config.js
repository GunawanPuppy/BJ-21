/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        deal: {
          '0%': { transform: 'translate(-50%, -50%)' },
          '25%': { transform: 'translate(-50%, -200%)' },
          '50%': { transform: 'translate(-200%, -50%)' },
          '75%': { transform: 'translate(200%, -50%)' },
          '100%': { transform: 'translate(-50%, 200%)' },
        },
      },
      animation: {
        deal: 'deal 2s forwards',
      },
    },
  },
  plugins: [],
  }
