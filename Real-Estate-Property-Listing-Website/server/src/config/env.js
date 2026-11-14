import 'dotenv/config'

const required = (k) => { if (!process.env[k]) throw new Error(`Missing required env var ${k}. Copy .env.example to .env`); return process.env[k] }

export const env = {
  port: +process.env.PORT || 5000,
  mongo: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/estatehub',
  jwtSecret: required('JWT_SECRET'),
  jwtExpires: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
  publicUrl: process.env.PUBLIC_URL || '',
  prod: process.env.NODE_ENV === 'production',
  smtp: { host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 587, user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  mailFrom: process.env.MAIL_FROM || 'EstateHub <no-reply@estatehub.com>',
  notifyEmail: process.env.NOTIFY_EMAIL,
}
