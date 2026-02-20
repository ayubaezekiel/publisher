import 'dotenv/config'
import { drizzle } from 'drizzle-orm/tidb-serverless'
import * as schema from './schemas/index'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const db = drizzle(databaseUrl, {
  schema,
})

export { db }
