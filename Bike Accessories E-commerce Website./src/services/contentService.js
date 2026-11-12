import api, { unwrap } from './api'

/** Blog, brands, testimonials, FAQs, policies, contact + newsletter. */
const contentService = {
  blogs: () => api.get('/blogs').then(unwrap),
  blog: (slug) => api.get(`/blogs/${slug}`).then(unwrap),
  brands: () => api.get('/brands').then(unwrap),
  brand: (slug) => api.get(`/brands/${slug}`).then(unwrap),
  testimonials: () => api.get('/content/testimonials').then(unwrap),
  faqs: () => api.get('/content/faqs').then(unwrap),
  team: () => api.get('/content/team').then(unwrap),
  policy: (slug) => api.get(`/content/policies/${slug}`).then(unwrap),
  subscribe: (email) => api.post('/newsletter', { email }).then(unwrap),
  contact: (data) => api.post('/contact', data).then(unwrap),
}

export default contentService
