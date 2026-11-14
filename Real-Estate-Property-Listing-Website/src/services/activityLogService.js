import { USE_MOCK, http } from './config'

/** Audit trail of who did what. Recorded by the backend, so it is empty/unavailable in demo (mock) mode. */
export const activityLogService = {
  available: !USE_MOCK,
  async list(params = {}) {
    if (USE_MOCK) return { items: [], total: 0, page: 1, pages: 1, entities: [] }
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
    return http(`/activity-log${qs ? `?${qs}` : ''}`)
  },
}
