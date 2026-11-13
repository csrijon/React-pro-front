import { Router } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import { User } from '../models/index.js'
import { requireAuth, signToken, signChallenge, verifyChallenge, validate, audit } from '../middleware/index.js'
import { asyncHandler, conflict, unauthorized, forbidden, badRequest, randomToken, sha256, ApiError } from '../utils/helpers.js'
import { sendMail, html } from '../utils/mailer.js'
import { newSecret, otpauthUrl, verifyTotp } from '../utils/totp.js'
import { encrypt, decrypt } from '../utils/crypto.js'
import { config } from '../config/env.js'

const r = Router()

const limiter = (max) =>
  rateLimit({ windowMs: 15 * 60 * 1000, max, standardHeaders: true, legacyHeaders: false, skip: () => config.isTest, message: { message: 'Too many attempts. Please try again in a few minutes.' } })

// Passwords that appear in every breach list - rejected even if they satisfy the letters+numbers rule
const COMMON = new Set(['password1', 'password12', 'password123', 'password1234', 'qwerty123', 'qwerty1234', 'qwertyuiop1', 'abc12345', 'abcd1234', 'iloveyou1', 'welcome1', 'welcome123', 'admin123', 'admin1234', 'admin12345', 'letmein123', 'monkey123', 'dragon123', 'football1', 'baseball1', 'superman1', 'princess1', 'sunshine1', 'passw0rd', 'p@ssw0rd1', 'changeme1', 'motogear1', 'motogear123', 'bike12345', 'rider12345', '12345678a', 'a1234567', '1q2w3e4r', 'test12345', 'demo@1234'])
export const passwordRule = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Use at least 8 characters')
  .max(72, 'Password is too long')
  .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), 'Include letters and numbers')
  .refine((v) => !COMMON.has(v.toLowerCase()), 'That password is too common. Choose something harder to guess.')

const phoneRule = z.string().trim().regex(/^(\+?91)?[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')

const register = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: phoneRule.optional().or(z.literal('')),
  password: passwordRule,
})
const login = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address'), password: z.string().min(1, 'Password is required').max(200) })

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12)
const MAX_FAILS = 5
const LOCK_MS = 15 * 60 * 1000

// ---------- account lockout (per account, on top of per-IP rate limits) ----------
const isLocked = (u) => u.lockUntil && u.lockUntil > new Date()
const lockMessage = (u) => `Too many failed attempts. Try again in ${Math.max(1, Math.ceil((u.lockUntil - Date.now()) / 60000))} minute(s).`
async function recordFailure(req, user, why) {
  user.failedLogins = (user.failedLogins || 0) + 1
  if (user.failedLogins >= MAX_FAILS) {
    user.lockUntil = new Date(Date.now() + LOCK_MS)
    user.failedLogins = 0
    audit(req, 'auth.account_locked', user.email, 423, user)
  }
  await user.save()
  audit(req, `auth.${why}`, user.email, 401, user)
}
const clearFailures = async (user) => {
  if (user.failedLogins || user.lockUntil) { user.failedLogins = 0; user.lockUntil = undefined }
  user.lastLoginAt = new Date()
  await user.save()
}

r.post('/register', limiter(20), validate(register), asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body
  if (await User.exists({ email })) throw conflict('An account with this email already exists')
  // role is NEVER taken from the request: registration always creates a customer
  const user = await User.create({ name, email, phone: phone || '', password: await bcrypt.hash(password, 12), role: 'user', lastLoginAt: new Date() })
  sendMail({ to: email, subject: 'Welcome to MotoGear', html: html(`Welcome, ${name.split(' ')[0]}!`, '<p>Your account is ready. Gear up and ride on.</p>'), text: 'Welcome to MotoGear!' })
  res.status(201).json({ token: signToken(user), user })
}))

