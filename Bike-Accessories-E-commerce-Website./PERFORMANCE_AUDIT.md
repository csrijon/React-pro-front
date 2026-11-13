# MotoGear - Performance Audit & Tracker

Method: Lighthouse 12 (Chrome headless) against the **real production stack** (the nginx Docker image + the API, same code path as deployment), 8 route templates × mobile (simulated slow 4G, 4× CPU) and desktop. Baseline and final runs used identical data (52 products). API load tests used `autocannon` (50 connections). Single Lighthouse runs vary by roughly ±0.2 s; the A/B in item F-08 used 3 runs per variant.
Nothing here was measured on real-user traffic: add field data (CrUX / RUM) once the site is live.

## 1. Inventory (what was covered)
| Area | Items | Verified |
|---|---|---|
| Storefront routes | home, shop, category, product, cart, checkout, order-success, login, register, forgot/reset, about, contact, blog (+detail), brands (+detail), faq, 4 policy pages, 404 | 8 templates Lighthouse-audited (mobile+desktop); all routes smoke-tested in browser |
| Account | dashboard, profile (+2FA), orders (+detail), wishlist, addresses | functional E2E |
| Admin | dashboard, orders (+detail), products, categories, brands, customers, reviews, coupons, blogs, FAQs, testimonials, messages, subscribers, audit log, security | dashboard/orders/products functionally verified; all list routes load; tables are server-paginated |
| API | catalogue, auth, 2FA, cart/wishlist, orders, payments/webhook, admin CRUD, uploads | 38 automated tests + load tests |
| Database | 12 collections, 16 product indexes | `explain()` on 5,000 products |
| Infra | nginx (headers, caching, gzip), Docker, compose | headers/caching verified on running container |

Not covered: Razorpay live payments, real CDN/HTTPS behaviour, real-device testing, multi-instance deployments, Brotli (nginx image has no module; put a CDN such as Cloudflare in front to get Brotli/HTTP3).

## 2. Results - frontend (Lighthouse, production build)
**Mobile (slow 4G, 4× CPU)**
| Page | Perf | A11y | FCP | LCP | CLS | Transfer |
|---|---|---|---|---|---|---|
| Home | 75 → **77** | 90 → **100** | 3.0 → 3.2 s | 5.1 → **4.7 s** | 0 → 0.001 | 735 → **423 KB** |
| Shop | 89 → 82 | 91 → **96** | 2.8 → 3.0 s | 3.2 → 4.0 s | 0 → 0 | 615 → **375 KB** |
| Product | 86 → 78 | 91 → **97** | 3.0 → 3.2 s | 3.5 → 4.5 s | 0.001 → 0 | 645 → **398 KB** |
| Category | 75 → **80** | 92 → **97** | 2.8 → 3.1 s | 5.4 → **4.3 s** | 0.015 → 0.001 | 720 → **425 KB** |
| About | 69 → **80** | 91 → **100** | 2.8 → 2.9 s | 5.9 → **4.4 s** | **0.14 → 0.001** | 970 → **561 KB** |
| Blog | 78 → **82** | 91 → **100** | 2.8 → 2.9 s | 4.8 → **4.0 s** | 0.001 → 0.001 | 934 → **647 KB** |
| Login | 91 → 83 | 89 → **100** | 2.7 → 3.0 s | 2.9 → 3.9 s | 0 → 0.001 | 778 → **441 KB** |

**Desktop:** 93–99 on every page (was 90–99), LCP **0.8–1.1 s**, CLS **0.00** everywhere (was up to 0.153), accessibility **93–100**.

**Honest summary.** Page weight is down ~40%, layout shift is eliminated, accessibility is ~100, desktop is excellent, and image-led pages (home, category, about, blog) are faster on mobile. **Text-led pages (shop, product, login) are ~0.8-1.0 s *slower* on simulated mobile than at baseline, and mobile LCP is still above the 2.5 s target everywhere.** The remaining cost is structural: this is a client-rendered React app, so the first screen cannot paint until ~127 KB (gzip) of JavaScript has downloaded and executed on a throttled CPU. See "Next steps".
Mobile Best Practices shows 93 on shop/category in the final run only because the test database contained a product with an `http://localhost` upload URL that the Content-Security-Policy correctly blocked (test artefact, not an app defect).

## 3. Results - API and database
| Measure | Before | After |
|---|---|---|
| `GET /products?limit=12`, 50 concurrent | 462 req/s, p50 107 ms, p99 239 ms | **7,079 req/s, p50 6 ms, p99 12 ms** |
| product detail | 1,718 req/s, p50 28 ms | **8,204 req/s, p50 5 ms** |
| product list payload | 16.3 KB | **7.8 KB** (−52%), 1.7 KB gzipped |
| default listing, 5,000 products | scanned 4,852 docs + in-memory sort | **12 index keys, no sort** |
| category + popular | 588 docs | 12 |
| price range + popular | 1,443 docs | 37 |
| catalogue p99 while 4 logins/s | 209 ms (max 362 ms) | event loop no longer blocked (native bcrypt) |
Cache-off throughput with indexes + slim payloads: 535 req/s (list). The big gain is the response cache (+ ETag/304), which is invalidated on every admin write, order, cancellation and review.
Note: `categories`/`facets` aggregate over all products on a cache miss (~120 ms at 5,000 products); at >50k products add precomputed counts. Free-text search is an unanchored regex (fine to ~50k products; use Atlas Search beyond that).

