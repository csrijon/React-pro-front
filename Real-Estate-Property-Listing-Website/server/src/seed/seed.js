// Usage: npm run seed   (WIPES the EstateHub collections and loads demo data)
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { Property, Project, Review, TeamMember } from '../models/content.js'
import { Inquiry, Appointment, Newsletter, ViewLog, Setting, Submission, Post } from '../models/activity.js'
import { reviews } from '../../../src/data/reviews.js'
import { team } from '../../../src/data/team.js'
import { DEFAULT_TEAM_ROLES } from '../config/siteDefaults.js'
import { properties } from '../../../src/data/properties.js'
import { projects } from '../../../src/data/projects.js'
import { posts, faqs } from '../../../src/data/blog.js'
import { inquiries, appointments, customers, testimonials } from '../../../src/data/misc.js'

const strip = ({ id, ...rest }) => rest
await mongoose.connect(env.mongo)
await Promise.all([User, TeamMember, Property, Project, Review, Inquiry, Appointment, Newsletter, ViewLog, Setting, Submission, Post].map((m) => m.deleteMany({})))

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@estatehub.com').toLowerCase()
const adminPass = process.env.ADMIN_PASSWORD || 'Admin@12345'
const hash = (p) => bcrypt.hash(p, 12)
await User.create({ name: 'Admin User', email: adminEmail, passwordHash: await hash(adminPass), role: 'admin' })
await User.create({ name: 'Content Editor', email: 'editor@estatehub.com', passwordHash: await hash(crypto.randomBytes(12).toString('hex')), role: 'editor', status: 'Inactive' })
// Demo customers get random passwords (they cannot log in until they use "Forgot password").
for (const c of customers) await User.create({ name: c.name, email: c.email, phone: c.phone, passwordHash: await hash(crypto.randomBytes(12).toString('hex')), createdAt: new Date(c.joined) })

await Property.insertMany(properties.map((p) => ({ ...strip(p), createdAt: new Date(p.createdAt) })))
await Project.insertMany(projects.map(strip))
await Review.insertMany(reviews.map((r) => ({ ...strip(r), date: new Date(r.date) })))
await TeamMember.insertMany(team.map(strip))
await Setting.create({ key: 'teamRoles', value: DEFAULT_TEAM_ROLES })
await Inquiry.insertMany(inquiries.map((q) => ({ ...strip(q), createdAt: new Date(q.createdAt) })))
await Appointment.insertMany(appointments.map(strip))
await Post.insertMany(posts.map((p) => ({ ...strip(p), createdAt: new Date(p.createdAt) })))
await Setting.create({ key: 'faqs', value: faqs })
await Setting.create({ key: 'testimonials', value: testimonials })
await Setting.create({ key: 'site', value: { company: 'EstateHub', email: 'support@estatehub.com', phone: '+91 98765 43210', address: 'New Town, Kolkata, West Bengal 700156', notify: true } })

const logs = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 864e5)
  return { date: d.toISOString().slice(0, 10), count: Math.round(800 + i * 48 + Math.sin(i / 2) * 120) }
})
await ViewLog.insertMany(logs)

console.log(`Seeded: ${team.length} team members, ${properties.length} properties, ${projects.length} projects.`)
console.log(`Admin login -> ${adminEmail} / ${adminPass}  (change this password after first login)`)
await mongoose.disconnect()
