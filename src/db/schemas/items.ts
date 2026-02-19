import { relations, sql } from 'drizzle-orm'
import {
  index,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'

import { createdAt, id, updatedAt } from '../utils'
import { user } from './auth-schema'
import { bitstream } from './bitstreams'
import { collection } from './collections'

export const itemStatusEnum = mysqlEnum('item_status', [
  'workflow', // In review/submission process
  'archived', // Published and visible
  'withdrawn', // Removed from public view
])
  .default('workflow')
  .notNull()

export const item = mysqlTable(
  'item',
  {
    id,

    // Core DSpace-like Metadata
    title: text('title').notNull(),
    abstract: text('abstract'),
    issueDate: timestamp('issue_date'), // Date accepted/published
    publisher: text('publisher'),
    citation: text('citation'),

    slug: varchar('slug', { length: 255 }).unique(), // Friendly URL part if needed

    status: itemStatusEnum,

    // Flexible Metadata (Dublin Core format stored as JSON)
    // Example: { "dc.contributor.author": ["Smith, John", "Doe, Jane"], "dc.subject": ["AI", "Computing"] }
    metadata: json('metadata')
      .$type<Record<string, any>>()
      .default(sql`(JSON_OBJECT())`)
      .notNull(),

    // Relationships
    collectionId: varchar('collection_id', { length: 255 })
      .notNull()
      .references(() => collection.id, { onDelete: 'cascade' }),

    submitterId: varchar('submitter_id', { length: 255 }).references(
      () => user.id,
      {
        onDelete: 'set null',
      },
    ),

    createdAt,
    updatedAt,
  },
  (table) => [
    index('item_collection_idx').on(table.collectionId),
    index('item_submitter_idx').on(table.submitterId),
    index('item_status_idx').on(table.status),
  ],
)

export const itemRelations = relations(item, ({ one, many }) => ({
  collection: one(collection, {
    fields: [item.collectionId],
    references: [collection.id],
  }),
  submitter: one(user, {
    fields: [item.submitterId],
    references: [user.id],
  }),
  bitstreams: many(bitstream),
}))

export type Item = typeof item.$inferSelect
export type NewItem = typeof item.$inferInsert
export type ItemStatus = typeof itemStatusEnum
