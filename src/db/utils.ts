import { sql } from 'drizzle-orm'
import { timestamp, varchar } from 'drizzle-orm/mysql-core'

export const createdAt = timestamp('created_at').defaultNow().notNull()
export const updatedAt = timestamp('updated_at')
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull()
// export const id = uuid('id').primaryKey().defaultRandom()

export const id = varchar('id', { length: 255 })
  .default(sql`(UUID())`)
  .primaryKey()
