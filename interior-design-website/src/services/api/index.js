import client, { ENDPOINTS, USE_MOCK, TOKEN_KEY } from './client';
import { createResource, delay } from './resource';
import { storage } from '../../utils/storage';
import { slugify, fileToDataUrl, compressImage } from '../../utils/helpers';
import { writeSiteCache } from '../../utils/siteCache';
import { seedProjects } from '../../data/projects';
import { seedServices } from '../../data/services';
import { seedDesigners } from '../../data/designers';
import { seedInquiries, seedMedia, seedPages, seedSettings } from '../../data/misc';

/* ---------- projects ---------- */
const projectsBase = createResource('projects', ENDPOINTS.projects, seedProjects);
export const projectsApi = {
  ...projectsBase,
  togglePublish: async (p) => projectsBase.update(p.id, { status: p.status === 'published' ? 'draft' : 'published' }),
  related: async (project, n = 3) => {
    const all = await projectsBase.list();
    return all.filter((p) => p.status === 'published' && p.id !== project.id)
      .sort((a, b) => (b.category === project.category) - (a.category === project.category)).slice(0, n);
  },
};

/* ---------- services / designers / media ---------- */
export const servicesApi = createResource('services', ENDPOINTS.services, seedServices);
export const designersApi = createResource('designers', ENDPOINTS.designers, seedDesigners);
const mediaBase = createResource('media', ENDPOINTS.media, seedMedia);
export const mediaApi = {
  ...mediaBase,
  // Real backend: multipart upload returning the media record. Mock: compressed data URL.
  upload: async (original) => {
    const file = await compressImage(original); // no-op for videos and small images
    if (!USE_MOCK) {
      const form = new FormData(); form.append('file', file);
      return client.post(ENDPOINTS.media, form, { timeout: 0 }); // large videos need no timeout
    }
    if (file.type.startsWith('video/')) throw new Error('Video upload needs the backend. Paste a YouTube, Vimeo or video link instead.');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    return mediaBase.create({ name: file.name, url: await fileToDataUrl(file), type: ext === 'jpeg' ? 'jpg' : ext, size: file.size });
  },
};
/** Upload an image and return its URL (used by every ImageUploader). */
export const uploadImage = async (file) => (await mediaApi.upload(file)).url;

/* ---------- inquiries ---------- */
const inquiriesBase = createResource('inquiries', ENDPOINTS.inquiries, seedInquiries);
export const inquiriesApi = {
  ...inquiriesBase,
  submit: (data) => inquiriesBase.create({ ...data, status: 'New', notes: '' }),
};

/* ---------- pages & settings (single documents) ---------- */
const singleDoc = (name, endpoint, seed, normalize = (x) => x, cacheKey) => {
  const key = `domus.mock.${name}.v1`;
  return {
    get: async () => normalize(USE_MOCK ? await delay(storage.get(key, seed), 250) : await client.get(endpoint)),
    save: async (data) => {
      const saved = USE_MOCK ? (storage.set(key, data), await delay(data)) : await client.put(endpoint, data);
      if (cacheKey) writeSiteCache({ [cacheKey]: normalize(saved) }); // public site shows the new content immediately
      return saved;
    },
  };
};
// Fill any missing fields with defaults so older saved content keeps working.
const withDefaults = (saved = {}) => {
  const out = Object.fromEntries(Object.keys(seedPages).map((k) => [k, { ...seedPages[k], ...(saved[k] || {}) }]));
  // Content saved before About got its own statistics/philosophy keeps showing what Home had.
  for (const k of ['stats', 'philosophy']) if (!saved.about?.[k] && saved.home?.[k]) out.about[k] = saved.home[k];
  return out;
};
export { withDefaults as normalizePages };
export const pagesApi = singleDoc('pages', ENDPOINTS.pages, seedPages, withDefaults, 'pages');
// Settings defaults: nested groups are merged so newly added fields (theme, favicon…) always exist.
const withSettingsDefaults = (saved = {}) => {
  const base = Object.fromEntries(Object.entries(seedSettings).filter(([k]) => k !== 'profile'));
  return {
    ...base, ...saved,
    contact: { ...base.contact, ...saved.contact }, social: { ...base.social, ...saved.social },
    seo: { ...base.seo, ...saved.seo }, theme: { ...base.theme, ...saved.theme },
  };
};
export { withSettingsDefaults as normalizeSettings };
export const settingsApi = singleDoc('settings', ENDPOINTS.settings, seedSettings, withSettingsDefaults, 'settings');

