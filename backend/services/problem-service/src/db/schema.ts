import { pgTable, uuid, text, varchar, pgEnum } from 'drizzle-orm/pg-core';

export let problemLevelEnum = pgEnum('problemLevel', [
  'EASY',
  'MEDIUM',
  'HARD',
]);

export const problemsTable = pgTable('problems', {
  problemId: uuid('problem_id').defaultRandom().primaryKey(),
  problemName: text('problem_name').notNull(),
  problemDesc: text('problem_desc').notNull(),
  problemTags: varchar('problem_tags'), // comma seperated tags,
  problemLevel: problemLevelEnum('problem_level').notNull(),
});
