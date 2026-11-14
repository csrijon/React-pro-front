// Brand colour helpers. The owner picks two colours; the shades the design needs are derived from them.
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)))
export const isHex = (h) => /^#[0-9a-fA-F]{6}$/.test(h || '')
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => a.map((v, i) => clamp(v * (1 - t) + b[i] * t)) // t = amount of b
const css = (c) => c.join(' ')

export function toHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [h * 60, s, l]
}
function fromHsl(h, s, l) {
  const f = (n) => { const k = (n + h / 30) % 12; return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)) }
  return [f(0), f(8), f(4)].map((v) => clamp(v * 255))
}
const lum = (c) => { const [r, g, b] = c.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
/** WCAG contrast of white text on this colour (4.5+ is comfortable for normal text). */
export const contrastWithWhite = (hex) => (isHex(hex) ? 1.05 / (lum(rgb(hex)) + 0.05) : 0)

export function themeVars({ primary, accent }) {
  const p = rgb(primary), a = rgb(accent), white = [255, 255, 255], black = [0, 0, 0]
  const [h, s] = toHsl(a)
  return {
    '--c-primary': css(p), '--c-primary-700': css(mix(p, white, 0.12)), '--c-primary-50': css(mix(p, white, 0.91)),
    '--c-accent': css(a), '--c-accent-600': css(mix(a, black, 0.14)), '--c-accent-50': css(mix(a, white, 0.92)),
    '--c-accent-light': css(fromHsl(h, Math.min(1, s * 1.3), 0.67)),
  }
}
export function applyTheme(theme) {
  if (!isHex(theme?.primary) || !isHex(theme?.accent)) return
  const root = document.documentElement
  Object.entries(themeVars(theme)).forEach(([k, v]) => root.style.setProperty(k, v))
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.primary)
}
