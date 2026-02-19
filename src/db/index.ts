import 'dotenv/config'
import { drizzle } from 'drizzle-orm/tidb-serverless'
import * as schema from './schemas/index'

const db = drizzle(process.env.DATABASE_URL!, {
  schema,
})

export { db }
