/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm beige palette for light mode
        beige: {
          50: '#fdfcfa',
          100: '#f9f6f1',
          200: '#f3ede3',
          300: '#e8dcc8',
          400: '#d4b896',
          500: '#c29a6b',
          600: '#a67c52',
          700: '#8b6544',
          800: '#6e4f35',
          900: '#57402a',
        },
        // Accent orange
        accent: {
          DEFAULT: '#d97706',
          hover: '#b45309',
          light: '#f59e0b',
        },
      },
      boxShadow: {
        hard: '4px 4px 0px 0px rgba(0, 0, 0, 0.25)',
        'hard-lg': '6px 6px 0px 0px rgba(0, 0, 0, 0.25)',
        'hard-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'slide-in-up': 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
