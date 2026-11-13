import { config } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import { createApp } from './app.js'
import { Order } from './models/index.js'
import { restoreStock } from './routes/shop.js'

await connectDB()
const app = createApp()
const server = app.listen(config.port, () => console.log(`[api] listening on :${config.port} (${config.env})`))

// Housekeeping: online orders that were never paid within 30 minutes release their reserved stock
async function expireUnpaid() {
  try {
    const stale = await Order.find({ status: 'Pending Payment', createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } }).limit(50)
    for (const o of stale) {
      o.status = 'Cancelled'
      o.cancelledAt = new Date()
      o.payment.status = 'Failed'
      o.statusHistory.push({ status: 'Cancelled', at: new Date(), note: 'Payment not completed in time' })
      await o.save()
      await restoreStock(o)
    }
    if (stale.length) console.log(`[jobs] released ${stale.length} unpaid order(s)`)
  } catch (e) {
    console.error('[jobs] expireUnpaid failed', e.message)
  }
}
const timer = setInterval(expireUnpaid, 10 * 60 * 1000)

let closing = false
async function shutdown(signal) {
  if (closing) return
  closing = true
  console.log(`[api] ${signal} received, shutting down`)
  clearInterval(timer)
  server.close(async () => {
    await disconnectDB()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e))
