import crypto from 'node:crypto'

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}
export const badRequest = (m, e) => new ApiError(400, m, e)
export const unauthorized = (m = 'Please sign in to continue') => new ApiError(401, m)
export const forbidden = (m = 'You do not have permission to do that') => new ApiError(403, m)
export const notFound = (m = 'Not found') => new ApiError(404, m)
export const conflict = (m) => new ApiError(409, m)

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

export const slugify = (s = '') =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const escapeRegex = (s = '') => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex')
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// Unambiguous, unguessable public order id, e.g. MG7K3QX9PD2AH4TW8N
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const makeOrderId = () => {
  const b = crypto.randomBytes(14) // 14 chars of a 32-letter alphabet = 70 bits of entropy
  return 'MG' + Array.from(b, (x) => ALPHABET[x & 31]).join('')
}

export const isObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v))

/** Parse ?page & ?limit with sane bounds. */
export const paging = (q, defLimit = 20, maxLimit = 100) => {
  const page = Math.max(1, parseInt(q.page) || 1)
  const limit = Math.min(maxLimit, Math.max(1, parseInt(q.limit) || defLimit))
  return { page, limit, skip: (page - 1) * limit }
}
export const pageResult = (items, total, page, limit) => ({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) })
