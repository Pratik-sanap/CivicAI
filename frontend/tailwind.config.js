/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 80px rgba(37, 99, 235, 0.35)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(20px, -24px, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};