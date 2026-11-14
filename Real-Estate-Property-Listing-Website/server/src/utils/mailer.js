import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transport = env.smtp.host ? nodemailer.createTransport({ host: env.smtp.host, port: env.smtp.port, auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined }) : null

/** Sends an email, or prints it to the console when SMTP is not configured (development). */
export async function sendMail({ to, subject, text }) {
  if (!to) return
  if (!transport) { console.log(`\n[mail:dev] To: ${to}\nSubject: ${subject}\n${text}\n`); return }
  try { await transport.sendMail({ from: env.mailFrom, to, subject, text }) } catch (e) { console.error('Mail failed:', e.message) }
}
