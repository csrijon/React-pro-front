import { lazy } from 'react';

// Each admin page is its own chunk. `preloadAdmin` fetches them all in the background
// so moving between sections never waits on the network (and never flashes).
const loaders = {
  Dashboard: () => import('../pages/admin/Dashboard'),
  Projects: () => import('../pages/admin/Projects'),
  ProjectEditor: () => import('../pages/admin/ProjectEditor'),
  Services: () => import('../pages/admin/Services'),
  Designers: () => import('../pages/admin/Designers'),
  Inquiries: () => import('../pages/admin/Inquiries'),
  Media: () => import('../pages/admin/Media'),
  Pages: () => import('../pages/admin/Pages'),
  Settings: () => import('../pages/admin/Settings'),
};

export const AdminPages = Object.fromEntries(Object.entries(loaders).map(([k, load]) => [k, lazy(load)]));
export const preloadAdmin = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
