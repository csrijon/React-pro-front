import crypto from 'node:crypto'
import zlib from 'node:zlib'
import { config } from '../config/env.js'

/**
 * Micro-cache for PUBLIC, identical-for-everyone GET responses (catalogue, categories, blog...).
 *  - never used for anything user-specific (auth/cart/orders/admin are mounted without it)
 *  - stores the serialised JSON plus a pre-gzipped copy, so a hit costs almost no CPU
 *  - sends ETag + Cache-Control so browsers/CDNs revalidate cheaply (304)
 *  - cleared on every admin write, order/stock change and review (see clearPublicCache callers)
 * With several API instances each has its own copy: worst case a change is visible after `ttl` seconds.
 */
const store = new Map()
const MAX_ENTRIES = 500
const stats = { hits: 0, misses: 0 }

export const clearPublicCache = () => store.clear()
export const cacheStats = () => ({ ...stats, size: store.size })

export function publicCache({ browserSeconds = 30, swrSeconds = 120 } = {}) {
  return (req, res, next) => {
    const ttl = config.cacheTtl * 1000
    if (!ttl || req.method !== 'GET' || req.headers.authorization) return next() // authenticated requests are never cached

    const key = req.originalUrl
    const hit = store.get(key)
    if (hit && hit.exp > Date.now()) {
      stats.hits++
      return send(req, res, hit, browserSeconds, swrSeconds)
    }
    stats.misses++
    const origJson = res.json.bind(res)
    res.json = (obj) => {
      if (res.statusCode !== 200) return origJson(obj)
      const raw = Buffer.from(JSON.stringify(obj))
      const entry = { raw, gz: zlib.gzipSync(raw, { level: 6 }), etag: `W/"${crypto.createHash('sha1').update(raw).digest('base64url').slice(0, 27)}"`, exp: Date.now() + ttl }
      store.delete(key)
      store.set(key, entry)
      if (store.size > MAX_ENTRIES) store.delete(store.keys().next().value) // oldest out
      send(req, res, entry, browserSeconds, swrSeconds)
      return res
    }
    next()
  }
}

function send(req, res, entry, browserSeconds, swrSeconds) {
  res.setHeader('Cache-Control', `public, max-age=${browserSeconds}, stale-while-revalidate=${swrSeconds}`)
  res.setHeader('ETag', entry.etag)
  res.vary('Accept-Encoding')
  if (req.headers['if-none-match'] === entry.etag) return res.status(304).end()
  res.type('application/json')
  if (/\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    res.setHeader('Content-Encoding', 'gzip') // compression middleware leaves already-encoded bodies alone
    res.setHeader('Content-Length', entry.gz.length)
    return res.end(entry.gz)
  }
  res.setHeader('Content-Length', entry.raw.length)
  res.end(entry.raw)
}
