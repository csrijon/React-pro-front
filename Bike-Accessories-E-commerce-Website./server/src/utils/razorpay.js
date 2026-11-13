import crypto from 'node:crypto'
import { config } from '../config/env.js'
import { ApiError } from './helpers.js'

export const paymentsEnabled = () => !!config.razorpay

/** Create a Razorpay order via the REST API (amount in rupees -> paise). */
export async function createRazorpayOrder({ amount, receipt }) {
  if (!config.razorpay) throw new ApiError(503, 'Online payments are not available right now')
  const auth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString('base64')
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'INR', receipt, payment_capture: 1 }),
  })
  if (!res.ok) {
    console.error('[razorpay] order failed', res.status, await res.text())
    throw new ApiError(502, 'Could not start the payment. Please try again.')
  }
  return res.json()
}

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b))
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  if (!config.razorpay) return false
  const expected = crypto.createHmac('sha256', config.razorpay.keySecret).update(`${orderId}|${paymentId}`).digest('hex')
  return safeEqual(expected, signature)
}

export function verifyWebhookSignature(rawBody, signature) {
  const secret = config.razorpay?.webhookSecret
  if (!secret || !signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return safeEqual(expected, signature)
}
