// Runs after `vite build`:
//  1. ALWAYS: write dist/home.html = index.html + a preload for the hero (LCP) image. The SPA only discovers that
//     image after JavaScript runs; nginx serves home.html for "/" only. (Measured: removes ~1 s of image discovery delay.)
//  2. OPT-IN (INLINE_CSS=1): inline the stylesheet into the HTML.
//  3. OPT-IN (ROUTE_PRELOAD=1): per-route HTML variants preloading each route's JS chunks.
//     Both opt-ins showed no gain in A/B testing, see PERFORMANCE_AUDIT.md.
import fs from 'node:fs'
import path from 'node:path'

// Both are OFF by default: a controlled A/B (27 Lighthouse runs, slow-4G mobile) showed no measurable benefit from either,
// and preloading many chunks made first paint slightly worse. Kept as opt-in switches for re-testing on your own traffic.
const INLINE_CSS = process.env.INLINE_CSS === '1' // inline the main stylesheet into the HTML
const ROUTE_PRELOAD = process.env.ROUTE_PRELOAD === '1' // write one HTML variant per route that preloads its JS chunks
const dist = path.resolve('dist')
const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite', 'manifest.json'), 'utf8'))
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

if (INLINE_CSS) html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_tag, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8')
  if (css.includes('</style')) throw new Error('refusing to inline CSS containing </style')
  console.log(`postbuild: inlined ${href} (${(css.length / 1024).toFixed(1)} KB)`)
  return `<style>${css}</style>`
})
fs.writeFileSync(path.join(dist, 'index.html'), html)

// chunks the entry already loads (they are already <link rel=modulepreload> in index.html)
const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry)
const collect = (key, seen = new Set()) => {
  const e = manifest[key]
  if (!e || seen.has(key)) return seen
  seen.add(key)
  for (const imp of e.imports || []) collect(imp, seen)
  return seen
}
const already = new Set([...collect(entryKey)].map((k) => manifest[k].file))

// route variant -> page module. Keep in sync with the locations in deploy/nginx.conf.template.
const ROUTES = {
  'home.html': 'src/pages/Home/Home.jsx', 'shop.html': 'src/pages/Shop/Shop.jsx', 'category.html': 'src/pages/Category/Category.jsx',
  'product.html': 'src/pages/ProductDetails/ProductDetails.jsx', 'cart.html': 'src/pages/Cart/Cart.jsx', 'login.html': 'src/pages/Authentication/Login.jsx',
  'register.html': 'src/pages/Authentication/Register.jsx', 'about.html': 'src/pages/About/About.jsx', 'blog.html': 'src/pages/Blog/Blog.jsx',
  'brands.html': 'src/pages/Brands/Brands.jsx', 'contact.html': 'src/pages/Contact/Contact.jsx',
}
const HERO_WIDTHS = [480, 800, 1200, 1600]
const heroSet = HERO_WIDTHS.map((w) => `/img/hero-ducati-${w}-v1.avif ${w}w`).join(', ')

if (!html.includes('</head>')) throw new Error('index.html has no </head>')
for (const [file, src] of Object.entries(ROUTES)) {
  if (!ROUTE_PRELOAD && file !== 'home.html') continue // no extra content to add: index.html already serves these routes
  if (!manifest[src]) { console.warn(`postbuild: ${src} not in manifest, skipping ${file}`); continue }
  const chunks = ROUTE_PRELOAD ? [...collect(src)].map((k) => manifest[k].file).filter((f) => !already.has(f)) : []
  let extra = chunks.map((f) => `    <link rel="modulepreload" crossorigin href="/${f}" />\n`).join('')
  if (file === 'home.html') extra += `    <link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${heroSet}" imagesizes="(min-width: 1024px) 62vw, 100vw" />\n`
  fs.writeFileSync(path.join(dist, file), html.replace('</head>', `${extra}  </head>`))
}
console.log(`postbuild: wrote ${ROUTE_PRELOAD ? Object.keys(ROUTES).length : 1} HTML variant(s)`)
