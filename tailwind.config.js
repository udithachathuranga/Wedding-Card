/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fcfaf2',
          100: '#f7f2dd',
          200: '#efe2b5',
          300: '#e4cd88',
          400: '#d7b258',
          500: '#c89932',
          600: '#a97a25',
          700: '#875b20',
          800: '#6f4a20',
          900: '#5d3d1f',
        },
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe6e9',
          200: '#f8d0d6',
          300: '#f2aab7',
          400: '#e8758d',
          500: '#d74868',
          600: '#be294d',
          700: '#9f1d3c',
          800: '#851a34',
          900: '#480c1b',
          950: '#26040c',
        },
        ivory: {
          50: '#fdfbf7',
          100: '#f9f5ed',
          200: '#f2ebd9',
          300: '#e7dcbe',
          400: '#d8c59c',
          500: '#c5ab7b',
        },
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cinzel"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        brush: ['"Alex Brush"', 'cursive'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(215, 178, 88, 0.45)',
        'gold-glow-lg': '0 0 45px rgba(215, 178, 88, 0.65)',
        'luxury': '0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(200, 153, 50, 0.2)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
