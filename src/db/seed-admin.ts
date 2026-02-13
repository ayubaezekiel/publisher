import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { createInterface } from 'node:readline'
import { db } from './index'
import { profile, user } from './schemas/index'

const rl = createInterface({ input: process.stdin, output: process.stdout })

const ask = (question: string): Promise<string> =>
  new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()))
  })

const askRequired = async (question: string): Promise<string> => {
  while (true) {
    const answer = await ask(question)
    if (answer.length > 0) return answer
    console.log('  ✗ This field is required.\n')
  }
}

async function seedAdmin() {
  console.log('\n╔════════════════════════════════════╗')
  console.log('║        Seed Admin Account          ║')
  console.log('╚════════════════════════════════════╝\n')

  const [, , argEmail, argName] = process.argv

  const email = argEmail ?? (await askRequired('Email address    : '))
  const name = argName ?? (await askRequired('Display name     : '))
  const password = await askRequired('Admin password   : ')

  rl.close()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('\n✗ Invalid email address. Aborting.\n')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('\n✗ Password must be at least 8 characters. Aborting.\n')
    process.exit(1)
  }

  console.log(`\n  Email    : ${email}`)
  console.log(`  Name     : ${name}`)
  console.log(`  Role     : admin`)
  console.log(`  Password : ${'*'.repeat(password.length)} (hidden)\n`)

  // ── Check for existing user ──
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  })

  if (existing) {
    if (existing.role === 'admin') {
      console.log(
        '⚠  An admin with this email already exists. Nothing changed.\n',
      )
      process.exit(0)
    }

    // Promote existing user to admin
    await db
      .update(user)
      .set({ role: 'admin', updatedAt: new Date() })
      .where(eq(user.email, email))

    console.log(`✓ Existing user promoted to admin (id: ${existing.id})\n`)
    process.exit(0)
  }

  // ── Create new admin via better-auth ──
  try {
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: 'admin',
      },
    })

    if (!signUpResult.user.id) {
      console.error(`\n✗ Sign-up failed`)
      process.exit(1)
    }

    const newUser = signUpResult.user.id

    if (!newUser) {
      console.error('\n✗ No user returned after sign-up. Aborting.\n')
      process.exit(1)
    }

    // If role is NOT an additional field in your better-auth config,
    // update it directly after creation
    await db
      .update(user)
      .set({ role: 'admin', updatedAt: new Date() })
      .where(eq(user.id, newUser))

    // Create linked profile (assuming you still want this)
    await db.insert(profile).values({
      userId: newUser,
      name,
      email,
      isPublic: false,
      totalPublications: 0,
      totalCitations: 0,
      hIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`✓ Admin user created successfully (id: ${newUser})\n`)
    process.exit(0)
  } catch (err: any) {
    console.error('\n✗ Seed failed:', err.message ?? err)
    process.exit(1)
  }
}

seedAdmin().catch((err) => {
  console.error('\n✗ Seed failed:', err.message ?? err)
  rl.close()
  process.exit(1)
})
