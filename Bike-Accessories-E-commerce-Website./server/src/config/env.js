import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  // Comma separated list of allowed browser origins, e.g. https://motogear.in,https://www.motogear.in
  CLIENT_URL: z.string().default('http://localhost:5173'),
  // Public base URL of this API (used to build absolute upload URLs)
  PUBLIC_URL: z.string().default('http://localhost:5000'),
  TRUST_PROXY: z.coerce.number().default(0),
  // Seconds to keep public catalogue responses in memory (0 = off). Default 15, off under tests.
  RESPONSE_CACHE_TTL: z.coerce.number().min(0).max(600).optional(),
  // Admins must use two-factor auth. Defaults to ON in production, OFF elsewhere.
  REQUIRE_ADMIN_2FA: z.enum(['true', 'false']).optional(),
  UPLOAD_DIR: z.string().default('uploads'),
  // Email (optional). Without SMTP_HOST emails are logged instead of sent.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('MotoGear <no-reply@motogear.in>'),
  ADMIN_NOTIFY_EMAIL: z.string().optional(),
  // Razorpay (optional). Without keys only Cash on Delivery is offered.
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  // Used by `npm run seed:admin`
  ADMIN_NAME: z.string().default('Store Admin'),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment configuration:\n' + parsed.error.issues.map((i) => ` - ${i.path.join('.')}: ${i.message}`).join('\n'))
  process.exit(1)
}

const e = parsed.data
if (e.NODE_ENV === 'production') {
  // In production every browser-facing URL must be HTTPS (cookies/tokens/payment pages must never travel in clear text)
  const insecure = [...e.CLIENT_URL.split(','), e.PUBLIC_URL].map((u) => u.trim()).filter((u) => u && !/^https:\/\//i.test(u) && !/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(u))
  if (insecure.length) {
    console.error(`In production CLIENT_URL and PUBLIC_URL must use https:// (found: ${insecure.join(', ')}).`)
    process.exit(1)
  }
  if (!e.SMTP_HOST) console.warn('[security] SMTP is not configured: password-reset and order emails cannot be delivered.')
  const weak = ['change-me', 'secret', 'changeme']
  if (e.JWT_SECRET.length < 32 || weak.some((w) => e.JWT_SECRET.toLowerCase().includes(w))) {
    console.error('In production JWT_SECRET must be a random string of at least 32 characters.')
    process.exit(1)
  }
}

export const config = {
  env: e.NODE_ENV,
  isProd: e.NODE_ENV === 'production',
  isTest: e.NODE_ENV === 'test',
  port: e.PORT,
  mongoUri: e.MONGODB_URI,
  jwtSecret: e.JWT_SECRET,
  jwtExpiresIn: e.JWT_EXPIRES_IN,
  clientUrls: e.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean),
  publicUrl: e.PUBLIC_URL.replace(/\/$/, ''),
  trustProxy: e.TRUST_PROXY,
  cacheTtl: e.RESPONSE_CACHE_TTL ?? (e.NODE_ENV === 'test' ? 0 : 15),
  requireAdmin2fa: (e.REQUIRE_ADMIN_2FA ?? (e.NODE_ENV === 'production' ? 'true' : 'false')) === 'true',
  uploadDir: e.UPLOAD_DIR,
  smtp: e.SMTP_HOST ? { host: e.SMTP_HOST, port: e.SMTP_PORT, user: e.SMTP_USER, pass: e.SMTP_PASS } : null,
  mailFrom: e.MAIL_FROM,
  adminNotifyEmail: e.ADMIN_NOTIFY_EMAIL,
  razorpay: e.RAZORPAY_KEY_ID && e.RAZORPAY_KEY_SECRET ? { keyId: e.RAZORPAY_KEY_ID, keySecret: e.RAZORPAY_KEY_SECRET, webhookSecret: e.RAZORPAY_WEBHOOK_SECRET } : null,
  admin: { name: e.ADMIN_NAME, email: e.ADMIN_EMAIL, password: e.ADMIN_PASSWORD },
}
