// RFC 6238 time-based one-time passwords (Google Authenticator / Authy / 1Password compatible). No dependencies.
import crypto from 'node:crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const STEP = 30

export function base32Encode(buf) {
  let bits = 0, value = 0, out = ''
  for (const byte of buf) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) { out += ALPHABET[(value >>> (bits - 5)) & 31]; bits -= 5 }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31]
  return out
}
export function base32Decode(str) {
  let bits = 0, value = 0
  const out = []
  for (const ch of str.replace(/=+$/, '').toUpperCase()) {
    const i = ALPHABET.indexOf(ch)
    if (i < 0) throw new Error('invalid base32')
    value = (value << 5) | i
    bits += 5
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 255); bits -= 8 }
  }
  return Buffer.from(out)
}

export const newSecret = () => base32Encode(crypto.randomBytes(20)) // 160-bit secret

export function hotp(secret, counter) {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64BE(BigInt(counter))
  const h = crypto.createHmac('sha1', base32Decode(secret)).update(buf).digest()
  const o = h[h.length - 1] & 15
  const n = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]
  return String(n % 1_000_000).padStart(6, '0')
}
export const totpAt = (secret, time = Date.now()) => hotp(secret, Math.floor(time / 1000 / STEP))

/**
 * Returns the matched time-step counter or null. `after` is the last accepted counter -
 * a code can only be used once (replay protection).
 */
export function verifyTotp(secret, code, { window = 1, after = 0, time = Date.now() } = {}) {
  if (!/^\d{6}$/.test(String(code))) return null
  const now = Math.floor(time / 1000 / STEP)
  for (let i = -window; i <= window; i++) {
    const counter = now + i
    if (counter <= after) continue
    const expected = Buffer.from(hotp(secret, counter))
    const given = Buffer.from(String(code))
    if (expected.length === given.length && crypto.timingSafeEqual(expected, given)) return counter
  }
  return null
}

export const otpauthUrl = (secret, account) =>
  `otpauth://totp/MotoGear:${encodeURIComponent(account)}?secret=${secret}&issuer=MotoGear&algorithm=SHA1&digits=6&period=${STEP}`
