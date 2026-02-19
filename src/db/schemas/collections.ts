import { relations } from 'drizzle-orm'
import {
  index,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createdAt, id, updatedAt } from '../utils'
import { community } from './communities'
import { item } from './items'

export const collection = mysqlTable(
  'collection',
  {
    id,
    name: text('name').notNull(),
    shortDescription: text('short_description'),
    introductoryText: text('introductory_text'),
    logoUrl: text('logo_url'),
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    // Relationship
    communityId: varchar('community_id', { length: 255 })
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
