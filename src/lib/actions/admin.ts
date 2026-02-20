import { user } from '@/db/schemas/auth-schema'
import { collection } from '@/db/schemas/collections'
import { community } from '@/db/schemas/communities'
import { item } from '@/db/schemas/items'
import { auth } from '@/lib/auth'
import { Session } from '@/lib/session'
import type { UserRole } from '@/lib/permissions'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { count, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

// ── Shared server-only helper ────────────────────────────────────────────────
async function requireAdmin() {
  const request = getRequest()
  const session = (await auth.api.getSession({
    headers: request.headers,
  })) as Session

  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }

  const { db } = await import('@/db')
  const caller = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  })

  if (!caller || caller.role !== 'admin') {
    throw new Error('FORBIDDEN')
  }
  return caller
}

// ── Stats ────────────────────────────────────────────────────────────────────

export const getAdminStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    const { db } = await import('@/db')

    const [[userCount], [communityCount], [collectionCount], [itemCount]] =
      await Promise.all([
        db.select({ count: count() }).from(user),
        db.select({ count: count() }).from(community),
        db.select({ count: count() }).from(collection),
        db.select({ count: count() }).from(item),
      ])

    return {
      users: userCount?.count ?? 0,
      communities: communityCount?.count ?? 0,
      collections: collectionCount?.count ?? 0,
      items: itemCount?.count ?? 0,
    }
  },
)

// ── Users ─────────────────────────────────────────────────────────────────────

export const getAllUsers = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    const { db } = await import('@/db')

    const users = await db.query.user.findMany({
      orderBy: [desc(user.createdAt)],
      with: {
        profile: true,
      },
    })

    return users
  },
)

export const getUserById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin()
    const { db } = await import('@/db')

    const u = await db.query.user.findFirst({
      where: eq(user.id, id),
      with: { profile: true },
    })
    return u ?? null
  })

const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['reader', 'author', 'reviewer', 'editor', 'admin']),
})

export const updateUserRole = createServerFn({ method: 'POST' })
  .inputValidator((data: z.infer<typeof updateUserRoleSchema>) => data)
  .handler(async ({ data }) => {
    await requireAdmin()
    const { db } = await import('@/db')

    const updated = await db
      .update(user)
      .set({ role: data.role as UserRole, updatedAt: new Date() })
      .where(eq(user.id, data.userId))

    return updated
  })

// ── All Submissions ────────────────────────────────────────────────────────────

export const getAllSubmissions = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    const { db } = await import('@/db')

    const submissions = await db.query.item.findMany({
      orderBy: [desc(item.createdAt)],
      with: {
        collection: {
          with: { community: true },
        },
        submitter: true,
        bitstreams: true,
      },
    })

    return submissions
  },
)
