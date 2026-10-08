import { api } from './api.js';

export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('files', file);
  const { urls } = await api.post('/api/admin/upload', fd);
  return urls[0];
}
