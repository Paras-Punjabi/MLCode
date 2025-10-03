import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  userId: uuid().primaryKey(),
  userName: varchar({ length: 255 }).notNull(),
  userEmail: varchar({ length: 255 }).notNull().unique(),
});
