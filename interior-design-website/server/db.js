import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Project, Service, Designer, Inquiry, Media, User, Doc, Visit, Activity } from './models.js';
import { seedProjects } from '../src/data/projects.js';
import { seedServices } from '../src/data/services.js';
import { seedDesigners } from '../src/data/designers.js';
import { seedInquiries, seedMedia, seedPages, seedSettings } from '../src/data/misc.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(dir, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/domus_studio';
const clone = (v) => JSON.parse(JSON.stringify(v));

export const log = (text) => Activity.create({ text }).then(() => Activity.find().sort({ at: -1 }).skip(50).select('_id').lean())
  .then((old) => old.length && Activity.deleteMany({ _id: { $in: old.map((o) => o._id) } })).catch(() => {});

/** Data from the previous JSON-file backend (server/data/db.json), if present, is imported once. */
const legacy = () => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'data', 'db.json'), 'utf8')); } catch { return null; } };

async function seed() {
  if (await Doc.exists({ _id: 'meta' })) return;
  const old = legacy();
  const email = (process.env.ADMIN_EMAIL || 'admin@domusstudio.in').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const src = old || { projects: seedProjects, services: seedServices, designers: seedDesigners, inquiries: seedInquiries, media: seedMedia, pages: seedPages, settings: { ...seedSettings, profile: { name: seedSettings.profile.name, email } } };
  const rows = (list) => clone(list).map(({ id, ...r }, i) => ({ ...r, _id: id, createdAt: r.createdAt || new Date(Date.now() - i * 1000) }));
  await Promise.all([
    Project.insertMany(rows(src.projects)), Service.insertMany(rows(src.services)), Designer.insertMany(rows(src.designers)),
    Inquiry.insertMany(rows(src.inquiries)), Media.insertMany(rows(src.media)),
    Doc.create({ _id: 'pages', data: src.pages }), Doc.create({ _id: 'settings', data: src.settings }),
  ]);
  if (old?.users?.length) await User.insertMany(old.users.map(({ id, ...u }) => ({ ...u, _id: id })));
  else await User.create({ email, name: src.settings.profile?.name || 'Admin', hash: bcrypt.hashSync(password, 10) });
  if (old?.visits) await Visit.insertMany(Object.entries(old.visits).map(([_id, count]) => ({ _id, count })));
  if (old?.activity?.length) await Activity.insertMany(old.activity.map((a) => ({ text: a.text, at: a.at })));
  await Doc.create({ _id: 'meta', data: { seededAt: new Date().toISOString(), importedLegacy: !!old } });
  console.log(old ? 'Imported existing data from server/data/db.json into MongoDB.' : 'Seeded MongoDB with starter content.');
}

export async function connect() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  await Promise.all([Project.init(), Service.init(), Designer.init(), User.init()]); // build unique indexes
  await seed();
  return mongoose.connection;
}
