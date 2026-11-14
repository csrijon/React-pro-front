/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colours come from CSS variables so the owner can change them in Admin → Settings (defaults are set in index.css).
        primary: { DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)', 700: 'rgb(var(--c-primary-700) / <alpha-value>)', 50: 'rgb(var(--c-primary-50) / <alpha-value>)' },
        accent: { DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)', 600: 'rgb(var(--c-accent-600) / <alpha-value>)', 50: 'rgb(var(--c-accent-50) / <alpha-value>)', light: 'rgb(var(--c-accent-light) / <alpha-value>)' },
        surface: '#F5F8F6',
        ink: '#1F2937',
        muted: '#64748B',
        line: '#E5E7EB',
      },
      fontFamily: {
        // The owner picks these fonts in Admin → Settings (variables are set in SiteContext).
        heading: ['var(--font-heading)', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(6,62,47,.04), 0 8px 24px -12px rgba(6,62,47,.18)',
        lift: '0 2px 4px rgba(6,62,47,.06), 0 20px 40px -16px rgba(6,62,47,.28)',
      },
    },
  },
  plugins: [],
}
