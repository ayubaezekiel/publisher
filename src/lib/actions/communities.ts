import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { community } from '@/db/schemas/communities'

const communitySchema = z.object({
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  introductoryText: z.string().optional(),
  logoUrl: z.string().optional(),
  slug: z.string().min(1),
  parentCommunityId: z.string().optional(),
})

export const getCommunities = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { db } = await import('@/db')
    const communities = await db.query.community.findMany({
      orderBy: [desc(community.createdAt)],
      with: {
        subCommunities: true,
        collections: true,
      },
    })
    return communities
  },
)

export const getCommunityBySlug = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { db } = await import('@/db')
    const comm = await db.query.community.findFirst({
      where: eq(community.slug, slug),
      with: {
        subCommunities: true,
        collections: true,
        parentCommunity: true,
      },
    })
    return comm
  })

export const createCommunity = createServerFn({ method: 'POST' })
  .inputValidator((data: z.infer<typeof communitySchema>) => data)
  .handler(async ({ data }) => {
    const { db } = await import('@/db')
    const id = crypto.randomUUID()
    await db.insert(community).values({ ...data, id })
    return { id }
  })

export const updateCommunity = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string } & Partial<z.infer<typeof communitySchema>>) => data,
  )
  .handler(async ({ data }) => {
    const { db } = await import('@/db')
    const { id, ...values } = data
    const updated = await db
      .update(community)
      .set(values)
      .where(eq(community.id, id))

    return updated
  })
export const deleteCommunity = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { db } = await import('@/db')
    await db.delete(community).where(eq(community.id, id))
  })
