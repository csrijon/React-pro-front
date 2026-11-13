import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { ZodError } from 'zod'
import { config } from '../config/env.js'
import { ApiError, unauthorized, forbidden, badRequest } from '../utils/helpers.js'
import { User, AuditLog } from '../models/index.js'

// ---------- auth ----------
const readToken = (req) => {
  const h = req.headers.authorization || ''
  return h.startsWith('Bearer ') ? h.slice(7) : null
}

async function resolveUser(req) {
  const token = readToken(req)
  if (!token) return null
  let payload
  try {
    // algorithm pinned (blocks "alg: none" / key-confusion tricks); audience separates sessions from 2FA challenges
    payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'], issuer: ISSUER, audience: 'session' })
  } catch {
    throw unauthorized('Your session has expired. Please sign in again.')
  }
  const user = await User.findById(payload.sub)
  if (!user) throw unauthorized('Account not found')
  if (user.isBlocked) throw forbidden('This account has been suspended. Contact support.')
  if ((payload.tv ?? 0) !== (user.tokenVersion ?? 0)) throw unauthorized('Your session was ended. Please sign in again.')
  // tokens issued before a password change are invalid
  if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime() - 1000) throw unauthorized('Password changed. Please sign in again.')
  return user
}

export const optionalAuth = async (req, _res, next) => {
  try { req.user = await resolveUser(req) } catch (e) { return next(e) }
  next()
}
export const requireAuth = async (req, _res, next) => {
  try {
    req.user = await resolveUser(req)
    if (!req.user) throw unauthorized()
  } catch (e) { return next(e) }
  next()
}
export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') return next(forbidden('Admin access required'))
  if (config.requireAdmin2fa && !req.user.twoFactor?.enabled) {
    const err = forbidden('Two-factor authentication is required for admin accounts. Enable it under Admin > Security.')
    err.code = '2FA_REQUIRED'
    return next(err)
  }
  next()
}

const ISSUER = 'motogear-api'
// admins get a shorter session than shoppers
export const signToken = (user) =>
  jwt.sign({ sub: user.id, tv: user.tokenVersion ?? 0 }, config.jwtSecret, { algorithm: 'HS256', issuer: ISSUER, audience: 'session', expiresIn: user.role === 'admin' ? '8h' : config.jwtExpiresIn })
// short-lived proof that the password step succeeded; useless as a session token
export const signChallenge = (user) => jwt.sign({ sub: user.id, tv: user.tokenVersion ?? 0 }, config.jwtSecret, { algorithm: 'HS256', issuer: ISSUER, audience: '2fa', expiresIn: '5m' })
export const verifyChallenge = (token) => jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'], issuer: ISSUER, audience: '2fa' })

/** Security / admin activity trail. Never throws and never stores request bodies (they may contain secrets). */
export const audit = (req, action, target, status, actor = req.user) =>
  AuditLog.create({ actor: actor?._id, actorEmail: actor?.email, ip: req.ip, userAgent: String(req.headers['user-agent'] || '').slice(0, 200), action, target, status }).catch(() => {})

// ---------- validation ----------
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const r = schema.safeParse(req[source])
  if (!r.success) {
    const errors = Object.fromEntries(r.error.issues.map((i) => [i.path.join('.') || '_', i.message]))
    return next(new ApiError(422, r.error.issues[0].message, errors))
  }
  req[source] = r.data
  next()
}

// ---------- NoSQL-injection guard (strips $-operators and dotted keys) ----------
const clean = (obj) => {
  if (Array.isArray(obj)) return obj.map(clean)
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (k.startsWith('$') || k.includes('.')) delete obj[k]
      else obj[k] = clean(obj[k])
    }
  }
  return obj
}
export const sanitize = (req, _res, next) => {
  if (req.body) clean(req.body)
  if (req.params) clean(req.params)
  // req.query is a getter in newer Express; mutate in place
  if (req.query) clean(req.query) // nested operators too, e.g. ?status[$ne]=x
  next()
}

// ---------- uploads ----------
export const uploadRoot = path.resolve(config.uploadDir)
fs.mkdirSync(uploadRoot, { recursive: true })
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }
export const upload = multer({
  storage: multer.diskStorage({
    destination: uploadRoot,
    filename: (_req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + EXT[file.mimetype]),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => (EXT[file.mimetype] ? cb(null, true) : cb(badRequest('Only JPG, PNG or WebP images are allowed'))),
})

// ---------- errors ----------
export const notFoundHandler = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let status = err.status || 500
  let message = err.message
  let errors = err.errors

  if (err instanceof ZodError) { status = 422; message = err.issues[0].message }
  else if (err.name === 'ValidationError') { // mongoose
    status = 422
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]))
    message = Object.values(errors)[0]
  } else if (err.name === 'CastError') { status = 400; message = 'Invalid identifier' }
  else if (err.code === 11000) { status = 409; message = `${Object.keys(err.keyPattern || {})[0] || 'Value'} already exists` }
  else if (err.name === 'MulterError') { status = 400; message = err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large (max 5 MB)' : err.message }
  else if (err.type === 'entity.parse.failed') { status = 400; message = 'Malformed JSON body' }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err)
    if (config.isProd) message = 'Something went wrong on our side. Please try again.'
  }
  res.status(status).json({ message, ...(errors ? { errors } : {}) })
}
