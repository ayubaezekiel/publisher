import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createdAt, id, updatedAt } from '../utils'
import { account, session, user } from './auth-schema'

export const publicationLevelEnum = mysqlEnum('publication_level', [
  'undergraduate',
  'postgraduate',
  'graduate',
])

export const academicDegreeEnum = mysqlEnum('academic_degree', [
  'bachelor',
  'master',
  'doctorate',
  'postdoc',
  'professor',
  'associate_professor',
  'lecturer',
  'researcher',
])

export const profile = mysqlTable(
  'profile',
  {
    id,

    // ── One-to-one link to auth user ──
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),

    // ── Identity ──
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    image: text('image'),
    bio: text('bio'),

    // ── Academic credentials ──
    degree: academicDegreeEnum,
    fieldOfStudy: text('field_of_study'), // e.g. "Computational Biology"
    discipline: varchar('discipline', { length: 255 }), // e.g. "Natural Sciences"
    publicationLevel: publicationLevelEnum,

    // ── Institution / affiliation ──
    institution: varchar('institution', { length: 255 }), // e.g. "University of Lagos"
    department: text('department'), // e.g. "Department of Physics"
    facultyPosition: text('faculty_position'), // e.g. "Associate Professor"

    // ── Publication stats (denormalised for quick reads) ──
    totalPublications: int('total_publications').default(0).notNull(),
    totalCitations: int('total_citations').default(0).notNull(),
    hIndex: int('h_index').default(0).notNull(),

    // ── Social / academic links ──
    orcidId: varchar('orcid_id', { length: 255 }), // e.g. "0000-0002-1825-0097"
    googleScholarUrl: text('google_scholar_url'),
    researchGateUrl: text('research_gate_url'),
    personalWebsite: text('personal_website'),
    linkedinUrl: text('linkedin_url'),
    twitterHandle: text('twitter_handle'),

    // ── Visibility ──
    isPublic: boolean('is_public').default(true).notNull(),

    createdAt,
    updatedAt,
  },
  (table) => [
    index('profile_user_id_idx').on(table.userId),
    index('profile_institution_idx').on(table.institution),
    index('profile_discipline_idx').on(table.discipline),
    uniqueIndex('profile_orcid_idx').on(table.orcidId),
  ],
)

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  profile: one(profile, {
    fields: [user.id],
    references: [profile.userId],
  }),
}))

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}))

export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert

export type PublicationLevel = typeof publicationLevelEnum
export type AcademicDegree = typeof academicDegreeEnum
