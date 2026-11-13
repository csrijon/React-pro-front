/**
 * Brings the database indexes in line with the models (creates new ones, drops ones no longer declared).
 *   npm run db:sync-indexes
 * Run once after upgrading an existing database. Index builds are online on MongoDB 4.2+, but build them
 * during a quiet period on very large collections. Review `db.<collection>.getIndexes()` first if you added indexes by hand.
 */
import { pathToFileURL } from 'node:url'
import { connectDB, disconnectDB } from '../config/db.js'
import { mongoose } from '../models/index.js'

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await connectDB()
  for (const name of mongoose.modelNames()) {
    const dropped = await mongoose.model(name).syncIndexes()
    console.log(`${name.padEnd(12)} indexes in sync${dropped.length ? ` (dropped: ${dropped.join(', ')})` : ''}`)
  }
  await disconnectDB()
}
