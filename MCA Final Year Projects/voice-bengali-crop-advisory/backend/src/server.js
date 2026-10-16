import express from 'express'
import cors from 'cors'
import { requestLogger } from './logger.js'
import { adviceRouter } from './routes/advice.js'
import { metaRouter } from './routes/meta.js'

// App factory — everything the server needs is injected, which makes testing
// easy (tests can pass a fake provider and never touch the network).
export function createApp({ config, provider }) {
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json({ limit: '32kb' })) // request size limit
  app.use(cors({ origin: config.corsOrigin.split(',').map((s) => s.trim()) }))
  app.use(requestLogger())

  app.use('/api', metaRouter({ config, provider }))
  app.use('/api/advice', adviceRouter({ provider, config }))

  app.use((req, res) => {
    res.status(404).json({ error: 'not_found', message: 'Endpoint পাওয়া যায়নি।' })
  })

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err?.type === 'entity.too.large') {
      return res
        .status(413)
        .json({ error: 'payload_too_large', message: 'অনুরোধের মাপ খুব বেশি বড়।' })
    }
    if (err instanceof SyntaxError && 'body' in err) {
      return res
        .status(400)
        .json({ error: 'invalid_json', message: 'JSON ঠিকভাবে পাঠানো হয়নি।' })
    }
    console.error('[server] unhandled', err)
    return res
      .status(500)
      .json({ error: 'internal_error', message: 'সার্ভারে সমস্যা হয়েছে।' })
  })

  return app
}
