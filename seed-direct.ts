import { auth } from './src/lib/auth'
import { db } from './src/db'
import { user } from './src/db/schemas'
import { eq } from 'drizzle-orm'

const email = 'admin@example.com'
const password = 'password123'
const name = 'Admin User'

async function seed() {
  console.log('Seeding admin...')

  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  })

  if (existing) {
    console.log('Admin already exists.')
    process.exit(0)
  }

  const result = await (auth.api as any).signUpEmail({
    email,
    password,
    name,
  })

  if (result.user.id) {
    await db
      .update(user)
      .set({ role: 'admin' })
      .where(eq(user.id, result.user.id))
    console.log('Admin seeded successfully.')
  }

  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