r.post('/login', limiter(20), validate(login), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password')
  if (user && isLocked(user)) throw new ApiError(429, lockMessage(user))
  // always run a bcrypt compare so timing does not reveal whether the email exists
  const ok = await bcrypt.compare(req.body.password, user?.password || DUMMY_HASH)
  if (!user || !ok) {
    if (user) await recordFailure(req, user, 'login_failed')
    throw unauthorized('Invalid email or password')
  }
  if (user.isBlocked) throw forbidden('This account has been suspended. Contact support.')
  if (user.twoFactor?.enabled) {
    // password OK, now prove possession of the authenticator. Nothing is granted yet.
    return res.json({ requires2fa: true, challenge: signChallenge(user) })
  }
  await clearFailures(user)
  audit(req, 'auth.login', user.email, 200, user)
  res.json({ token: signToken(user), user })
}))

// ---------- second step of login ----------
const hashCode = (c) => sha256(`recovery:${String(c).replace(/[^a-z0-9]/gi, '').toLowerCase()}`)
r.post('/2fa/login', limiter(20), validate(z.object({ challenge: z.string().min(20).max(2000), code: z.string().trim().min(6).max(20) })), asyncHandler(async (req, res) => {
  let payload
  try { payload = verifyChallenge(req.body.challenge) } catch { throw unauthorized('This sign-in attempt expired. Please enter your password again.') }
  const user = await User.findById(payload.sub).select('+twoFactor.secret +twoFactor.lastCounter +twoFactor.recoveryCodes')
  if (!user || !user.twoFactor?.enabled || (payload.tv ?? 0) !== (user.tokenVersion ?? 0)) throw unauthorized('This sign-in attempt is no longer valid.')
  if (user.isBlocked) throw forbidden('This account has been suspended. Contact support.')
  if (isLocked(user)) throw new ApiError(429, lockMessage(user))

  const code = req.body.code
  let accepted = false
  const counter = verifyTotp(decrypt(user.twoFactor.secret), code, { after: user.twoFactor.lastCounter || 0 })
  if (counter) {
    user.twoFactor.lastCounter = counter // a code works once
    accepted = true
  } else {
    const h = hashCode(code)
    if (user.twoFactor.recoveryCodes.includes(h)) { // single-use recovery code
      user.twoFactor.recoveryCodes = user.twoFactor.recoveryCodes.filter((x) => x !== h)
      accepted = true
      audit(req, 'auth.recovery_code_used', user.email, 200, user)
    }
  }
  if (!accepted) {
    await recordFailure(req, user, '2fa_failed')
    throw unauthorized('That code is not valid')
  }
  await clearFailures(user)
  audit(req, 'auth.login_2fa', user.email, 200, user)
  res.json({ token: signToken(user), user })
}))

r.get('/me', requireAuth, (req, res) => res.json({ user: req.user }))

// ---------- two-factor management (signed-in users) ----------
const strong = z.object({ code: z.string().trim().min(6).max(20) })
const verifyPassword = async (userId, password) => {
  const u = await User.findById(userId).select('+password')
  return u && (await bcrypt.compare(password || '', u.password))
}

r.post('/2fa/setup', requireAuth, limiter(20), validate(z.object({ password: z.string().min(1).max(200) })), asyncHandler(async (req, res) => {
  if (req.user.twoFactor?.enabled) throw conflict('Two-factor authentication is already enabled')
  if (!(await verifyPassword(req.user._id, req.body.password))) throw badRequest('Password is incorrect')
  const secret = newSecret()
  await User.updateOne({ _id: req.user._id }, { 'twoFactor.pendingSecret': encrypt(secret) })
  res.json({ secret, otpauthUrl: otpauthUrl(secret, req.user.email) })
}))

