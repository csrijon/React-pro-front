import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import compression from 'compression';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect, log, UPLOAD_DIR, MONGODB_URI } from './db.js';
import { responsiveSrcSet, HERO_SIZES } from '../src/utils/imageUrl.js';
import { models, Project, Service, Designer, Inquiry, Media, User, Doc, Visit, Activity, INQUIRY_STATUSES } from './models.js';

const PORT = process.env.PORT || 4000;
const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) console.warn('WARNING: set JWT_SECRET in production.');

const app = express();
const slugify = (s = '') => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const bad = (res, message, status = 400) => res.status(status).json({ message });
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const isEmail = (v) => /^\S+@\S+\.\S+$/.test(String(v || ''));
const json = (doc) => (doc ? doc.toJSON() : doc);

app.use(cors());
app.use(compression()); // gzip JSON, HTML, JS and CSS
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }), (_req, res) => res.status(404).end());

/* ---------- auth helpers ---------- */
const readToken = (req) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try { return jwt.verify(h.slice(7), SECRET); } catch { return null; }
};
const optionalAuth = (req, _res, next) => { req.user = readToken(req); next(); };
const requireAuth = (req, res, next) => {
  req.user = readToken(req);
  if (!req.user) return bad(res, 'Please sign in again.', 401);
  next();
};

const hits = new Map();
const limit = (name, max, windowMs) => (req, res, next) => {
  const key = `${name}:${req.ip}`; const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) return bad(res, 'Too many attempts. Please wait a minute and try again.', 429);
  arr.push(now); hits.set(key, arr); next();
};

const api = express.Router();
app.use('/api', api);
api.get('/health', (_req, res) => res.json({ ok: true, database: 'mongodb' }));

/* ---------- auth ---------- */
api.post('/auth/login', limit('login', 10, 60_000), wrap(async (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+hash');
  if (!user || !bcrypt.compareSync(String(password), user.hash)) return bad(res, 'Incorrect email or password.', 401);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: user.name, email: user.email } });
}));
api.get('/auth/me', requireAuth, (req, res) => res.json({ name: req.user.name, email: req.user.email }));
api.post('/auth/change-password', requireAuth, wrap(async (req, res) => {
  const { current = '', next = '' } = req.body || {};
  const user = await User.findById(req.user.id).select('+hash');
  if (!user || !bcrypt.compareSync(String(current), user.hash)) return bad(res, 'Current password is incorrect.');
  if (String(next).length < 8) return bad(res, 'New password must be at least 8 characters.');
  user.hash = bcrypt.hashSync(String(next), 10); await user.save();
  log('Admin password changed'); res.json({ ok: true });
}));

/* ---------- generic CRUD on Mongoose models ---------- */
const uniqueSlug = async (Model, base, selfId) => {
  const root = slugify(base) || 'item'; let s = root; let n = 2;
  while (await Model.exists({ slug: s, _id: { $ne: selfId } })) s = `${root}-${n++}`;
  return s;
};

function crud(name, opts = {}) {
  const Model = models[name];
  const { publicRead = true, publicCreate = false, publicFilter, prepare, label = (x) => x.title || x.name, sort = { createdAt: -1 }, readonly = [] } = opts;
  const r = express.Router();
  const find = (id) => Model.findOne({ $or: [{ _id: id }, { slug: id }] });
  const strip = (body) => { const b = { ...body }; for (const k of ['id', '_id', 'createdAt', 'updatedAt', '__v', ...readonly]) delete b[k]; return b; };

  r.get('/', optionalAuth, wrap(async (req, res) => {
    if (!publicRead && !req.user) return bad(res, 'Please sign in again.', 401);
    const filter = !req.user && publicFilter ? publicFilter : {};
    res.json((await Model.find(filter).sort(sort)).map(json));
  }));
  r.get('/:id', optionalAuth, wrap(async (req, res) => {
    if (!publicRead && !req.user) return bad(res, 'Please sign in again.', 401);
    const item = await find(req.params.id);
    if (!item || (!req.user && publicFilter && !Object.entries(publicFilter).every(([k, v]) => item[k] === v))) return bad(res, 'Not found', 404);
    res.json(json(item));
  }));
  r.post('/', publicCreate ? optionalAuth : requireAuth, publicCreate ? limit(`${name}-create`, 8, 60_000) : (_q, _s, n) => n(), wrap(async (req, res) => {
    const item = new Model(strip(req.body));
    const err = await prepare?.(item, null, req);
    if (err) return bad(res, err);
    await item.save();
    if (req.user) log(`${label(item)} was added to ${name}`);
    res.status(201).json(json(item));
  }));
  r.put('/:id', requireAuth, wrap(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return bad(res, 'Not found', 404);
    const prevStatus = item.status;
    item.set(strip(req.body));
    const err = await prepare?.(item, true, req);
    if (err) return bad(res, err);
    await item.save();
    if (item.status && prevStatus !== item.status) log(`${label(item)} — status changed to ${item.status}`);
    res.json(json(item));
  }));
  r.delete('/:id', requireAuth, wrap(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return bad(res, 'Not found', 404);
    if (name === 'media' && item.url?.startsWith('/uploads/')) fs.rm(path.join(UPLOAD_DIR, path.basename(item.url)), () => {});
    log(`${label(item)} was deleted from ${name}`); res.json({ id: item.id });
  }));
  return r;
}

