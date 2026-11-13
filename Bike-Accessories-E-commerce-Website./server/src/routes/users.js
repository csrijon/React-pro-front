import { Router } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { User } from '../models/index.js'
import { requireAuth, validate, signToken, audit } from '../middleware/index.js'
import { asyncHandler, badRequest, notFound } from '../utils/helpers.js'
import { passwordRule } from './auth.js'

const r = Router()
r.use(requireAuth)

r.put('/profile', validate(z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().trim().regex(/^(\+?91)?[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
  dob: z.string().max(10).optional().default(''),
  gender: z.enum(['', 'Male', 'Female', 'Other']).optional().default(''),
  bike: z.string().trim().max(80).optional().default(''),
})), asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body)
  await req.user.save()
  res.json({ user: req.user })
}))

r.put('/password', validate(z.object({ currentPassword: z.string().min(1, 'Current password is required'), newPassword: passwordRule })), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password')
  if (!(await bcrypt.compare(req.body.currentPassword, user.password))) throw badRequest('Current password is incorrect')
  if (req.body.currentPassword === req.body.newPassword) throw badRequest('Choose a password you have not used before')
  user.password = await bcrypt.hash(req.body.newPassword, 12)
  user.tokenVersion = (user.tokenVersion || 0) + 1 // every other device is signed out
  await user.save()
  audit(req, 'auth.password_changed', user.email, 200)
  res.json({ message: 'Password changed', token: signToken(user) }) // this device keeps working with a fresh token
}))

// ---- addresses ----
const address = z.object({
  label: z.enum(['Home', 'Work', 'Other']).optional().default('Home'),
  name: z.string().trim().min(2, 'Name is required').max(80),
  phone: z.string().trim().regex(/^(\+?91)?[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1: z.string().trim().min(3, 'Address is required').max(200),
  line2: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().min(2, 'City is required').max(80),
  state: z.string().trim().min(2, 'State is required').max(80),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode'),
  isDefault: z.boolean().optional().default(false),
})

const setDefault = (user, id) => user.addresses.forEach((a) => (a.isDefault = String(a._id) === String(id)))

r.get('/addresses', (req, res) => res.json(req.user.addresses))
r.post('/addresses', validate(address), asyncHandler(async (req, res) => {
  if (req.user.addresses.length >= 10) throw badRequest('You can save up to 10 addresses')
  req.user.addresses.push(req.body)
  const added = req.user.addresses[req.user.addresses.length - 1]
  if (req.body.isDefault || req.user.addresses.length === 1) setDefault(req.user, added._id)
  await req.user.save()
  res.status(201).json(added)
}))
r.put('/addresses/:id', validate(address.partial()), asyncHandler(async (req, res) => {
  const a = req.user.addresses.id(req.params.id)
  if (!a) throw notFound('Address not found')
  Object.assign(a, req.body)
  if (req.body.isDefault) setDefault(req.user, a._id)
  await req.user.save()
  res.json(a)
}))
r.delete('/addresses/:id', asyncHandler(async (req, res) => {
  const a = req.user.addresses.id(req.params.id)
  if (!a) throw notFound('Address not found')
  a.deleteOne()
  if (req.user.addresses.length && !req.user.addresses.some((x) => x.isDefault)) req.user.addresses[0].isDefault = true
  await req.user.save()
  res.json({ message: 'Address removed' })
}))

export default r
