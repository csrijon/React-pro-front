import { USE_MOCK, http } from './config'
import { SITE_DEFAULTS, withDefaults } from '../data/siteDefaults'

const KEY = 'estatehub:settings'
export const SOCIAL_NETWORKS = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube']
export const DEFAULTS = SITE_DEFAULTS

// The Agents pages were removed, so a saved menu / footer link to them is dropped.
const legacy = (l) => !/^\/agents(\/|$)/.test(l.to)
const clean = (s) => ({ ...s, nav: s.nav.filter(legacy), footerLinks: s.footerLinks.filter(legacy) })

export const settingsService = {
  /** Always reads fresh; the SiteProvider keeps the shared copy. */
  async get() {
    if (!USE_MOCK) return clean(withDefaults(await http('/settings')))
    try { return clean(withDefaults(JSON.parse(localStorage.getItem(KEY)))) } catch { return clean(withDefaults()) }
  },
  async save(d) {
    if (!USE_MOCK) return clean(withDefaults(await http('/settings', { method: 'PUT', body: d })))
    localStorage.setItem(KEY, JSON.stringify(d))
    return clean(withDefaults(d))
  },
}
