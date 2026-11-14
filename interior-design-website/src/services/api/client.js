import axios from 'axios';
import { storage } from '../../utils/storage';

// All endpoints are configured here. Components never build URLs themselves.
export const API_URL = import.meta.env.VITE_API_URL || '';
export const USE_MOCK = !API_URL || import.meta.env.VITE_USE_MOCK === 'true';
export const TOKEN_KEY = 'domus.token';

export const ENDPOINTS = {
  login: '/auth/login',
  me: '/auth/me',
  changePassword: '/auth/change-password',
  projects: '/projects',
  services: '/services',
  designers: '/designers',
  inquiries: '/inquiries',
  media: '/media',
  pages: '/pages',
  settings: '/settings',
  dashboard: '/dashboard',
};

const client = axios.create({ baseURL: API_URL, timeout: 15000 });

client.interceptors.request.use((config) => {
  const token = storage.get(TOKEN_KEY, null) || sessionStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralised error handling: every rejection becomes an Error with a friendly message.
client.interceptors.response.use(
  (r) => r.data,
  (err) => {
    const status = err.response?.status;
    if (status === 401) window.dispatchEvent(new Event('domus:unauthorized'));
    const message = err.response?.data?.message || (err.code === 'ECONNABORTED' ? 'The request timed out. Try again.' : err.message) || 'Something went wrong.';
    return Promise.reject(Object.assign(new Error(message), { status }));
  },
);

export default client;
