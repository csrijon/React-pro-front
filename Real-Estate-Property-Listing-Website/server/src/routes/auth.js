import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { z } from 'zod'
import { User } from '../models/User.js'
import { requireAuth, signToken } from '../middleware/auth.js'
import { HttpError, wrap } from '../utils/asyncHandler.js'
import { sendMail } from '../utils/mailer.js'
import { env } from '../config/env.js'
import { logActivity } from '../utils/activity.js'

const r = Router()
const email = z.string().trim().toLowerCase().email('Enter a valid email address')
const password = z.string().min(8, 'Password must be at least 8 characters').max(100).regex(/(?=.*\d)(?=.*[A-Za-z])/, 'Password must include letters and numbers')
const phone = z.string().trim().regex(/^[+\d][\d\s-]{7,14}$/, 'Enter a valid phone number').optional().or(z.literal(''))
const publicUser = (u) => ({ id: String(u._id), name: u.name, email: u.email, phone: u.phone, role: u.role })
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex')

r.post('/register', wrap(async (req, res) => {
  const d = z.object({ name: z.string().trim().min(2, 'Name is too short').max(80), email, password, phone }).parse(req.body)
  if (await User.exists({ email: d.email })) throw new HttpError(409, 'An account with this email already exists')
  const user = await User.create({ name: d.name, email: d.email, phone: d.phone, passwordHash: await bcrypt.hash(d.password, 12) })
  logActivity(req, { action: 'register', entity: 'User', entityId: user._id, label: user.email, summary: `${user.name} created an account`, actor: user })
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
}))

r.post('/login', wrap(async (req, res) => {
  const d = z.object({ email, password: z.string().min(1, 'Enter your password') }).parse(req.body)
  const user = await User.findOne({ email: d.email }).select('+passwordHash')
  const ok = user && (await bcrypt.compare(d.password, user.passwordHash))
  if (!ok) { logActivity(req, { action: 'login_failed', entity: 'Auth', label: d.email, summary: `Failed login attempt for ${d.email}`, actor: user || undefined }); throw new HttpError(401, 'Incorrect email or password') }
  if (user.status !== 'Active') throw new HttpError(403, 'This account is deactivated. Contact support.')
  if (user.role !== 'user') logActivity(req, { action: 'login', entity: 'Auth', entityId: user._id, label: user.email, summary: `${user.name} (${user.role}) logged in`, actor: user })
  res.json({ token: signToken(user), user: publicUser(user) })
}))

r.get('/me', requireAuth, (req, res) => res.json(publicUser(req.user)))

r.put('/me', requireAuth, wrap(async (req, res) => {
  const d = z.object({ name: z.string().trim().min(2).max(80), phone }).parse(req.body)
  req.user.name = d.name; req.user.phone = d.phone ?? ''
  await req.user.save(); res.json(publicUser(req.user))
}))

r.put('/password', requireAuth, wrap(async (req, res) => {
  const d = z.object({ currentPassword: z.string().min(1, 'Enter your current password'), newPassword: password }).parse(req.body)
  const u = await User.findById(req.user._id).select('+passwordHash')
  if (!(await bcrypt.compare(d.currentPassword, u.passwordHash))) throw new HttpError(400, 'Current password is incorrect')
  u.passwordHash = await bcrypt.hash(d.newPassword, 12); await u.save()
  logActivity(req, { action: 'password_change', entity: 'Auth', entityId: u._id, label: u.email, summary: `${u.name} changed their password` })
  res.json({ ok: true })
}))

r.post('/forgot-password', wrap(async (req, res) => {
  const { email: e } = z.object({ email }).parse(req.body)
  const user = await User.findOne({ email: e })
  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    user.resetTokenHash = sha(token); user.resetExpires = new Date(Date.now() + 60 * 60 * 1000); await user.save()
    const base = env.clientUrls[0].replace(/\/$/, '')
    await sendMail({ to: user.email, subject: 'Reset your EstateHub password', text: `Hi ${user.name},\n\nUse this link within 1 hour to choose a new password:\n${base}/reset-password?token=${token}\n\nIf you did not ask for this, you can ignore this email.` })
  }
  res.json({ ok: true }) // same response whether or not the account exists
}))

r.post('/reset-password', wrap(async (req, res) => {
  const d = z.object({ token: z.string().min(10), password }).parse(req.body)
  const user = await User.findOne({ resetTokenHash: sha(d.token), resetExpires: { $gt: new Date() } }).select('+resetTokenHash +resetExpires')
  if (!user) throw new HttpError(400, 'This reset link is invalid or has expired')
  user.passwordHash = await bcrypt.hash(d.password, 12); user.resetTokenHash = undefined; user.resetExpires = undefined; await user.save()
  logActivity(req, { action: 'password_change', entity: 'Auth', entityId: user._id, label: user.email, summary: `${user.name} reset their password via email link`, actor: user })
  res.json({ ok: true })
}))

export default r
