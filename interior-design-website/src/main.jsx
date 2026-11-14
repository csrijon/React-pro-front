import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { applyTheme } from './utils/theme';
import { readSiteCache } from './utils/siteCache';

// Apply the last-known theme before first paint (public site only; the admin has a fixed look).
if (!location.pathname.startsWith('/admin')) applyTheme((window.__SITE__?.settings || readSiteCache()?.settings)?.theme);

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
