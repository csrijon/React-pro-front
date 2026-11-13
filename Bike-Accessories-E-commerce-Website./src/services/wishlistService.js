import api, { unwrap } from './api'
import { storage, KEYS } from '../utils/storage'

/** GET /wishlist -> string[] (product ids) | PUT /wishlist {ids} -> string[] */
const wishlistService = {
  get: () => api.get('/wishlist').then(unwrap),
  save: (ids) => (storage.get(KEYS.token) ? api.put('/wishlist', { ids }).then(unwrap) : Promise.resolve(ids)),
}

export default wishlistService
