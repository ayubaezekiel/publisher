import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils'
import { community } from './communities'
import { item } from './items'

export const collection = pgTable(
  'collection',
  {
    id,
    name: text('name').notNull(),
    shortDescription: text('short_description'),
    introductoryText: text('introductory_text'),
    logoUrl: text('logo_url'),
    slug: text('slug').notNull().unique(),

    // Relationship
    communityId: uuid('community_id')
      .notNull()
      .references(() => community.id, { onDelete: 'cascade' }),

    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('collection_slug_idx').on(table.slug),
    index('collection_community_idx').on(table.communityId),
  ],
)

export const collectionRelations = relations(collection, ({ one, many }) => ({
  community: one(community, {
    fields: [collection.communityId],
    references: [community.id],
  }),
  items: many(item),
}))

export type Collection = typeof collection.$inferSelect
export type NewCollection = typeof collection.$inferInsert