r.post('/2fa/enable', requireAuth, limiter(20), validate(strong), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+twoFactor.pendingSecret')
  if (!user.twoFactor?.pendingSecret) throw badRequest('Start the setup first')
  const counter = verifyTotp(decrypt(user.twoFactor.pendingSecret), req.body.code)
  if (!counter) throw badRequest('That code is not valid. Check the time on your phone and try again.')
  const codes = Array.from({ length: 8 }, () => `${randomToken(3)}-${randomToken(3)}`)
  user.twoFactor.secret = user.twoFactor.pendingSecret
  user.twoFactor.pendingSecret = undefined
  user.twoFactor.enabled = true
  user.twoFactor.lastCounter = counter
  user.twoFactor.recoveryCodes = codes.map(hashCode)
  await user.save()
  audit(req, 'auth.2fa_enabled', user.email, 200)
  res.json({ recoveryCodes: codes, user }) // shown once - only hashes are stored
}))

r.post('/2fa/disable', requireAuth, limiter(10), validate(z.object({ password: z.string().min(1).max(200), code: z.string().trim().min(6).max(20) })), asyncHandler(async (req, res) => {
  if (req.user.role === 'admin' && config.requireAdmin2fa) throw forbidden('Two-factor authentication is mandatory for admin accounts')
  if (!(await verifyPassword(req.user._id, req.body.password))) throw badRequest('Password is incorrect')
  const user = await User.findById(req.user._id).select('+twoFactor.secret +twoFactor.lastCounter +twoFactor.recoveryCodes')
  const ok = verifyTotp(decrypt(user.twoFactor.secret), req.body.code, { after: user.twoFactor.lastCounter || 0 }) || user.twoFactor.recoveryCodes.includes(hashCode(req.body.code))
  if (!ok) throw badRequest('That code is not valid')
  user.twoFactor = { enabled: false, recoveryCodes: [], lastCounter: 0 }
  user.tokenVersion = (user.tokenVersion || 0) + 1
  await user.save()
  audit(req, 'auth.2fa_disabled', user.email, 200)
  res.json({ token: signToken(user), user })
}))

// End every session on every device (this device gets a fresh token)
r.post('/logout-all', requireAuth, asyncHandler(async (req, res) => {
  req.user.tokenVersion = (req.user.tokenVersion || 0) + 1
  await req.user.save()
  audit(req, 'auth.logout_all', req.user.email, 200)
  res.json({ token: signToken(req.user), message: 'Signed out of all other devices' })
}))

// ---------- password reset ----------
r.post('/forgot-password', limiter(10), validate(z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address') })), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (user && !user.isBlocked) {
    const token = randomToken()
    user.passwordResetToken = sha256(token)
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()
    const link = `${config.clientUrls[0]}/reset-password?token=${token}`
    await sendMail({
      to: user.email, subject: 'Reset your MotoGear password',
      html: html('Reset your password', `<p>Click the button below within 1 hour to choose a new password.</p><p><a href="${link}" style="background:#ef252b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Reset password</a></p><p style="color:#a7adb5;font-size:12px">If you didn't request this, you can ignore this email.</p>`),
      text: `Reset your password: ${link}`,
    })
    audit(req, 'auth.reset_requested', user.email, 200, user)
  }
  // identical response either way: no account enumeration
  res.json({ message: 'If an account exists, a reset link has been sent.' })
}))

r.post('/reset-password', limiter(10), validate(z.object({ token: z.string().min(10).max(200), password: passwordRule })), asyncHandler(async (req, res) => {
  const user = await User.findOne({ passwordResetToken: sha256(req.body.token), passwordResetExpires: { $gt: new Date() } }).select('+password +passwordResetToken +passwordResetExpires')
  if (!user) throw badRequest('This reset link is invalid or has expired')
  user.password = await bcrypt.hash(req.body.password, 12)
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.passwordChangedAt = new Date()
  user.tokenVersion = (user.tokenVersion || 0) + 1 // every existing session is ended
  user.failedLogins = 0
  user.lockUntil = undefined
  await user.save()
  audit(req, 'auth.password_reset', user.email, 200, user)
  res.json({ message: 'Password updated successfully' })
}))

export default r
