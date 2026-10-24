const path = require('path');
const crypto = require('crypto');
// Load server/.env (or a .env in the project root) when present; real environment variables win.
require('dotenv').config({ path: [path.join(__dirname, '..', '.env'), path.join(__dirname, '..', '..', '.env')], quiet: true });

const isProd = process.env.NODE_ENV === 'production';

// Supabase project root only (e.g. https://usiyhwimzmcabcgzfvge.supabase.co). Trailing slashes and
// API paths such as /rest/v1 are not part of the Storage base URL and would break uploads otherwise.
function normalizeSupabaseUrl(raw) {
  let u = String(raw || '').trim().replace(/\/+$/, '');
  if (/\/rest\/v1\/?$/i.test(u)) u = u.replace(/\/rest\/v1\/?$/i, '');
  try {
    const p = new URL(u);
    p.pathname = p.pathname.replace(/\/+$/, '');
    u = p.toString().replace(/\/+$/, '');
  } catch { /* keep the string as-is when it is not absolute URL shaped */ }
  return u;
}

if (!process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL must be set (e.g. postgres://user:password@localhost:5432/shoeshop).');
  process.exit(1);
}
if (isProd && !process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET must be set in production.');
  process.exit(1);
}

module.exports = {
  isProd,
  port: Number(process.env.PORT) || 4000,
  // Development-only per-request timing log (query count + database time). Never on in production.
  logTiming: !isProd || process.env.LOG_TIMING === 'true',
  // In development a random secret is used when none is configured (sessions reset on restart).
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
  // PostgreSQL connection string, e.g. postgres://user:pass@host:5432/dbname
  databaseUrl: process.env.DATABASE_URL || '',
  // Set DATABASE_SSL=true for managed hosts that require TLS (Neon, Supabase, Render, Railway...).
  databaseSsl: process.env.DATABASE_SSL === 'true',
  // Optional: keep all tables in a dedicated schema (the test-suite uses this to stay isolated).
  dbSchema: process.env.DB_SCHEMA || '',
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'),
  // Cloud image storage (Supabase Storage). When both are set, uploads go to the bucket instead of local disk.
  // Normalized to the project root URL: trailing slashes and any /rest/v1 API path are stripped so the
  // Storage endpoints below always point at the object storage of the right project.
  supabaseUrl: normalizeSupabaseUrl(process.env.SUPABASE_URL),
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseBucket: process.env.SUPABASE_BUCKET || 'product-images',
  clientDist: path.join(__dirname, '..', '..', 'client', 'dist'),
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || null,
  cookieName: 'shoe_session',
  sessionDays: 7,
};
