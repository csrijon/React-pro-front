import { USE_MOCK, http, delay } from './config'
import { createStore } from './mockStore'
import { posts, faqs } from '../data/blog'
import { testimonials } from '../data/misc'
import { uid } from '../utils/format'

const store = createStore('posts', posts)
const KEYS = { faqs: ['estatehub:mock:faqs', faqs], testimonials: ['estatehub:mock:testimonials', testimonials] }
const readList = (k) => { try { return JSON.parse(localStorage.getItem(KEYS[k][0])) || KEYS[k][1] } catch { return KEYS[k][1] } }
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const contentService = {
  posts: {
    async list() { if (!USE_MOCK) return http('/posts'); return (await store.all()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) },
    async get(slug) { if (!USE_MOCK) return http(`/posts/${slug}`); return (await store.all()).find((p) => p.slug === slug) || null },
    create: (d) => (USE_MOCK ? store.add({ id: uid('b'), slug: slugify(d.title) + '-' + Math.random().toString(36).slice(2, 5), createdAt: new Date().toISOString(), ...d }) : http('/posts', { method: 'POST', body: d })),
    update: (id, d) => (USE_MOCK ? store.update(id, d) : http(`/posts/${id}`, { method: 'PUT', body: d })),
    remove: (id) => (USE_MOCK ? store.remove(id) : http(`/posts/${id}`, { method: 'DELETE' })),
  },
  async faqs() { if (!USE_MOCK) return http('/faqs'); await delay(150); return readList('faqs') },
  async saveFaqs(v) { if (!USE_MOCK) return http('/faqs', { method: 'PUT', body: v }); localStorage.setItem(KEYS.faqs[0], JSON.stringify(v)); return v },
  async saveTestimonials(v) { if (!USE_MOCK) return http('/testimonials', { method: 'PUT', body: v }); localStorage.setItem(KEYS.testimonials[0], JSON.stringify(v)); return v },
}
