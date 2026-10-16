import { Router } from 'express'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { getWeather } from '../weather.js'

const seedPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'kb', 'seed.json')
const seed = JSON.parse(readFileSync(seedPath, 'utf8'))

export function metaRouter({ config, provider }) {
  const router = Router()

  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'bengali-crop-advisory-api',
      version: '0.1.0',
      provider: provider.name,
      demo_mode: Boolean(provider.isMock),
      uptime_s: Math.round(process.uptime()),
    })
  })

  // Public view of the knowledge base (same data the agent retrieves from).
  router.get('/crop-guide', (req, res) => {
    res.json({
      count: seed.entries.length,
      disclaimer:
        'ডেমো জ্ঞানভাণ্ডার — প্রতিটি এন্ট্রি বিশেষজ্ঞ যাচাইয়ের অপেক্ষায় (needs_review)।',
      entries: seed.entries.map((e) => ({
        id: e.id,
        title_bn: e.title_bn,
        title_en: e.title_en,
        summary_bn: e.summary_bn,
        body_bn: e.body_bn,
        caution_bn: e.caution_bn,
        crops: e.crops,
        topics: e.topics,
        publisher: e.publisher,
        url: e.url,
        reviewed_date: e.reviewed_date,
        needs_review: e.needs_review,
      })),
    })
  })

  router.get('/weather', async (req, res) => {
    res.json(await getWeather(config))
  })

  return router
}
