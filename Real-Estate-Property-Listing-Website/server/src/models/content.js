import mongoose from 'mongoose'
import './plugin.js'
const { Schema } = mongoose
const ref = (m) => ({ type: Schema.Types.ObjectId, ref: m })

export const Property = mongoose.model('Property', new Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  type: { type: String, required: true, trim: true, maxlength: 30 }, // allowed values are the owner-editable list in site settings, checked in the route
  purpose: { type: String, enum: ['Buy', 'Rent'], required: true },
  status: { type: String, enum: ['For Sale', 'For Rent', 'Sold', 'Rented', 'Draft'], default: 'For Sale' },
  price: { type: Number, required: true, min: 1 },
  location: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true }, state: { type: String, default: 'West Bengal' },
  beds: { type: Number, default: 0, min: 0 }, baths: { type: Number, default: 0, min: 0 }, parking: { type: Number, default: 0, min: 0 }, area: { type: Number, required: true, min: 1 },
  furnishing: { type: String, default: 'Unfurnished', trim: true, maxlength: 30 },
  propertyStatus: { type: String, enum: ['Ready to Move', 'Under Construction'], default: 'Ready to Move' },
  description: { type: String, required: true }, amenities: [String], images: { type: [String], validate: (v) => v.length > 0 },
  featured: { type: Boolean, default: false }, views: { type: Number, default: 0 },
  floorPlan: { type: String, match: [/^https?:\/\//i, 'Floor plan must be an uploaded image'] }, rooms: { type: [new Schema({ name: { type: String, required: true, trim: true, maxlength: 40 }, size: { type: String, trim: true, maxlength: 40, default: '' } }, { _id: false })], validate: [(v) => v.length <= 20, 'Up to 20 rooms'] },
  floor: String, facing: String, yearBuilt: Number, lat: { type: Number, min: -90, max: 90 }, lng: { type: Number, min: -180, max: 180 }, videoUrl: { type: String, match: [/^(https:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//, 'Video must be a YouTube link'] },
}, { timestamps: true }))

export const Project = mongoose.model('Project', new Schema({
  name: { type: String, required: true, trim: true }, developer: { type: String, required: true }, location: { type: String, required: true },
  category: { type: String, enum: ['Residential', 'Commercial'], default: 'Residential' },
  status: { type: String, enum: ['Ready to Move', 'Under Construction', 'Upcoming'], default: 'Upcoming' },
  priceFrom: { type: Number, required: true, min: 0 }, priceTo: { type: Number, required: true, min: 0 }, units: { type: Number, default: 0 }, towers: { type: Number, default: 0 },
  possession: String, progress: { type: Number, default: 0, min: 0, max: 100 }, rera: { type: String, default: 'Applied' },
  configurations: [{ type: { type: String }, area: String, price: String, _id: false }], amenities: [String], images: { type: [String], validate: (v) => v.length > 0 }, description: { type: String, required: true },
}, { timestamps: true }))

export const Review = mongoose.model('Review', new Schema({
  name: { type: String, required: true, maxlength: 80 }, rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, maxlength: 1000 }, status: { type: String, enum: ['Pending', 'Published', 'Hidden'], default: 'Pending' }, date: { type: Date, default: Date.now },
}, { timestamps: true }))

/** A person on the company's team. `role` is one of the owner's custom roles (see routes/team.js). */
export const TeamMember = mongoose.model('TeamMember', new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  role: { type: String, required: true, trim: true, maxlength: 40 },
  photo: { type: String, match: [/^https?:\/\//i, 'Photo must be an uploaded image or an http(s) link'] },
  email: { type: String, trim: true, lowercase: true, maxlength: 120, validate: { validator: (v) => !v || /^\S+@\S+\.\S+$/.test(v), message: 'Enter a valid email address' } },
  phone: { type: String, trim: true, maxlength: 30, default: '' },
  bio: { type: String, trim: true, maxlength: 600, default: '' },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true }))
