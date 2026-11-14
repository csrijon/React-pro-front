import mongoose from 'mongoose'
import './plugin.js'
const { Schema } = mongoose

export const Inquiry = mongoose.model('Inquiry', new Schema({
  name: { type: String, required: true, maxlength: 80 }, email: { type: String, required: true, lowercase: true }, phone: { type: String, required: true },
  property: { type: String, default: 'General enquiry', maxlength: 200 }, message: { type: String, required: true, maxlength: 2000 },
  status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Closed'], default: 'New' }, user: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }))

export const Appointment = mongoose.model('Appointment', new Schema({
  name: { type: String, required: true, maxlength: 80 }, phone: { type: String, required: true }, property: { type: String, required: true }, date: { type: String, required: true }, time: { type: String, required: true },
  notes: { type: String, maxlength: 500 }, user: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true }))

export const Submission = mongoose.model('Submission', new Schema({
  title: String, type: String, purpose: String, price: Number, location: String, city: String, beds: Number, baths: Number, area: Number, description: String,
  amenities: [String], images: [String], ownerName: { type: String, required: true }, phone: { type: String, required: true }, email: { type: String, required: true, lowercase: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, reference: String, property: { type: Schema.Types.ObjectId, ref: 'Property' }, user: { type: Schema.Types.ObjectId, ref: 'User' }, adminNote: { type: String, default: '' },
}, { timestamps: true }))

export const Newsletter = mongoose.model('Newsletter', new Schema({ email: { type: String, required: true, unique: true, lowercase: true } }, { timestamps: true }))
export const ViewLog = mongoose.model('ViewLog', new Schema({ date: { type: String, unique: true }, count: { type: Number, default: 0 } }))
export const Setting = mongoose.model('Setting', new Schema({ key: { type: String, unique: true }, value: Schema.Types.Mixed }))

export const Post = mongoose.model('Post', new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 }, slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true, maxlength: 300 }, content: { type: String, required: true }, cover: String,
  category: { type: String, default: 'Guides' }, author: { type: String, default: 'EstateHub Team' }, published: { type: Boolean, default: true },
}, { timestamps: true }))

const retentionDays = Math.max(+process.env.ACTIVITY_RETENTION_DAYS || 365, 1)
const logSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: 'User' }, actorName: { type: String, default: 'Guest' }, actorRole: { type: String, default: 'guest' },
  action: { type: String, required: true }, // create | update | delete | approve | reject | login | login_failed | register | password_change
  entity: { type: String, required: true }, entityId: String, label: { type: String, default: '' }, summary: { type: String, required: true },
  changes: { type: Schema.Types.Mixed }, ip: String,
}, { timestamps: { createdAt: true, updatedAt: false } })
logSchema.index({ createdAt: -1 })
logSchema.index({ entity: 1, entityId: 1, createdAt: -1 })
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: retentionDays * 86400 }) // old entries expire automatically
export const ActivityLog = mongoose.model('ActivityLog', logSchema)
