import mongoose from 'mongoose'
import { env } from './config/env.js'
import { app } from './app.js'

mongoose.connect(env.mongo).then(() => {
  console.log('MongoDB connected')
  app.listen(env.port, () => console.log(`EstateHub API running on http://localhost:${env.port}`))
}).catch((e) => { console.error('Could not connect to MongoDB:', e.message); process.exit(1) })
