import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { SiteProvider } from '../context/SiteContext';

function Shell() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-2 focus:left-2 focus:bg-forest focus:text-cream focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <m.main id="main" key={pathname} className="flex-1" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}><Outlet /></Suspense>
      </m.main>
      <Footer />
    </div>
  );
}

export default function PublicLayout() {
  return <SiteProvider><Shell /></SiteProvider>;
}
