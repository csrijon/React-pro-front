import api, { unwrap } from './api'

/**
 * Auth API (all token handling lives in AuthContext).
 *   POST /auth/register         {name,email,phone,password}  -> {token,user}
 *   POST /auth/login            {email,password}             -> {token,user}
 *   GET  /auth/me                                            -> {user}
 *   POST /auth/forgot-password  {email}                      -> {message}
 *   POST /auth/reset-password   {token,password}             -> {message}
 */
const authService = {
  register: (data) => api.post('/auth/register', data).then(unwrap),
  login: (data) => api.post('/auth/login', data).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(unwrap),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }).then(unwrap),
}

export default authService
