import 'dotenv/config'
import { drizzle } from 'drizzle-orm/tidb-serverless'
import * as schema from './schemas/index'

const databaseUrl = process.env.DATABASE_URL
let db: any

try {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  db = drizzle(databaseUrl, {
    schema,
  })
} catch (error: any) {
  console.error('Database Initialization Error:', error)
  // In production, we still want to throw so the server knows it's unhealthy,
  // but we provide a cleaner error message if possible.
  throw new Error(`Failed to initialize database: ${error.message}`)
}

export { db }
