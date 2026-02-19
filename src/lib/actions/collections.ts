import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { collection } from '@/db/schemas/collections'

const collectionSchema = z.object({
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  introductoryText: z.string().optional(),
  logoUrl: z.string().optional(),
  slug: z.string().min(1),
  communityId: z.string().min(1),
})

export const getCollections = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { db } = await import('@/db')
    const collections = await db.query.collection.findMany({
      orderBy: [desc(collection.createdAt)],
      with: {
        community: true,
        items: true,
      },
    })
    return collections
  },
)

export const getCollectionBySlug = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { db } = await import('@/db')
    const col = await db.query.collection.findFirst({
      where: eq(collection.slug, slug),
      with: {
        community: true,
        items: true,
      },
    })
    return col
  })

export const createCollection = createServerFn({ method: 'POST' })
  .inputValidator((data: z.infer<typeof collectionSchema>) => data)
  .handler(async ({ data }) => {
    const { db } = await import('@/db')
    const id = crypto.randomUUID()
    await db.insert(collection).values({ ...data, id })
    return { id }
  })

export const updateCollection = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string } & Partial<z.infer<typeof collectionSchema>>) => data,
  )
  .handler(async ({ data }) => {
    const { db } = await import('@/db')
    const { id, ...values } = data
    const updated = await db
      .update(collection)
      .set(values)
      .where(eq(collection.id, id))

    return updated
  })
export const deleteCollection = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { db } = await import('@/db')
    await db.delete(collection).where(eq(collection.id, id))
  })