/* ---------- auth ---------- */
const MOCK_USER = { email: 'admin@domusstudio.in', password: 'admin123' };
export const authApi = {
  login: async ({ email, password }) => {
    if (!USE_MOCK) return client.post(ENDPOINTS.login, { email, password }); // expect { token, user }
    await delay(null, 600);
    if (email.toLowerCase() !== MOCK_USER.email || password !== (storage.get('domus.mock.pw', MOCK_USER.password))) {
      throw new Error('Incorrect email or password.');
    }
    const settings = storage.get('domus.mock.settings.v1', seedSettings);
    return { token: 'mock-token', user: { name: settings.profile.name, email } };
  },
  changePassword: async ({ current, next }) => {
    if (!USE_MOCK) return client.post(ENDPOINTS.changePassword, { current, next });
    await delay(null, 500);
    if (current !== storage.get('domus.mock.pw', MOCK_USER.password)) throw new Error('Current password is incorrect.');
    storage.set('domus.mock.pw', next);
    return { ok: true };
  },
};
export { TOKEN_KEY };

/* ---------- analytics (real backend only) ---------- */
export const trackApi = {
  visit: () => { if (!USE_MOCK && !sessionStorage.getItem('domus.visited')) { sessionStorage.setItem('domus.visited', '1'); client.post('/track').catch(() => {}); } },
  projectView: (id) => { if (!USE_MOCK) client.post(`${ENDPOINTS.projects}/${id}/view`).catch(() => {}); },
};

/* ---------- dashboard ---------- */
export const dashboardApi = {
  get: async () => {
    if (!USE_MOCK) return client.get(ENDPOINTS.dashboard);
    const [projects, services, designers, inquiries] = await Promise.all([
      projectsBase.list(), servicesApi.list(), designersApi.list(), inquiriesBase.list(),
    ]);
    const byCat = {};
    projects.forEach((p) => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return delay({
      totals: {
        projects: projects.length, designers: designers.length, services: services.length, inquiries: inquiries.length,
        published: projects.filter((p) => p.status === 'published').length, drafts: projects.filter((p) => p.status !== 'published').length,
      },
      visitors: days.map((d, i) => ({ label: d, value: [420, 510, 480, 640, 720, 560, 690][i] })),
      projectViews: [...projects].sort((a, b) => b.views - a.views).slice(0, 6).map((p) => ({ label: p.title, value: p.views })),
      inquiryStats: ['New', 'In Progress', 'Contacted', 'Completed', 'Rejected'].map((s) => ({ label: s, value: inquiries.filter((i) => i.status === s).length })),
      byCategory: Object.entries(byCat).map(([label, value]) => ({ label, value })),
      latestInquiries: [...inquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
      activity: [
        { text: 'Lakeside Villa was published', at: new Date(Date.now() - 36e5 * 3).toISOString() },
        { text: `New inquiry from ${inquiries[0]?.name || 'a visitor'}`, at: new Date(Date.now() - 36e5 * 5).toISOString() },
        { text: 'Executive Suites saved as draft', at: new Date(Date.now() - 36e5 * 26).toISOString() },
        { text: 'Media library updated', at: new Date(Date.now() - 36e5 * 50).toISOString() },
      ],
    });
  },
};

export { slugify };
