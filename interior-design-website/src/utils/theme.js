// Applies the admin-chosen colours and fonts to the public website (CSS variables + Google Fonts).
const VARS = ['--c-forest', '--c-forest-700', '--c-forest-800', '--c-forest-900', '--c-cream', '--c-cream-200', '--c-sage', '--c-sage-600', '--c-beige', '--c-beige-600', '--font-display', '--font-sans'];

const parse = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (c, to, t) => c.map((v, i) => Math.round(v + (to[i] - v) * t));
const dark = (c, t) => mix(c, [0, 0, 0], t);
const light = (c, t) => mix(c, [255, 255, 255], t);
const ch = (c) => c.join(' ');

const FONT_WEIGHTS = { 'DM Serif Display': '400', Fraunces: '400;500;600', 'Libre Baskerville': '400;700' };
function loadFont(name, kind) {
  if (name === 'Cormorant Garamond' || name === 'Manrope') return; // already loaded by index.html
  const id = `theme-font-${name.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const weights = FONT_WEIGHTS[name] || (kind === 'heading' ? '400;500;600' : '400;500;600;700');
  const link = document.createElement('link');
  link.id = id; link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@${weights}&display=swap`;
  document.head.appendChild(link);
}

export function applyTheme(theme = {}) {
  const root = document.documentElement.style;
  const set = (k, v) => v && root.setProperty(k, v);
  const primary = parse(theme.primary); const bg = parse(theme.background); const accent = parse(theme.accent); const warm = parse(theme.warm);
  if (primary) { set('--c-forest', ch(primary)); set('--c-forest-700', ch(light(primary, 0.1))); set('--c-forest-800', ch(dark(primary, 0.3))); set('--c-forest-900', ch(dark(primary, 0.5))); }
  if (bg) { set('--c-cream', ch(bg)); set('--c-cream-200', ch(dark(bg, 0.04))); }
  if (accent) { set('--c-sage', ch(accent)); set('--c-sage-600', ch(dark(accent, 0.2))); }
  if (warm) { set('--c-beige', ch(warm)); set('--c-beige-600', ch(dark(warm, 0.14))); }
  if (theme.headingFont) { loadFont(theme.headingFont, 'heading'); set('--font-display', `'${theme.headingFont}'`); }
  if (theme.bodyFont) { loadFont(theme.bodyFont, 'body'); set('--font-sans', `'${theme.bodyFont}'`); }
}

export const clearTheme = () => VARS.forEach((v) => document.documentElement.style.removeProperty(v));
