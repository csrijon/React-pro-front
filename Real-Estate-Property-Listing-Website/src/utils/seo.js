import { useEffect } from 'react'
import { useSite } from '../context/SiteContext'

export function useSEO(title, description) {
  const { site } = useSite()
  useEffect(() => {
    document.title = title ? `${title} | ${site.company}` : `${site.company} – ${site.hero.title}`
    const desc = description || site.seo.description
    if (desc) {
      let m = document.querySelector('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
      m.content = desc
    }
  }, [title, description, site.company, site.hero.title, site.seo.description])
}
