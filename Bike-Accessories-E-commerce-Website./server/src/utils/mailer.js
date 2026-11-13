import nodemailer from 'nodemailer'
import { config } from '../config/env.js'

let transport
const getTransport = () => {
  if (!config.smtp) return null
  transport ??= nodemailer.createTransport({
    host: config.smtp.host, port: config.smtp.port, secure: config.smtp.port === 465,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
  })
  return transport
}

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
export const html = (title, body) =>
  `<div style="font-family:Arial,sans-serif;background:#0b0d10;padding:24px"><div style="max-width:560px;margin:auto;background:#15181d;color:#fff;border-radius:12px;padding:28px;border-top:4px solid #ef252b"><h2 style="margin:0 0 12px">${esc(title)}</h2>${body}<p style="color:#a7adb5;font-size:12px;margin-top:28px">MotoGear · Premium bike accessories</p></div></div>`

/** Never throws: email problems must not break an order or sign-up. */
export async function sendMail({ to, subject, html: body, text }) {
  const t = getTransport()
  if (!t) {
    // Email bodies contain secrets (password-reset links). Print them ONLY on a developer machine, never in
    // staging/production logs; elsewhere just record that nothing was sent.
    if (config.env === 'development') console.log(`[mail:not-sent - SMTP not configured] to=${to} subject="${subject}"\n${text || ''}`)
    else if (!config.isTest) console.warn(`[mail] not sent (SMTP not configured): subject="${subject}"`)
    return false
  }
  try {
    await t.sendMail({ from: config.mailFrom, to, subject, html: body, text })
    return true
  } catch (err) {
    console.error('[mail] failed:', err.message)
    return false
  }
}
