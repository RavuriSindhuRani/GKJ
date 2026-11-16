/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indriya: {
          blue: '#12396B',        // Exact Indriya top banner & arch royal blue
          darkblue: '#0B2344',    // Deep navy blue
          navy: '#06162C',
          peach: '#FFF5EA',       // Exact Indriya warm peach cream
          cream: '#FFF9F2',
          ivory: '#FAF6F0',
          gold: '#C5A059',        // Warm jewellery gold
          lightgold: '#E8D59C',
          brightgold: '#D4AF37',
          crimson: '#8F2E27',     // Exact logo crimson
          darkcrimson: '#6E1B15',
        },
        gold: {
          50: '#FAF6ED',
          100: '#F4EBCE',
          200: '#E8D59C',
          300: '#DCBE69',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A7823E',
          700: '#84642C',
          800: '#62481E',
          900: '#433013',
        },
      },
      fontFamily: {
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 12px 36px -4px rgba(18, 57, 107, 0.08), 0 4px 16px -2px rgba(197, 160, 89, 0.1)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.28)',
        'card': '0 2px 14px 0 rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
