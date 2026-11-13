import { Router } from 'express'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import { Blog, Faq, Testimonial, Subscriber, Message } from '../models/index.js'
import { validate } from '../middleware/index.js'
import { publicCache } from '../middleware/cache.js'
import { asyncHandler, notFound, randomToken } from '../utils/helpers.js'
import { sendMail, html } from '../utils/mailer.js'
import { config } from '../config/env.js'
import { team, stats, policies } from '../seed/data/content.js'

const r = Router()
const cached = publicCache({ browserSeconds: 60, swrSeconds: 300 })
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, skip: () => config.isTest, message: { message: 'Too many requests. Please try again later.' } })

r.get('/blogs', cached, asyncHandler(async (_req, res) => {
  const posts = await Blog.find({ published: true }).sort({ date: -1 }).select('-body')
  res.json(posts.map(withImage))
}))
r.get('/blogs/:slug', cached, asyncHandler(async (req, res) => {
  const post = await Blog.findOne({ slug: req.params.slug, published: true })
  if (!post) throw notFound('Article not found')
  res.json(withImage(post))
}))
// storefront SmartImage accepts a photo key; custom uploaded images arrive as `image`
const withImage = (p) => p.toJSON()

r.get('/content/testimonials', cached, asyncHandler(async (_req, res) => res.json(await Testimonial.find({ active: true }).sort({ createdAt: -1 }).limit(12))))
r.get('/content/faqs', cached, asyncHandler(async (_req, res) => res.json(await Faq.find().sort({ order: 1, createdAt: 1 }))))
r.get('/content/team', cached, (_req, res) => res.json({ team, stats }))
r.get('/content/policies/:slug', cached, (req, res, next) => (policies[req.params.slug] ? res.json(policies[req.params.slug]) : next(notFound('Page not found'))))

r.post('/newsletter', limiter, validate(z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address') })), asyncHandler(async (req, res) => {
  await Subscriber.updateOne({ email: req.body.email }, { $setOnInsert: { email: req.body.email } }, { upsert: true })
  res.status(201).json({ message: 'Subscribed successfully' })
}))

r.post('/contact', limiter, validate(z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  subject: z.string().trim().max(100).optional().default('General enquiry'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
})), asyncHandler(async (req, res) => {
  const ticket = 'MG-' + randomToken(3).toUpperCase()
  const msg = await Message.create({ ...req.body, ticket })
  if (config.adminNotifyEmail)
    sendMail({ to: config.adminNotifyEmail, subject: `[${ticket}] ${msg.subject}`, html: html('New contact message', `<p><b>${msg.name}</b> &lt;${msg.email}&gt;</p><p>${msg.message.replace(/</g, '&lt;')}</p>`), text: `${msg.name} <${msg.email}>\n\n${msg.message}` })
  res.status(201).json({ message: 'Message received', ticket })
}))

export default r
