// Performance budgets for the production build. Run after `npm run build`:  npm run perf:budget
// Fails (exit 1) when a budget is exceeded so regressions are caught in CI before they ship.
// Budgets include headroom over today's values (see PERFORMANCE_AUDIT.md); tighten them as you improve.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const dist = path.resolve('dist')
const gz = (file) => zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length
const kb = (n) => (n / 1024).toFixed(1)
const failures = []
const check = (label, value, max, unit = 'KB') => {
  const ok = value <= max
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(46)} ${kb(value).padStart(7)} ${unit} (budget ${kb(max)})`)
  if (!ok) failures.push(label)
}

if (!fs.existsSync(path.join(dist, 'index.html'))) { console.error('dist/ not found - run `npm run build` first'); process.exit(1) }
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite', 'manifest.json'), 'utf8'))

// JavaScript needed to render the first screen = the entry chunk + everything it statically imports
const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry)
const critical = new Set()
const walk = (key) => { if (critical.has(key)) return; critical.add(key); for (const i of manifest[key].imports || []) walk(i) }
walk(entryKey)
const criticalJs = [...critical].reduce((sum, k) => sum + gz(path.join(dist, manifest[k].file)), 0)
check('critical JavaScript (gzip, entry + static imports)', criticalJs, 150 * 1024)
check('entry chunk (gzip)', gz(path.join(dist, manifest[entryKey].file)), 100 * 1024)

const cssFiles = fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.css'))
check('total CSS (gzip)', cssFiles.reduce((s, f) => s + gz(path.join(dist, 'assets', f)), 0), 16 * 1024)

const biggestLazy = Object.values(manifest).filter((e) => !critical.has(Object.keys(manifest).find((k) => manifest[k] === e)) && e.file.endsWith('.js'))
  .reduce((m, e) => Math.max(m, gz(path.join(dist, e.file))), 0)
check('largest lazy chunk (gzip)', biggestLazy, 45 * 1024)
check('index.html size', Buffer.byteLength(html), 8 * 1024)

// hero (LCP) images: the smallest variant is what phones download
for (const f of ['hero-ducati-480-v1.avif', 'hero-ducati-1600-v1.avif']) check(`hero image ${f}`, fs.statSync(path.join(dist, 'img', f)).size, f.includes('480') ? 16 * 1024 : 60 * 1024)

// structural guarantees
const must = (label, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`); if (!ok) failures.push(label) }
must('no third-party font CSS (Google Fonts)', !/fonts\.googleapis|fonts\.gstatic/.test(html))
must('no render-blocking third-party scripts', !/<script[^>]+src="https?:\/\//.test(html))
must('home.html variant preloads the hero image', fs.existsSync(path.join(dist, 'home.html')) && /rel="preload" as="image"/.test(fs.readFileSync(path.join(dist, 'home.html'), 'utf8')))
must('axios is not bundled', ![...Object.keys(manifest)].some((k) => /axios/i.test(k)))
const fontFiles = fs.readdirSync(path.join(dist, 'fonts'))
must('fonts are self-hosted woff2 (versioned names)', fontFiles.filter((f) => /-v\d+\.woff2$/.test(f)).length >= 5)

if (failures.length) { console.error(`\n${failures.length} performance budget(s) failed:\n - ${failures.join('\n - ')}`); process.exit(1) }
console.log('\nAll performance budgets passed.')
