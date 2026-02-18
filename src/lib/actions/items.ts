import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { bitstream } from '@/db/schemas/bitstreams'
import { item } from '@/db/schemas/items'

const itemSchema = z.object({
  title: z.string().min(1),
  abstract: z.string().optional(),
  issueDate: z.date().optional(),
  publisher: z.string().optional(),
  citation: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(['workflow', 'archived', 'withdrawn']).optional(),
  collectionId: z.string().min(1),
  // JSON metadata would need a more open schema or specific fields
  metadata: z.record(z.any()).optional(),
})

export const getItems = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db.query.item.findMany({
    orderBy: [desc(item.createdAt)],
    with: {
      collection: true,
      submitter: true,
      bitstreams: true,
    },
  })
  return items
})

export const getItemById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const it = await db.query.item.findFirst({
      where: eq(item.id, id),
      with: {
        collection: true,
        submitter: true,
        bitstreams: true,
      },
    })
    return it
  })

export const createItem = createServerFn({ method: 'POST' })
  .inputValidator((data: z.infer<typeof itemSchema>) => data)
  .handler(async ({ data }) => {
    const [newItem] = await db
      .insert(item)
      .values({
        ...data,
        status: data.status || 'workflow',
      })
      .returning()
    return newItem
  })

export const updateItem = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string } & Partial<z.infer<typeof itemSchema>>) => data,
  )
  .handler(async ({ data }) => {
    const { id, ...values } = data
    const [updated] = await db
      .update(item)
      .set(values)
      .where(eq(item.id, id))
      .returning()
    return updated
  })

export const addBitstreamToItem = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      itemId: string
      name: string
      sizeBytes: number
      mimeType: string
      url: string
      bundleName?: string
    }) => data,
  )
  .handler(async ({ data }) => {
    const [newBitstream] = await db
      .insert(bitstream)
      .values({
        ...data,
      })
      .returning()
    return newBitstream
  })
