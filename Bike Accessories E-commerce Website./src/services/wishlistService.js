import api, { unwrap } from './api'

/** GET /wishlist -> string[] (product ids) | PUT /wishlist {ids} -> string[] */
const wishlistService = {
  get: () => api.get('/wishlist').then(unwrap),
  save: (ids) => api.put('/wishlist', { ids }).then(unwrap),
}

export default wishlistService
