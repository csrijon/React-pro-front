import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { User } from '../models/User.js'
import { Inquiry, Appointment, Submission } from '../models/activity.js'
import { requireAuth } from '../middleware/auth.js'
import { wrap } from '../utils/asyncHandler.js'

const r = Router()
r.use(requireAuth)
const ids = (u) => u.wishlist.map(String)

/* Wishlist (synced with the browser's local copy) */
r.get('/wishlist', wrap(async (req, res) => res.json(ids(req.user))))
r.post('/wishlist/sync', wrap(async (req, res) => {
  const incoming = z.array(z.string()).max(200).parse(req.body.ids).filter((i) => mongoose.isValidObjectId(i))
  req.user.wishlist = [...new Set([...ids(req.user), ...incoming])]; await req.user.save(); res.json(ids(req.user))
}))
r.post('/wishlist/:id', wrap(async (req, res) => { await User.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: req.params.id } }); res.status(204).end() }))
r.delete('/wishlist/:id', wrap(async (req, res) => { await User.updateOne({ _id: req.user._id }, { $pull: { wishlist: req.params.id } }); res.status(204).end() }))

/* Saved searches */
r.get('/saved-searches', wrap(async (req, res) => res.json(req.user.savedSearches)))
r.post('/saved-searches', wrap(async (req, res) => {
  const d = z.object({ name: z.string().trim().min(1).max(80), query: z.string().max(1000) }).parse(req.body)
  if (req.user.savedSearches.length >= 20) return res.status(400).json({ message: 'You can save up to 20 searches' })
  req.user.savedSearches.push(d); await req.user.save(); res.status(201).json(req.user.savedSearches.at(-1))
}))
r.delete('/saved-searches/:id', wrap(async (req, res) => { await User.updateOne({ _id: req.user._id }, { $pull: { savedSearches: { _id: req.params.id } } }); res.status(204).end() }))

/* Own enquiries & visits */
r.get('/activity', wrap(async (req, res) => {
  const [inquiries, appointments] = await Promise.all([
    Inquiry.find({ $or: [{ user: req.user._id }, { email: req.user.email }] }).sort({ createdAt: -1 }).limit(50),
    Appointment.find({ user: req.user._id }).sort({ date: -1 }).limit(50),
  ])
  res.json({ inquiries, appointments })
}))
/* Own property submissions and their review status */
r.get('/submissions', wrap(async (req, res) => res.json(await Submission.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50))))
export default r
