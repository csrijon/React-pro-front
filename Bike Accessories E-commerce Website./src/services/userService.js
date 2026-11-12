import api, { unwrap } from './api'

/**
 *   PUT    /users/profile        {name,phone,dob,gender,bike} -> {user}
 *   PUT    /users/password       {currentPassword,newPassword}
 *   GET    /users/addresses      -> Address[]
 *   POST   /users/addresses      -> Address
 *   PUT    /users/addresses/:id  -> Address
 *   DELETE /users/addresses/:id
 */
const userService = {
  updateProfile: (data) => api.put('/users/profile', data).then(unwrap),
  changePassword: (data) => api.put('/users/password', data).then(unwrap),
  addresses: () => api.get('/users/addresses').then(unwrap),
  addAddress: (a) => api.post('/users/addresses', a).then(unwrap),
  updateAddress: (id, a) => api.put(`/users/addresses/${id}`, a).then(unwrap),
  removeAddress: (id) => api.delete(`/users/addresses/${id}`).then(unwrap),
}

export default userService
