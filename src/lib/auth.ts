import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'
import * as schema from '@/db/schemas'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        default: 'user',
        required: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [tanstackStartCookies()],
})
