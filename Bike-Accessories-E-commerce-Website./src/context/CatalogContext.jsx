import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import categoryService from '../services/categoryService'
import contentService from '../services/contentService'
import { categories as staticCategories } from '../data/categories'
import { brands as staticBrands } from '../data/brands'
import { storage } from '../utils/storage'

const CatalogContext = createContext(null)
const CACHE = 'mg_catalog'

/**
 * Categories & brands are managed in the admin panel, so the navigation / filters read them from the API.
 * The last response is cached so the menu renders instantly on the next visit; the bundled lists are a first-run fallback.
 */
export function CatalogProvider({ children }) {
  const cached = storage.get(CACHE, null)
  const [categories, setCategories] = useState(cached?.categories || staticCategories)
  const [brands, setBrands] = useState(cached?.brands || staticBrands)

  useEffect(() => {
    Promise.all([categoryService.list(), contentService.brands()])
      .then(([c, b]) => {
        setCategories(c)
        setBrands(b)
        storage.set(CACHE, { categories: c, brands: b })
      })
      .catch(() => {}) // keep cached/fallback data when the API is unreachable
  }, [])

  const value = useMemo(() => ({ categories, brands }), [categories, brands])
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCatalog = () => {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
