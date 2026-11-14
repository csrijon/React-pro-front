import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { preloadAdmin } from '../routes/adminPages';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => { document.title = 'Admin — Domus Studio'; }, [pathname]);
  // Keep the page background dark (no cream flash on overscroll/transitions) and warm the page chunks.
  useEffect(() => {
    const prev = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = '#202321'; document.body.style.backgroundColor = '#202321';
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
    idle(preloadAdmin);
    return () => { document.documentElement.style.backgroundColor = prev; document.body.style.backgroundColor = ''; };
  }, []);
  return (
    <div className="min-h-screen bg-charcoal text-cream">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-60 min-h-screen flex flex-col">
        <AdminHeader onMenu={() => setOpen(true)} />
        <m.main key={pathname} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          <Suspense fallback={<LoadingSpinner dark label="Loading" className="min-h-[50vh]" />}><Outlet /></Suspense>
        </m.main>
      </div>
    </div>
  );
}
