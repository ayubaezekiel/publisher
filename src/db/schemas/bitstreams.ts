import { relations } from 'drizzle-orm'
import { pgTable, text, uuid, index, integer } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils'
import { item } from './items'

export const bitstream = pgTable(
  'bitstream',
  {
    id,
    name: text('name').notNull(), // Filename e.g. "thesis.pdf"
    description: text('description'),

    sizeBytes: integer('size_bytes').notNull(),
    mimeType: text('mime_type').notNull(), // e.g. "application/pdf"
    checksum: text('checksum'), // MD5 or SHA256

    url: text('url').notNull(), // Path in storage (R2/S3)

    bundleName: text('bundle_name').default('ORIGINAL').notNull(), // ORIGINAL, THUMBNAIL, LICENSE, TEXT

    itemId: uuid('item_id')
      .notNull()
      .references(() => item.id, { onDelete: 'cascade' }),

    createdAt,
    updatedAt,
  },
  (table) => [index('bitstream_item_idx').on(table.itemId)],
)

export const bitstreamRelations = relations(bitstream, ({ one }) => ({
  item: one(item, {
    fields: [bitstream.itemId],
    references: [item.id],
  }),
}))

export type Bitstream = typeof bitstream.$inferSelect
export type NewBitstream = typeof bitstream.$inferInsert
