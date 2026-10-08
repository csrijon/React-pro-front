const path = require('path');
const crypto = require('crypto');
// Load server/.env (or a .env in the project root) when present; real environment variables win.
require('dotenv').config({ path: [path.join(__dirname, '..', '.env'), path.join(__dirname, '..', '..', '.env')], quiet: true });

const isProd = process.env.NODE_ENV === 'production';

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
  // In development a random secret is used when none is configured (sessions reset on restart).
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
  // PostgreSQL connection string, e.g. postgres://user:pass@host:5432/dbname
  databaseUrl: process.env.DATABASE_URL || '',
  // Set DATABASE_SSL=true for managed hosts that require TLS (Neon, Supabase, Render, Railway...).
  databaseSsl: process.env.DATABASE_SSL === 'true',
  // Optional: keep all tables in a dedicated schema (the test-suite uses this to stay isolated).
  dbSchema: process.env.DB_SCHEMA || '',
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'),
  clientDist: path.join(__dirname, '..', '..', 'client', 'dist'),
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || null,
  cookieName: 'shoe_session',
  sessionDays: 7,
};
