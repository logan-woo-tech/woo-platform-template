import { pgTable, uuid, pgEnum } from 'drizzle-orm/pg-core';

/**
 * user_id references auth.users(id) — Supabase's built-in auth schema.
 * FK created in migration via raw SQL since Drizzle can't reference
 * cross-schema tables it doesn't manage.
 */
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').primaryKey(),
  role: userRoleEnum('role').notNull().default('user'),
});

export type UserRole = typeof userRoles.$inferSelect;
