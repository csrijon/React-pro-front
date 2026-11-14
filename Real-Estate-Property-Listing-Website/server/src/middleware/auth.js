import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { HttpError, wrap } from '../utils/asyncHandler.js'

export const signToken = (user) => jwt.sign({ sub: String(user._id) }, env.jwtSecret, { expiresIn: env.jwtExpires })

async function resolve(req) {
  const h = req.headers.authorization || ''
  if (!h.startsWith('Bearer ')) return null
  try {
    const { sub } = jwt.verify(h.slice(7), env.jwtSecret)
    const u = await User.findById(sub)
    return u && u.status === 'Active' ? u : null
  } catch { return null }
}

/** Attaches req.user when a valid token is present; never rejects. */
export const optionalAuth = wrap(async (req, _res, next) => { req.user = await resolve(req); next() })
/** Requires a valid token. */
export const requireAuth = wrap(async (req, _res, next) => { req.user = await resolve(req); if (!req.user) throw new HttpError(401, 'Please log in to continue'); next() })
/** Requires one of the given roles (after requireAuth). */
export const requireRole = (...roles) => [requireAuth, (req, _res, next) => (roles.includes(req.user.role) ? next() : next(new HttpError(403, 'You do not have permission to do that')))]

export const STAFF = ['admin', 'editor']
export const isStaff = (u) => !!u && STAFF.includes(u.role)
