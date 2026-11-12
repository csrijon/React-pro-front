import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | MotoGear` : 'MotoGear | Premium Bike Accessories'
  }, [title])
}
