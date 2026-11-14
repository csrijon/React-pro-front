import { applyTheme } from './theme'
import { setCurrency } from './format'

const GOOGLE_FONTS = { Poppins: '500;600;700', Inter: '400;500;600', Montserrat: '500;600;700', 'Playfair Display': '500;600;700', Lora: '400;500;600;700', Roboto: '400;500;700', 'Open Sans': '400;500;600;700', Nunito: '400;500;600;700', 'DM Sans': '400;500;600;700', Merriweather: '400;700', Raleway: '400;500;600;700', 'Work Sans': '400;500;600;700' }

/** Applies the owner's fonts. Font names are matched against a fixed list, so nothing owner-typed ever reaches the stylesheet URL. */
export function applyFonts({ heading, body }) {
  const names = [...new Set([heading, body])].filter((n) => GOOGLE_FONTS[n])
  const href = `https://fonts.googleapis.com/css2?${names.map((n) => `family=${n.replace(/ /g, '+')}:wght@${GOOGLE_FONTS[n].replace(/;/g, ';')}`).join('&')}&display=swap`
  let link = document.getElementById('site-fonts')
  if (!link) { link = document.createElement('link'); link.id = 'site-fonts'; link.rel = 'stylesheet'; document.head.appendChild(link) }
  if (link.href !== href) link.href = href
  const root = document.documentElement.style
  if (GOOGLE_FONTS[heading]) root.setProperty('--font-heading', `'${heading}'`)
  if (GOOGLE_FONTS[body]) root.setProperty('--font-body', `'${body}'`)
}

function applyFavicon(url) {
  let l = document.querySelector('link[rel="icon"]')
  if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l) }
  if (url && /^https?:\/\//i.test(url) || url?.startsWith('data:image/')) { l.removeAttribute('type'); l.href = url } else { l.type = 'image/svg+xml'; l.href = '/favicon.svg' }
}

/** Pushes every owner setting that is not plain page content into the document (colours, fonts, favicon, currency). */
export function applySite(site) {
  applyTheme(site.theme)
  applyFonts(site.fonts)
  applyFavicon(site.favicon)
  setCurrency(site.currency)
}
