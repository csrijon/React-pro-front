import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { config } from './config/env.js'
import { sanitize, errorHandler, notFoundHandler, uploadRoot } from './middleware/index.js'
import authRoutes from './routes/auth.js'
import catalogRoutes from './routes/catalog.js'
import contentRoutes from './routes/content.js'
import shopRoutes, { razorpayWebhook } from './routes/shop.js'
import userRoutes from './routes/users.js'
import adminRoutes from './routes/admin.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', config.trustProxy) // set TRUST_PROXY=1 behind nginx / a load balancer

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // uploads are loaded by the storefront on another origin
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: 'no-referrer' },
  }))
  app.use(cors({
    origin(origin, cb) {
      if (!origin || config.clientUrls.includes(origin)) return cb(null, true) // non-browser clients have no Origin
      cb(null, false)
    },
    credentials: true,
    maxAge: 86400,
  }))
  app.use(compression())
  if (!config.isTest) app.use(morgan(config.isProd ? 'combined' : 'dev'))

  // health (used by Docker / load balancers) - before rate limiting
  app.get('/health', (_req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'degraded', uptime: Math.round(process.uptime()) }))

  // Razorpay webhook needs the raw body, so it is mounted before express.json()
  app.post('/api/webhooks/razorpay', ...razorpayWebhook)

  app.use(express.json({ limit: '1mb' }))
  app.use(sanitize)
  app.use('/uploads', express.static(uploadRoot, { maxAge: '30d', immutable: true, index: false, setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      // even if a malicious file slipped through, the browser may not run anything from it
      res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox")
    } }))

  app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false, skip: () => config.isTest, message: { message: 'Too many requests. Please slow down.' } }))
  // abuse brakes on write endpoints that anyone (including guests) can call
  const writeLimit = (max, windowMs) => rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false, skip: () => config.isTest, message: { message: 'Too many requests. Please try again later.' } })
  app.post('/api/orders', writeLimit(30, 60 * 60 * 1000))
  app.post('/api/products/:slug/reviews', writeLimit(20, 60 * 60 * 1000))
  // user-specific data must never be stored by browsers or shared caches
  app.use(['/api/auth', '/api/users', '/api/admin', '/api/orders', '/api/cart', '/api/wishlist'], (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next() })
  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api', catalogRoutes)
  app.use('/api', contentRoutes)
  app.use('/api', shopRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
