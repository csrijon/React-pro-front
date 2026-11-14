import { storage } from './storage';

// Last-loaded public content, so repeat visits render the admin's edits immediately (no flash of default text/colours).
const KEY = 'domus.site.cache.v1';
export const readSiteCache = () => storage.get(KEY, null);
export const writeSiteCache = (patch) => storage.set(KEY, { ...(readSiteCache() || {}), ...patch });
