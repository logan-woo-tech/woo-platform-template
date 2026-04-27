import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

/**
 * Tracks every AI call for cost monitoring and analytics.
 *
 * Hard constraint: every AI call MUST be logged here.
 *
 * user_id references auth.users(id) — FK created in migration via raw SQL
 * since Drizzle can't reference cross-schema tables it doesn't manage.
 */
export const aiCallLog = pgTable(
  'ai_call_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id'),
    useCase: text('use_case').notNull(),
    model: text('model').notNull(),
    inputTokens: integer('input_tokens').notNull(),
    outputTokens: integer('output_tokens').notNull(),
    costUsd: numeric('cost_usd', { precision: 10, scale: 6 }).notNull(),
    durationMs: integer('duration_ms').notNull(),
    success: boolean('success').notNull(),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_ai_call_log_created').on(table.createdAt),
    index('idx_ai_call_log_user').on(table.userId),
    index('idx_ai_call_log_use_case').on(table.useCase),
  ],
);

export type AiCallLog = typeof aiCallLog.$inferSelect;
