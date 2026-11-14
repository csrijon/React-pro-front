import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { settingsService, DEFAULTS } from '../services/settingsService'
import { applySite } from '../utils/siteApply'

const SiteContext = createContext({ site: DEFAULTS, refresh: () => {}, setSite: () => {}, tx: (s) => s })

/**
 * Loads the owner's website settings and applies them (colours, fonts, favicon, currency) BEFORE the site first renders,
 * so visitors never see a flash of the default brand. If the API is slow or down, the site shows after 2.5s with defaults.
 */
export function SiteProvider({ children }) {
  const [site, setSiteState] = useState(DEFAULTS)
  const [ready, setReady] = useState(false)
  const setSite = useCallback((s) => { applySite(s); setSiteState(s) }, [])
  const refresh = useCallback(() => settingsService.get().then((s) => { setSite(s); return s }).catch(() => DEFAULTS), [setSite])
  useEffect(() => {
    let done = false
    const finish = () => { if (!done) { done = true; setReady(true) } }
    const timer = setTimeout(finish, 2500)
    refresh().finally(() => { clearTimeout(timer); finish() })
    return () => clearTimeout(timer)
  }, [refresh])
  // `{company}` in owner-written text is replaced with the company name.
  const tx = useCallback((s = '') => String(s).replaceAll('{company}', site.company), [site.company])
  const value = useMemo(() => ({ site, refresh, setSite, tx }), [site, refresh, setSite, tx])
  // A currency change re-mounts the page so every price re-renders in the new format.
  const key = `${site.currency.symbol}|${site.currency.system}`
  return <SiteContext.Provider value={value}>{ready ? <div key={key} className="contents">{children}</div> : <div className="min-h-screen bg-surface" aria-busy="true" />}</SiteContext.Provider>
}
export const useSite = () => useContext(SiteContext)
