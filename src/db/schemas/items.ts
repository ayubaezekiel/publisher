import { relations } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils'
import { collection } from './collections'
import { user } from './auth-schema'
import { bitstream } from './bitstreams'

export const itemStatusEnum = pgEnum('item_status', [
  'workflow', // In review/submission process
  'archived', // Published and visible
  'withdrawn', // Removed from public view
])

export const item = pgTable(
  'item',
  {
    id,

    // Core DSpace-like Metadata
    title: text('title').notNull(),
    abstract: text('abstract'),
    issueDate: timestamp('issue_date'), // Date accepted/published
    publisher: text('publisher'),
    citation: text('citation'),

    slug: text('slug').unique(), // Friendly URL part if needed

    status: itemStatusEnum('status').default('workflow').notNull(),

    // Flexible Metadata (Dublin Core format stored as JSON)
    // Example: { "dc.contributor.author": ["Smith, John", "Doe, Jane"], "dc.subject": ["AI", "Computing"] }
    metadata: jsonb('metadata')
      .$type<Record<string, any>>()
      .default({})
      .notNull(),

    // Relationships
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collection.id, { onDelete: 'cascade' }),

    submitterId: uuid('submitter_id').references(() => user.id, {
      onDelete: 'set null',
    }),

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
export type ItemStatus = (typeof itemStatusEnum.enumValues)[number]
