/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colours come from CSS variables so the admin can change them (see styles/index.css + SiteContext).
        forest: { DEFAULT: 'rgb(var(--c-forest) / <alpha-value>)', 700: 'rgb(var(--c-forest-700) / <alpha-value>)', 800: 'rgb(var(--c-forest-800) / <alpha-value>)', 900: 'rgb(var(--c-forest-900) / <alpha-value>)' },
        cream: { DEFAULT: 'rgb(var(--c-cream) / <alpha-value>)', 200: 'rgb(var(--c-cream-200) / <alpha-value>)' },
        charcoal: { DEFAULT: '#202321', 800: '#181a19', 700: '#2a2d2b', 600: '#343836', 500: '#4a4f4c' },
        sage: { DEFAULT: 'rgb(var(--c-sage) / <alpha-value>)', 600: 'rgb(var(--c-sage-600) / <alpha-value>)' },
        beige: { DEFAULT: 'rgb(var(--c-beige) / <alpha-value>)', 600: 'rgb(var(--c-beige-600) / <alpha-value>)' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { shell: '1360px' },
    },
  },
  plugins: [],
};
