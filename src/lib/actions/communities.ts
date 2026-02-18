import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
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
    const [newCommunity] = await db.insert(community).values(data).returning()
    return newCommunity
  })

export const updateCommunity = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string } & Partial<z.infer<typeof communitySchema>>) => data,
  )
  .handler(async ({ data }) => {
    const { id, ...values } = data
    const [updated] = await db
      .update(community)
      .set(values)
      .where(eq(community.id, id))
      .returning()
    return updated
  })
export const deleteCommunity = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(community).where(eq(community.id, id))
  })
