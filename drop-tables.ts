import { sql } from 'drizzle-orm'
import { db } from './src/db'

const tables = [
  'account',
  'bitstream',
  'collection',
  'community',
  'item',
  'profile',
  'session',
  'user',
  'verification',
]

console.log('Starting to drop tables...')

await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`)

for (const table of tables) {
  try {
    await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${table}\``))
    console.log(`Dropped ${table}`)
  } catch (err) {
    console.error(`Failed to drop ${table}:`, err)
  }
}

await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`)

console.log('All tables dropped. Ready for clean push.')
process.exit(0)
