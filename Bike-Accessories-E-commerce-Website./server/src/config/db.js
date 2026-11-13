import mongoose from 'mongoose'
import { config } from './env.js'

export async function connectDB(uri = config.mongoUri) {
  mongoose.connection.on('error', (e) => console.error('[mongo] error', e.message))
  mongoose.connection.on('disconnected', () => console.warn('[mongo] disconnected'))
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  if (!config.isTest) console.log(`[mongo] connected (${mongoose.connection.name})`)
}

export const disconnectDB = () => mongoose.disconnect()
