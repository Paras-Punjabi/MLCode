import { sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const usersTable = pgTable('users', {
  userId: uuid().primaryKey(),
  userName: varchar({ length: 15 }).notNull(),
  userEmail: varchar({ length: 255 }).unique().notNull(),
  userRoles: userRoleEnum()
    .array()
    .default(sql`{'user'}`),
});
