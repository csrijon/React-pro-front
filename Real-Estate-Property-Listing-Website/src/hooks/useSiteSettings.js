import { useSite } from '../context/SiteContext'
/** The owner's website settings (company, logo, contact details, social links, page text). Falls back to defaults while loading. */
export const useSiteSettings = () => useSite().site
