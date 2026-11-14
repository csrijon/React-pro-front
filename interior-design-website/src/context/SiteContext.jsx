import { createContext, useContext, useEffect, useMemo } from 'react';
import { useAsync } from '../hooks/useAsync';
import { pagesApi, settingsApi, trackApi, normalizePages, normalizeSettings } from '../services/api';
import { seedPages, seedSettings } from '../data/misc';
import { applyTheme, clearTheme } from '../utils/theme';
import { readSiteCache, writeSiteCache } from '../utils/siteCache';

const SiteContext = createContext(null);
const FALLBACK = { pages: seedPages, settings: seedSettings, site: seedPages.site, loading: false };

/** Loads editable site content once (pages + settings) and applies theme, favicon and default SEO. */
export function SiteProvider({ children }) {
  // In production the server inlines the content into the HTML (window.__SITE__), so nothing has to be fetched.
  const boot = typeof window !== 'undefined' ? window.__SITE__ : null;
  const cached = useMemo(() => (boot ? { pages: normalizePages(boot.pages), settings: normalizeSettings(boot.settings) } : readSiteCache()), [boot]);
  const pages = useAsync(() => (boot ? Promise.resolve(cached.pages) : pagesApi.get()), []);
  const settings = useAsync(() => (boot ? Promise.resolve(cached.settings) : settingsApi.get()), []);
  useEffect(() => { if (pages.data) writeSiteCache({ pages: pages.data }); }, [pages.data]);
  useEffect(() => { if (settings.data) writeSiteCache({ settings: settings.data }); }, [settings.data]);
  useEffect(() => { trackApi.visit(); }, []);

  const value = useMemo(() => {
    const p = pages.data || cached?.pages || seedPages;
    return { pages: p, settings: settings.data || cached?.settings || seedSettings, site: p.site || seedPages.site, loading: pages.loading || settings.loading };
  }, [pages.data, pages.loading, settings.data, settings.loading, cached]);

  const theme = value.settings.theme;
  useEffect(() => { applyTheme(theme); }, [theme]);
  useEffect(() => clearTheme, []); // admin keeps its own fixed look

  const favicon = value.settings.favicon;
  useEffect(() => {
    if (!favicon) return undefined;
    const link = document.querySelector('link[rel="icon"]');
    const prev = link?.getAttribute('href');
    link?.setAttribute('href', favicon);
    link?.removeAttribute('type');
    return () => { if (prev) link?.setAttribute('href', prev); };
  }, [favicon]);

  const seoDesc = value.settings.seo?.description;
  useEffect(() => {
    if (!seoDesc) return;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = seoDesc;
  }, [seoDesc]);

  // First ever visit: wait for the content so the default text never flashes before the admin's version.
  const ready = !!cached || !value.loading;
  return <SiteContext.Provider value={value}>{ready ? children : <div className="min-h-screen bg-cream" aria-busy="true" />}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext) || FALLBACK;
export const useHasSite = () => !!useContext(SiteContext);