api.use('/projects', crud('projects', {
  publicFilter: { status: 'published' }, readonly: ['views'], // views are only changed by the visit counter
  prepare: async (p) => {
    if (!String(p.title || '').trim()) return 'Project title is required.';
    p.slug = await uniqueSlug(Project, p.slug || p.title, p._id);
    return null;
  },
}));
api.post('/projects/:id/view', wrap(async (req, res) => {
  await Project.updateOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], status: 'published' }, { $inc: { views: 1 } });
  res.json({ ok: true });
}));

api.use('/services', crud('services', {
  publicFilter: { status: 'published' }, sort: { order: 1, createdAt: -1 },
  prepare: async (s) => {
    if (!String(s.title || '').trim()) return 'Service title is required.';
    s.slug = await uniqueSlug(Service, s.title, s._id);
    if (!s.order) s.order = (await Service.countDocuments()) + 1;
    return null;
  },
}));
api.use('/designers', crud('designers', {
  prepare: async (d) => {
    if (!String(d.name || '').trim()) return 'Designer name is required.';
    d.slug = await uniqueSlug(Designer, d.name, d._id);
    return null;
  },
}));
api.use('/inquiries', crud('inquiries', {
  publicRead: false, publicCreate: true, label: (i) => `Inquiry from ${i.name}`,
  prepare: (i, isUpdate, req) => {
    if (!isUpdate) {
      if (!req.user) { i.status = 'New'; i.notes = ''; } // public submissions can't set status/notes
      if (String(i.name || '').trim().length < 2) return 'Please enter your name.';
      if (!isEmail(i.email)) return 'Please enter a valid email address.';
      if (String(i.message || '').trim().length < 10) return 'Please write a short message.';
    }
    return null;
  },
}));

