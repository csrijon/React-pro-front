import { useEffect } from 'react'

export function useSEO(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | EstateHub` : 'EstateHub – Find Your Dream Property'
    if (description) {
      let m = document.querySelector('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
      m.content = description
    }
  }, [title, description])
}
