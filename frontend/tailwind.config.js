/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          cyan: '#22d3ee',
          emerald: '#10b981',
        },
        slate: {
          50: '#F5F7FA',   // Background
          200: '#E2E8F0',  // Borders
          500: '#64748B',  // Secondary Text
          900: '#0F172A',  // Primary Text
        },
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',  // Primary Blue
          700: '#1D4ED8',  // Primary Blue Hover
        },
        emerald: {
          50: '#ECFDF5',
          600: '#16A34A',  // Success Green
        },
        amber: {
          50: '#FEF3C7',
          500: '#F59E0B',  // Warning Amber
        },
        red: {
          50: '#FEF2F2',
          600: '#DC2626',  // Danger Red
        },
      },
      boxShadow: {
        glow: '0 0 80px rgba(34,211,238,0.25)',
        'glow-emerald': '0 0 60px rgba(16,185,129,0.2)',
        'glow-rose': '0 0 60px rgba(244,63,94,0.2)',
        card: '0 4px 32px rgba(0,0,0,0.45)',
        'card-hover': '0 8px 48px rgba(0,0,0,0.55)',
      },
      keyframes: {
        // Existing
        'float-slow': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-18px,0) scale(1.03)' },
        },
        'float-slower': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,14px,0) scale(1.02)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '33%': { transform: 'translate3d(14px,-10px,0)' },
          '66%': { transform: 'translate3d(-12px,12px,0)' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.99)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // New
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-400px 0' },
          to: { backgroundPosition: '400px 0' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(120%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'toast-out': {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(120%)' },
        },
        'progress-bar': {
          from: { width: '100%' },
          to: { width: '0%' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'float-slower': 'float-slower 12s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
        'rise-in': 'rise-in 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right': 'slide-right 0.4s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 1.6s linear infinite',
        'toast-in': 'toast-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'toast-out': 'toast-out 0.3s ease-in both',
        'progress-bar': 'progress-bar linear both',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'spin-slow': 'spin-slow 2s linear infinite',
        'count-up': 'count-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        floaty: 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};