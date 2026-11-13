// Runs after `vite build`:
//  1. Inline the main stylesheet into index.html. The app is client-rendered, so a separate <link rel=stylesheet>
//     is a render-blocking round trip (~0.6 s on slow mobile networks); inlined CSS (~11 KB gzipped) removes it.
//     index.html is served with ETag revalidation (Cache-Control: no-cache), so repeat visits are cheap 304s.
//  2. Write dist/home.html = index.html + a preload for the hero (LCP) image. The SPA only discovers that image
//     after JavaScript runs; nginx serves home.html for "/" only, so no other route pays for the preload.
import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_tag, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8')
  if (css.includes('</style')) throw new Error('refusing to inline CSS containing </style')
  console.log(`postbuild: inlined ${href} (${(css.length / 1024).toFixed(1)} KB)`)
  return `<style>${css}</style>`
})
fs.writeFileSync(path.join(dist, 'index.html'), html)

const WIDTHS = [480, 800, 1200, 1600]
const set = WIDTHS.map((w) => `/img/hero-ducati-${w}-v1.avif ${w}w`).join(', ')
const preload = `    <link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesrcset="${set}" imagesizes="(min-width: 1024px) 62vw, 100vw" />\n`
if (!html.includes('</head>')) throw new Error('index.html has no </head>')
fs.writeFileSync(path.join(dist, 'home.html'), html.replace('</head>', `${preload}  </head>`))
console.log('postbuild: wrote dist/home.html with hero preload')
