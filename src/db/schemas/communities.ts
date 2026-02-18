import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils'
import { collection } from './collections'

export const community = pgTable(
  'community',
  {
    id,
    name: text('name').notNull(),
    shortDescription: text('short_description'),
    introductoryText: text('introductory_text'),
    logoUrl: text('logo_url'),
    slug: text('slug').notNull().unique(),

    // Self-referencing relationship for sub-communities
    parentCommunityId: uuid('parent_community_id'),

    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('community_slug_idx').on(table.slug),
    index('community_parent_idx').on(table.parentCommunityId),
  ],
)

export const communityRelations = relations(community, ({ one, many }) => ({
  parentCommunity: one(community, {
    fields: [community.parentCommunityId],
    references: [community.id],
    relationName: 'subCommunities',
  }),
  subCommunities: many(community, {
    relationName: 'subCommunities',
  }),
  collections: many(collection),
}))

export type Community = typeof community.$inferSelect
export type NewCommunity = typeof community.$inferInsert
