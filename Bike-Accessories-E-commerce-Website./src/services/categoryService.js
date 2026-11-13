import api, { unwrap } from './api'

/** GET /categories -> Category[] (with product `count`) | GET /categories/:slug -> Category */
const categoryService = {
  list: () => api.get('/categories').then(unwrap),
  get: (slug) => api.get(`/categories/${slug}`).then(unwrap),
}

export default categoryService
