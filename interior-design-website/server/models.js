import crypto from 'node:crypto';
import mongoose from 'mongoose';

const { Schema } = mongoose;
export const newId = (p = 'x') => `${p}${crypto.randomBytes(5).toString('hex')}`;

// Public JSON uses `id` (string) so the frontend never sees Mongo internals.
const toJSON = { virtuals: false, versionKey: false, transform: (_d, r) => { r.id = r._id; delete r._id; return r; } };
const make = (name, prefix, def, opts = {}) => {
  const schema = new Schema({ _id: { type: String, default: () => newId(prefix) }, ...def }, { timestamps: { createdAt: true, updatedAt: false }, toJSON, ...opts });
  return mongoose.model(name, schema);
};

const str = (extra = {}) => ({ type: String, default: '', trim: true, ...extra });

export const Project = make('Project', 'p', {
  title: str({ required: [true, 'Project title is required.'] }),
  slug: { type: String, required: true, unique: true, index: true },
  shortDescription: str(), description: str(), concept: str(),
  category: str({ default: 'Residential' }), location: str(), area: { type: Number, default: 0 }, year: { type: Number, default: () => new Date().getFullYear() },
  duration: str(), style: str(), featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true }, views: { type: Number, default: 0 },
  cover: str(), gallery: { type: [String], default: [] },
  videos: { type: [new Schema({ title: str(), url: str() }, { _id: false })], default: [] },
  before: str(), after: str(), seoTitle: str(), seoDescription: str(),
});

export const Service = make('Service', 's', {
  title: str({ required: [true, 'Service title is required.'] }),
  slug: { type: String, required: true, unique: true, index: true },
  order: { type: Number, default: 0 }, status: { type: String, enum: ['draft', 'published'], default: 'published' },
  icon: str({ default: 'Sparkles' }), image: str(), description: str(), includes: { type: [String], default: [] }, process: { type: [String], default: [] },
});

export const Designer = make('Designer', 'd', {
  name: str({ required: [true, 'Designer name is required.'] }),
  slug: { type: String, required: true, unique: true, index: true },
  designation: str(), photo: str(), bio: str(), expertise: { type: [String], default: [] }, linkedin: str(), instagram: str(),
});

export const INQUIRY_STATUSES = ['New', 'In Progress', 'Contacted', 'Completed', 'Rejected'];
export const Inquiry = make('Inquiry', 'i', {
  name: str({ required: true }), email: str({ required: true }), phone: str(), projectType: str(), location: str(), budget: str(), area: str(),
  message: str({ required: true }), status: { type: String, enum: INQUIRY_STATUSES, default: 'New', index: true }, notes: str(),
});

export const Media = make('Media', 'm', { name: str({ required: true }), url: str({ required: true }), type: str(), size: { type: Number, default: 0 } });

export const User = make('User', 'u', { email: str({ required: true, unique: true, lowercase: true }), name: str(), hash: { type: String, required: true, select: false } });

// Singleton documents (pages, settings, meta) keyed by name; `data` is free-form JSON.
export const Doc = mongoose.model('Doc', new Schema({ _id: String, data: Schema.Types.Mixed }, { minimize: false, versionKey: false }));
export const Visit = mongoose.model('Visit', new Schema({ _id: String, count: { type: Number, default: 0 } }, { versionKey: false }));
export const Activity = mongoose.model('Activity', new Schema({ text: String, at: { type: Date, default: Date.now, index: true } }, { versionKey: false, toJSON: { transform: (_d, r) => ({ text: r.text, at: r.at }) } }));

export const models = { projects: Project, services: Service, designers: Designer, inquiries: Inquiry, media: Media };
