/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#063E2F', 700: '#0a5240', 50: '#e8f1ed' },
        accent: { DEFAULT: '#267032', 600: '#1f5c29', 50: '#eaf4ec' },
        surface: '#F5F8F6',
        ink: '#1F2937',
        muted: '#64748B',
        line: '#E5E7EB',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(6,62,47,.04), 0 8px 24px -12px rgba(6,62,47,.18)',
        lift: '0 2px 4px rgba(6,62,47,.06), 0 20px 40px -16px rgba(6,62,47,.28)',
      },
    },
  },
  plugins: [],
}
