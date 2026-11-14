import mongoose from 'mongoose'
import './plugin.js'

const savedSearch = new mongoose.Schema({ name: { type: String, required: true, maxlength: 80 }, query: { type: String, default: '' }, createdAt: { type: Date, default: Date.now } })

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'editor', 'admin'], default: 'user' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  savedSearches: [savedSearch],
  resetTokenHash: { type: String, select: false },
  resetExpires: { type: Date, select: false },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
