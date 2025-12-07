import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const problemLevelEnum = pgEnum('problemLevel', [
  'EASY',
  'MEDIUM',
  'HARD',
]);

export const statusEnum = pgEnum('status', ['ACCEPTED', 'ATTEMPTED']);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const problemsTable = pgTable('problems', {
  problemId: uuid('problem_id').defaultRandom().primaryKey(),
  problemName: text('problem_name').notNull(),
  problemDesc: text('problem_desc').notNull(),
  problemTags: varchar('problem_tags'), // comma seperated tags,
  problemLevel: problemLevelEnum('problem_level').notNull(),
});

export const usersTable = pgTable('users', {
  userId: uuid().defaultRandom().primaryKey(),
  userName: varchar('user_name', { length: 15 }).notNull(),
  userEmail: varchar('user_email', { length: 255 }).unique().notNull(),
  userRoles: userRoleEnum('user_roles')
    .array()
    .default(sql`ARRAY['user']::user_role[]`),
});

export const submissionsTable = pgTable('submissions', {
  submissionId: uuid('submission_id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  problemId: uuid('problem_id')
    .references(() => problemsTable.problemId)
    .notNull(),
  status: statusEnum('status').notNull(),
});

export const notebooksTable = pgTable('notebooks', {
  notebookId: uuid('notebook_id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  problemId: uuid('problem_id')
    .references(() => problemsTable.problemId)
    .notNull(),
});

export const problemSessionsTable = pgTable('problem_sessions', {
  sessionId: uuid('session_id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  problemId: uuid('problem_id')
    .references(() => problemsTable.problemId)
    .notNull(),
});