## 4. Tracker
| ID | Component | Issue (evidence) | Action | Files | Verification | Result | Status | Risk |
|---|---|---|---|---|---|---|---|---|
| F-01 | Fonts | Google Fonts CSS render-blocking (~940 ms) + 3rd-party connection | Self-host Inter (variable) + Poppins woff2, size-matched fallbacks, 1-year immutable cache | `public/fonts`, `index.css`, `index.html`, nginx | Lighthouse render-blocking audit; build budget test | blocking request removed; CLS 0.14→0.001 | verified | low |
| F-02 | Home LCP image | late discovery (1.26 s), 1600 px JPEG on phones | Self-hosted AVIF/WebP (8-33 KB), `srcset`, `fetchpriority`, preload via `home.html`; carousel autoplay only after load | `Hero.jsx`, `public/img`, `scripts/postbuild.mjs`, nginx | Lighthouse | 49-190 KB → 8-33 KB; home LCP 5.1→4.7 s | verified | low |
| F-03 | Footer image | 126 KB JPEG downloaded on every page | lazy 45 KB WebP `<img>` | `Footer.jsx` | network log | −126 KB/page | verified | low |
| F-04 | Layout shift | footer jumped while content loaded (CLS up to 0.153); font swap | `main { min-height:100vh }`, metric-matched fallbacks | `MainLayout.jsx`, `index.css` | Lighthouse desktop+mobile | CLS → 0.000-0.001 | verified | low |
| F-05 | JS | framer-motion engine + axios in critical bundle | `LazyMotion` (loaded after page load), CSS reveals, replace axios with 2 KB fetch client (+dedupe, 20 s public GET cache) | `App.jsx`, `Reveal.jsx`, `api.js`, 24 files | build sizes; browser E2E of all flows | critical JS ~180 → 127 KB gz | verified | medium (HTTP client rewritten; E2E-tested) |
| F-06 | Home DOM/requests | all sections fetched/rendered at load | `LazySection` (mount near viewport, 6 s safety fallback) | `Home.jsx`, `LazySection.jsx` | browser | 9 → 2 API calls at load | verified | low |
| F-07 | Accessibility | contrast 4.22:1, ARIA, heading order, 8 px tap targets | `brand-solid`/`brand-light` tones, `role="img"`, h2 headings, 24 px dots | tailwind, 30+ components | Lighthouse a11y | 87-92 → 93-100 | verified | low |
| F-08 | Inline CSS / route preloads | hypothesis: save a round trip | A/B, 27 runs | `postbuild.mjs` (opt-in flags) | medians equal (±0.15 s); preloads slightly worse | **rejected**, off by default | verified | none |
| B-01 | DB indexes | in-memory sorts, full scans (5,000 docs) | 11 compound product indexes + order/review/message indexes, `npm run db:sync-indexes` | `models/index.js`, `syncIndexes.js` | `explain()` before/after; test asserts no SORT stage | see §3 | verified | low-medium: run sync once on existing DBs |
| B-02 | API caching | every request re-queried + re-serialised + re-gzipped | in-memory micro-cache (pre-gzipped, ETag/304), cleared on writes; `no-store` on all private routes | `middleware/cache.js`, routes | 8 tests incl. freshness, privacy, invalidation | 15× throughput | verified | low (≤15 s staleness across multiple instances) |
| B-03 | Payload | long fields in list responses | `-description -specs -features` for cards | `catalog.js` | test + size | −52% | verified | low |
| B-04 | Auth CPU | bcryptjs blocked event loop (p99 209 ms) | native `bcrypt` (hashes compatible) | auth/users/seed | load test, legacy hash verify | blocking removed | verified | low |
| I-01 | nginx | header inheritance bug, version leak, no font/img cache | shared header snippets, non-root, read-only | `deploy/*`, `Dockerfile` | curl on running container | verified | low |
| G-01 | Guardrails | none | `perf:budget` script, Lighthouse CI config, GitHub Actions workflow | `scripts/check-budgets.mjs`, `lighthouserc.json`, `.github/workflows/ci.yml` | budget run passes locally | - | verified (CI not yet run on GitHub) | - |
| O-01 | Mobile LCP on text pages | JS download+execute before first paint | **open** | - | - | - | pending | see below |

## 5. Next steps (not done)
1. **Prerender / SSR the first screen** (biggest remaining win; expected mobile FCP/LCP well under 2.5 s). Options: build-time prerender of the public routes with hydration, or Next.js/Remix. This is an architectural change, so it was not done unprompted.
2. Replace `react-dom` with Preact/compat (~50 KB gzip less) - high payoff, needs compatibility testing with framer-motion/react-router.
3. Server-resize admin uploads into responsive WebP/AVIF variants (uploads are currently served as-is).
4. Put a CDN (Brotli, HTTP/3, edge caching of `/api/products*`) in front; collect real-user Core Web Vitals.
5. Admin tables: virtualise only if page sizes grow (currently 15 rows, server-paginated).

## 6. Release & rollback
- Frontend: static build; roll back by redeploying the previous image/commit. No data migration.
- Backend: run `npm run db:sync-indexes` once (drops 8 superseded single-field indexes, adds compound ones; online build on MongoDB ≥4.2). To roll back, redeploy the old API and run its `db:sync-indexes`.
- Set `RESPONSE_CACHE_TTL=0` to disable the API cache instantly if you ever need to.
- Nothing was deployed, merged or applied to any production data by this work.
