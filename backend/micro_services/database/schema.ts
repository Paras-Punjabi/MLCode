import {
  pgTable,
  uuid,
  text,
  varchar,
  pgEnum,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const problemLevelEnum = pgEnum('problemLevel', [
  'EASY',
  'MEDIUM',
  'HARD',
]);

export const statusEnum = pgEnum('status', [
  'ACCEPTED',
  'ATTEMPTED',
  'PENDING',
  'FAILED',
]);

export const problemsTable = pgTable('problems', {
  problemSlug: text('problem_slug').notNull().primaryKey(),
  problemNumber: serial('problem_number').unique(),
  problemName: text('problem_name').notNull(),
  problemDesc: text('problem_desc').notNull(),
  problemTags: varchar('problem_tags'), // comma seperated tags,
  problemLevel: problemLevelEnum('problem_level').notNull(),
});

export const usersTable = pgTable('users', {
  userId: varchar('user_id', { length: 50 }).primaryKey().notNull(),
});

export const submissionsTable = pgTable('submissions', {
  submissionId: uuid('submission_id').defaultRandom().primaryKey(),
  userId: varchar('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  problemSlug: text('problem_slug')
    .references(() => problemsTable.problemSlug)
    .notNull(),
  status: statusEnum('status').notNull(),
  input: text('input'),
  output: text('output'),
  expected: text('expected'),
  verdict: text('verdict'),
  createdAt: timestamp('created_at', { mode: 'date' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const notebooksTable = pgTable('notebooks', {
  notebookId: uuid('notebook_id').defaultRandom().primaryKey(),
  userId: varchar('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  problemSlug: text('problem_slug')
    .references(() => problemsTable.problemSlug)
    .notNull(),
});
