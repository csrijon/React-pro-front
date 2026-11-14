import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { notFound, errorHandler } from './middleware/errors.js'
import auth from './routes/auth.js'
import properties from './routes/properties.js'
import projects from './routes/projects.js'
import team from './routes/team.js'
import activity from './routes/activity.js'
import me from './routes/me.js'
import admin from './routes/admin.js'
import content from './routes/content.js'
import activityLog from './routes/activityLog.js'
import uploads, { uploadDir } from './routes/uploads.js'

export const app = express()
app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: (o, cb) => cb(null, !o || env.clientUrls.includes(o)), credentials: true }))
app.use(compression())
app.use(express.json({ limit: '200kb' }))
if (!env.prod) app.use(morgan('dev'))

const limiter = (windowMs, max, message) => rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false, message: { message } })
app.use('/api', limiter(15 * 60 * 1000, 600, 'Too many requests. Please slow down.'))
// Strict limit only on endpoints that can be guessed against; /auth/me (called on every page load) is covered by the general limit.
const authLimit = limiter(15 * 60 * 1000, 30, 'Too many attempts. Try again in a few minutes.')
for (const p of ['/login', '/register', '/forgot-password', '/reset-password']) app.post(`/api/auth${p}`, authLimit)
for (const p of ['/inquiries', '/appointments', '/newsletter', '/property-submissions', '/uploads', '/reviews']) app.post(`/api${p}`, limiter(60 * 60 * 1000, 40, 'Too many submissions. Please try again later.'))

app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }))
app.get('/api/health', (_q, res) => res.json({ ok: true }))
app.use('/api/auth', auth)
app.use('/api/properties', properties)
app.use('/api/projects', projects)
app.use('/api/uploads', uploads)
app.use('/api/me', me)
app.use('/api', activityLog)
app.use('/api', team)
app.use('/api', content)
app.use('/api', activity)
app.use('/api', admin)
app.use(notFound)
app.use(errorHandler)
