/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        hindi: ['"Baloo 2"', '"Noto Sans Devanagari"', 'sans-serif'],
        display: ['"Baloo 2"', 'cursive', 'sans-serif'],
      },
      colors: {
        toy: {
          yellow: '#FFD12A',
          'yellow-dark': '#E0AC00',
          orange: '#FF8A00',
          'orange-dark': '#D96500',
          coral: '#FF5C5C',
          'coral-dark': '#DB3030',
          pink: '#FF6EA7',
          'pink-dark': '#D8417E',
          purple: '#9B51E0',
          'purple-dark': '#7B35BD',
          blue: '#2F80ED',
          'blue-dark': '#1C61B8',
          sky: '#56CCF2',
          'sky-dark': '#2D9CDB',
          mint: '#27AE60',
          'mint-dark': '#1F8C4D',
          cream: '#FFF9E6',
          canvas: '#F4F7FB',
        },
      },
      boxShadow: {
        'toy-sm': '0 4px 0 rgba(0, 0, 0, 0.15)',
        'toy-md': '0 6px 0 rgba(0, 0, 0, 0.18)',
        'toy-lg': '0 8px 0 rgba(0, 0, 0, 0.2)',
        'toy-xl': '0 10px 0 rgba(0, 0, 0, 0.22)',
        'toy-sunken': 'inset 0 4px 0 rgba(0, 0, 0, 0.15)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 138, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 16px rgba(255, 138, 0, 0)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        'bounce-short': 'bounceShort 0.6s ease-in-out',
        'pop-in': 'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        shake: 'shake 0.4s ease-in-out',
        'pulse-glow': 'pulseGlow 1.8s infinite',
      },
    },
  },
  plugins: [],
};
