const SRC = 'https://checkout.razorpay.com/v1/checkout.js'

function loadScript() {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SRC}"]`)
    const s = existing || Object.assign(document.createElement('script'), { src: SRC, async: true })
    s.addEventListener('load', resolve, { once: true })
    s.addEventListener('error', () => reject(new Error('Could not load the payment window. Check your connection and try again.')), { once: true })
    if (!existing) document.body.appendChild(s)
  })
}

/**
 * Opens the Razorpay popup for `order.payment.checkout` (created by the backend).
 * Resolves with {razorpay_order_id, razorpay_payment_id, razorpay_signature} - send those to orderService.verifyPayment.
 * Rejects when the shopper closes the window or the payment fails.
 */
export async function payWithRazorpay(order) {
  const c = order.payment.checkout
  await loadScript()
  return new Promise((resolve, reject) => {
    const rz = new window.Razorpay({
      key: c.keyId,
      amount: c.amount,
      currency: c.currency,
      order_id: c.orderId,
      name: 'MotoGear',
      description: `Order ${order.id}`,
      prefill: { name: order.customer?.name, email: order.customer?.email, contact: order.customer?.phone },
      theme: { color: '#EF252B' },
      handler: (res) => resolve(res),
      modal: { ondismiss: () => reject(new Error('Payment window closed before completing the payment.')) },
    })
    rz.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed')))
    rz.open()
  })
}
