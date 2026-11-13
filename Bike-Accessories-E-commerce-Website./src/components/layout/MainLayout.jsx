import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { PageSkeleton } from '../common/Skeletons'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function MainLayout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-brand-solid focus:px-4 focus:py-2">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main" className="min-h-screen flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <div key={pathname} className="page-in">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
