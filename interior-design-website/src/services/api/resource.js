import client, { USE_MOCK } from './client';
import { storage } from '../../utils/storage';
import { uid } from '../../utils/helpers';

const delay = (v, ms = 350) => new Promise((r) => setTimeout(() => r(v), ms));

/**
 * Creates a CRUD service. With no backend configured it persists to localStorage;
 * otherwise it calls REST endpoints:  GET /x, GET /x/:id, POST /x, PUT /x/:id, DELETE /x/:id
 */
export function createResource(name, endpoint, seed) {
  const key = `domus.mock.${name}.v1`;
  const read = () => {
    const data = storage.get(key, null);
    if (data) return data;
    storage.set(key, seed);
    return seed;
  };
  const write = (data) => { if (!storage.set(key, data)) throw new Error('Local storage is full. Remove some images and try again.'); };

  if (!USE_MOCK) {
    return {
      list: (params) => client.get(endpoint, { params }),
      get: (id) => client.get(`${endpoint}/${id}`),
      create: (data) => client.post(endpoint, data),
      update: (id, data) => client.put(`${endpoint}/${id}`, data),
      remove: (id) => client.delete(`${endpoint}/${id}`),
    };
  }

  return {
    list: async () => delay([...read()]),
    get: async (idOrSlug) => {
      const item = read().find((x) => x.id === idOrSlug || x.slug === idOrSlug);
      if (!item) throw Object.assign(new Error('Not found'), { status: 404 });
      return delay(item, 250);
    },
    create: async (data) => {
      const item = { ...data, id: uid(name[0]), createdAt: new Date().toISOString() };
      write([item, ...read()]);
      return delay(item);
    },
    update: async (id, data) => {
      const list = read();
      const idx = list.findIndex((x) => x.id === id);
      if (idx < 0) throw new Error('Not found');
      list[idx] = { ...list[idx], ...data };
      write(list);
      return delay(list[idx], 250);
    },
    remove: async (id) => { write(read().filter((x) => x.id !== id)); return delay({ id }, 250); },
    // test/dev helpers
    _read: read,
  };
}

export { delay };
