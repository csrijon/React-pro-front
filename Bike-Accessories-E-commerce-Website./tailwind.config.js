/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0D10', 800: '#15181D', 700: '#1C2026', 600: '#242932' },
        brand: {
          DEFAULT: '#EF252B', // decorative: borders, glows, large display text
          solid: '#D91F26', // filled backgrounds under white text (5.0:1 contrast)
          light: '#FF5A5F', // small red text on dark surfaces (5.3:1 contrast)
          dark: '#B91C24',
          soft: 'rgba(239,37,43,0.12)',
        },
        line: '#30343B',
        muted: '#A7ADB5',
      },
      fontFamily: {
        sans: ['Inter', 'Inter Fallback', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Poppins Fallback', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(239,37,43,0.55)',
        card: '0 12px 30px -12px rgba(0,0,0,0.7)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 40s linear infinite' },
    },
  },
  plugins: [],
}
