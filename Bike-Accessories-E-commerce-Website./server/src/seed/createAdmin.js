/**
 * Creates (or promotes) the first admin account from environment variables:
 *   ADMIN_EMAIL=you@shop.com ADMIN_PASSWORD='a-strong-password' npm run seed:admin
 * There is intentionally no default password.
 */
import bcrypt from 'bcrypt'
import { config } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import { User } from '../models/index.js'

const { email, password, name } = config.admin
if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars, letters + numbers) before running this script.')
  process.exit(1)
}
if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
  console.error('ADMIN_PASSWORD must be at least 8 characters and include letters and numbers.')
  process.exit(1)
}

await connectDB()
const hash = await bcrypt.hash(password, 12)
const existing = await User.findOne({ email: email.toLowerCase() })
if (existing) {
  existing.role = 'admin'
  existing.isBlocked = false
  existing.password = hash
  existing.passwordChangedAt = new Date()
  await existing.save()
  console.log(`Updated existing user ${email} -> admin (password reset)`)
} else {
  await User.create({ name, email, password: hash, role: 'admin' })
  console.log(`Created admin ${email}`)
}
await disconnectDB()