/* ---------- media (multipart upload: images and videos) ---------- */
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(file.originalname).toLowerCase() || '.jpg'}`),
  }),
  limits: { fileSize: 300 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => (/^(image\/(jpeg|png|webp|gif|avif|svg\+xml)|video\/(mp4|webm|quicktime|x-m4v))$/.test(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type. Use JPG, PNG or WebP images (convert HEIC photos to JPG first) or MP4, WebM or MOV videos.'))),
});
api.post('/media', requireAuth, (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    try {
      if (err) return bad(res, err.code === 'LIMIT_FILE_SIZE' ? 'File is larger than 300 MB.' : err.message);
      if (!req.file) return bad(res, 'No file received.');
      if (req.file.mimetype.startsWith('image/') && req.file.size > 10 * 1024 * 1024) { fs.rm(req.file.path, () => {}); return bad(res, 'Image is larger than 10 MB.'); }
      const ext = path.extname(req.file.filename).slice(1).replace('jpeg', 'jpg');
      const item = await Media.create({ name: req.file.originalname, url: `/uploads/${req.file.filename}`, type: ext, size: req.file.size });
      log(`${item.name} was uploaded`);
      return res.status(201).json(json(item));
    } catch (e) { return next(e); }
  });
});
api.use('/media', crud('media', { label: (m) => m.name }));

/* ---------- single documents (pages, settings) ---------- */
let siteBoot = null; // cached public content injected into the HTML (cleared whenever content is saved)
const getDoc = async (id) => (await Doc.findById(id).lean())?.data || {};
const putDoc = async (id, data) => (await Doc.findByIdAndUpdate(id, { data }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean()).data;

api.get('/pages', wrap(async (_req, res) => res.json(await getDoc('pages'))));
api.put('/pages', requireAuth, wrap(async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return bad(res, 'Invalid content.');
  const data = await putDoc('pages', { ...(await getDoc('pages')), ...req.body });
  siteBoot = null; log('Website page content updated'); res.json(data);
}));
api.get('/settings', optionalAuth, wrap(async (req, res) => {
  const { profile, ...rest } = await getDoc('settings');
  res.json(req.user ? { profile, ...rest } : rest);
}));
api.put('/settings', requireAuth, wrap(async (req, res) => {
  const next = { ...(await getDoc('settings')), ...req.body };
  if (next.profile) {
    if (!String(next.profile.name || '').trim() || !isEmail(next.profile.email)) return bad(res, 'Enter a valid profile name and email.');
    await User.findByIdAndUpdate(req.user.id, { name: next.profile.name, email: next.profile.email.toLowerCase() }, { runValidators: true });
  }
  const data = await putDoc('settings', next);
  siteBoot = null; log('Site settings updated'); res.json(data);
}));

/* ---------- analytics ---------- */
api.post('/track', limit('track', 30, 60_000), wrap(async (_req, res) => {
  await Visit.updateOne({ _id: new Date().toISOString().slice(0, 10) }, { $inc: { count: 1 } }, { upsert: true });
  res.json({ ok: true });
}));

api.get('/dashboard', requireAuth, wrap(async (_req, res) => {
  const days = Array.from({ length: 7 }, (_, i) => new Date(Date.now() - (6 - i) * 864e5));
  const [projects, designers, services, inquiries, published, byCat, visits, top, byStatus, latest, activity] = await Promise.all([
    Project.countDocuments(), Designer.countDocuments(), Service.countDocuments(), Inquiry.countDocuments(), Project.countDocuments({ status: 'published' }),
    Project.aggregate([{ $group: { _id: '$category', value: { $sum: 1 } } }, { $sort: { value: -1 } }]),
    Visit.find({ _id: { $in: days.map((d) => d.toISOString().slice(0, 10)) } }).lean(),
    Project.find().sort({ views: -1 }).limit(6).select('title views'),
    Inquiry.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]),
    Inquiry.find().sort({ createdAt: -1 }).limit(5),
    Activity.find().sort({ at: -1 }).limit(6),
  ]);
  const vmap = Object.fromEntries(visits.map((v) => [v._id, v.count]));
  const smap = Object.fromEntries(byStatus.map((s) => [s._id, s.value]));
  res.json({
    totals: { projects, designers, services, inquiries, published, drafts: projects - published },
    visitors: days.map((d) => ({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), value: vmap[d.toISOString().slice(0, 10)] || 0 })),
    projectViews: top.map((p) => ({ label: p.title, value: p.views || 0 })),
    inquiryStats: INQUIRY_STATUSES.map((s) => ({ label: s, value: smap[s] || 0 })),
    byCategory: byCat.map((c) => ({ label: c._id || 'Uncategorised', value: c.value })),
    latestInquiries: latest.map(json),
    activity: activity.map(json),
  });
}));

api.use((_req, res) => bad(res, 'Endpoint not found', 404));

/* ---------- serve the built frontend in production ---------- */
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (fs.existsSync(dist)) {
  const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  // The page's public content is inlined into the HTML, so the browser needs no extra request
  // before it can render, and the hero image can start downloading while the scripts load.
  const page = async (pathname) => {
    if (!siteBoot) {
      const settings = Object.fromEntries(Object.entries(await getDoc('settings')).filter(([k]) => k !== 'profile'));
      siteBoot = { pages: await getDoc('pages'), settings };
    }
    const data = JSON.stringify(siteBoot).replace(/</g, '\\u003c');
    let head = `<script>window.__SITE__=${data}</script>`;
    const hero = pathname === '/' && siteBoot.pages?.home?.heroImage;
    if (hero) {
      const srcset = responsiveSrcSet(hero);
      head += `<link rel="preload" as="image" href="${esc(hero)}"${srcset ? ` imagesrcset="${esc(srcset)}" imagesizes="${esc(HERO_SIZES)}"` : ''} fetchpriority="high">`;
    }
    return template.replace('</head>', `${head}</head>`);
  };

  app.use('/assets', express.static(path.join(dist, 'assets'), { immutable: true, maxAge: '1y' })); // hashed file names
  app.use(express.static(dist, { index: false, maxAge: '1h' }));
  app.get('*', wrap(async (req, res) => {
    res.set('Cache-Control', 'no-cache').type('html').send(await page(req.path).catch(() => template));
  }));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.name === 'ValidationError') return bad(res, Object.values(err.errors)[0]?.message || 'Invalid data.');
  if (err?.name === 'CastError') return bad(res, 'Invalid value.');
  if (err?.code === 11000) return bad(res, 'That value is already in use.', 409);
  console.error(err); bad(res, 'Something went wrong on the server.', 500);
});

connect()
  .then(() => app.listen(PORT, () => console.log(`Domus API listening on http://localhost:${PORT}  (MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')})`)))
  .catch((e) => { console.error(`\nCould not connect to MongoDB at ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}\n${e.message}\nStart MongoDB or set MONGODB_URI in .env.\n`); process.exit(1); });
