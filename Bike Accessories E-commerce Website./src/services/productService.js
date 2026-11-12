import api, { unwrap } from './api'

/**
 * Product API.
 * Expected backend contract:
 *   GET /products?q&category&brand&minPrice&maxPrice&rating&inStock&sort&page&limit&tag
 *       -> { items: Product[], total, page, pages }
 *   GET /products/facets               -> { categories: {slug: n}, brands: {slug: n}, maxPrice, total }
 *   GET /products/by-ids?ids=a,b       -> Product[]
 *   GET /products/:slug                -> Product
 *   GET /products/:slug/reviews        -> Review[]
 *   GET /products/:slug/related        -> Product[]
 */
const productService = {
  list: (params = {}) => api.get('/products', { params }).then(unwrap),
  facets: (params = {}) => api.get('/products/facets', { params }).then(unwrap),
  byIds: (ids = []) => (ids.length ? api.get('/products/by-ids', { params: { ids: ids.join(',') } }).then(unwrap) : Promise.resolve([])),
  get: (slug) => api.get(`/products/${slug}`).then(unwrap),
  reviews: (slug) => api.get(`/products/${slug}/reviews`).then(unwrap),
  addReview: (slug, data) => api.post(`/products/${slug}/reviews`, data).then(unwrap), // POST {rating,title,text} (auth required)
  related: (slug) => api.get(`/products/${slug}/related`).then(unwrap),
  search: (q) => api.get('/products', { params: { q, limit: 5 } }).then(unwrap),
}

export default productService
