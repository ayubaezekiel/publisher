import { relations } from 'drizzle-orm'
import { index, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'
import { createdAt, id, updatedAt } from '../utils'
import { item } from './items'

export const bitstream = mysqlTable(
  'bitstream',
  {
    id,
    name: text('name').notNull(), // Filename e.g. "thesis.pdf"
    description: text('description'),

    sizeBytes: int('size_bytes').notNull(),
    mimeType: text('mime_type').notNull(), // e.g. "application/pdf"
    checksum: text('checksum'), // MD5 or SHA256

    url: text('url').notNull(), // Path in storage (R2/S3)

    bundleName: varchar('bundle_name', { length: 255 })
      .default('ORIGINAL')
      .notNull(), // ORIGINAL, THUMBNAIL, LICENSE, TEXT

    itemId: varchar('item_id', { length: 255 })
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
