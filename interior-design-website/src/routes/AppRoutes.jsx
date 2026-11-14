import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AdminPages as A } from './adminPages';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Home from '../pages/public/Home';

const p = (f) => lazy(f);
const Projects = p(() => import('../pages/public/Projects'));
const ProjectDetail = p(() => import('../pages/public/ProjectDetail'));
const Services = p(() => import('../pages/public/Services'));
const Designers = p(() => import('../pages/public/Designers'));
const DesignerDetail = p(() => import('../pages/public/DesignerDetail'));
const About = p(() => import('../pages/public/About'));
const Contact = p(() => import('../pages/public/Contact'));
const NotFound = p(() => import('../pages/public/NotFound'));

const Login = p(() => import('../pages/admin/Login'));

function PageFallback() {
  const dark = useLocation().pathname.startsWith('/admin');
  return <div className={dark ? 'bg-charcoal min-h-screen' : 'min-h-screen'}><LoadingSpinner dark={dark} className="min-h-screen" /></div>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="designers" element={<Designers />} />
          <Route path="designers/:slug" element={<DesignerDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<A.Dashboard />} />
            <Route path="projects" element={<A.Projects />}>
              <Route path="new" element={<A.ProjectEditor />} />
              <Route path=":id/edit" element={<A.ProjectEditor />} />
            </Route>
            <Route path="services" element={<A.Services />} />
            <Route path="designers" element={<A.Designers />} />
            <Route path="inquiries" element={<A.Inquiries />} />
            <Route path="media" element={<A.Media />} />
            <Route path="pages" element={<A.Pages />} />
            <Route path="settings" element={<A.Settings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
