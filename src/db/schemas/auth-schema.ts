import {
  boolean,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from '../utils'

export const userRoleEnum = mysqlEnum('user_role', [
  'reader', // browse & download only
  'author', // submit & publish papers
  'reviewer', // peer review assigned submissions
  'editor', // manage pipeline, assign reviewers, approve/reject
  'admin', // full platform control
])
  .default('reader')
  .notNull()

export const user = mysqlTable('user', {
  id,
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum,
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt,
  updatedAt,
})

export const session = mysqlTable(
  'session',
  {
    id,
    expiresAt: timestamp('expires_at').notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    createdAt,
    updatedAt,
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const account = mysqlTable(
  'account',
  {
    id,
    accountId: varchar('account_id', { length: 255 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt,
    updatedAt,
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = mysqlTable(
  'verification',
  {
    id,
    identifier: varchar('identifier', { length: 255 }).notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
