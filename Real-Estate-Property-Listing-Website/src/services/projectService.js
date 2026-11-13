import { USE_MOCK, http } from './config'
import { createStore } from './mockStore'
import { projects } from '../data/projects'
import { uid } from '../utils/format'

const store = createStore('projects', projects)

export const projectService = {
  list: () => (USE_MOCK ? store.all() : http('/projects')),
  get: (id) => (USE_MOCK ? store.get(id) : http(`/projects/${id}`)),
  create: (d) => (USE_MOCK ? store.add({ id: uid('pr'), ...d }) : http('/projects', { method: 'POST', body: d })),
  update: (id, d) => (USE_MOCK ? store.update(id, d) : http(`/projects/${id}`, { method: 'PUT', body: d })),
  remove: (id) => (USE_MOCK ? store.remove(id) : http(`/projects/${id}`, { method: 'DELETE' })),
}
