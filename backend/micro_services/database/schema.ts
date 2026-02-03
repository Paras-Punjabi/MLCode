import { pgTable, uuid, text, varchar, pgEnum } from 'drizzle-orm/pg-core';

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

export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);

export const problemsTable = pgTable('problems', {
  problemId: uuid('problem_id').defaultRandom().primaryKey(),
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
  problemId: uuid('problem_id')
    .references(() => problemsTable.problemId)
    .notNull(),
  status: statusEnum('status').notNull(),
  input: text('input').default('N/A').notNull(),
  output: text('output').default('N/A').notNull(),
  expected: text('expected').default('N/A').notNull(),
});

export const notebooksTable = pgTable('notebooks', {
  notebookId: uuid('notebook_id').defaultRandom().primaryKey(),
  userId: varchar('user_id')
    .references(() => usersTable.userId)
    .notNull(),
  problemId: uuid('problem_id')
    .references(() => problemsTable.problemId)
    .notNull(),
});
