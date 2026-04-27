CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_call_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"use_case" text NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"cost_usd" numeric(10, 6) NOT NULL,
	"duration_ms" integer NOT NULL,
	"success" boolean NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_call_log_created" ON "ai_call_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_call_log_user" ON "ai_call_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_call_log_use_case" ON "ai_call_log" USING btree ("use_case");
--> statement-breakpoint

-- ============================================
-- Cross-schema FK constraints to auth.users
-- ============================================

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
--> statement-breakpoint

ALTER TABLE ai_call_log
  ADD CONSTRAINT ai_call_log_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
--> statement-breakpoint

-- ============================================
-- RLS Helper Functions (SECURITY DEFINER pattern)
-- ============================================

-- Get current user's role (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role::text
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;
--> statement-breakpoint

-- Check if current user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.current_user_role() = required_role;
$$;
--> statement-breakpoint

-- ============================================
-- Enable RLS
-- ============================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE ai_call_log ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- ============================================
-- RLS Policies — user_roles
-- ============================================

CREATE POLICY "user_roles_select_own"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());
--> statement-breakpoint

CREATE POLICY "user_roles_select_admin"
  ON user_roles FOR SELECT
  USING (public.has_role('admin'));
--> statement-breakpoint

CREATE POLICY "user_roles_insert_admin"
  ON user_roles FOR INSERT
  WITH CHECK (public.has_role('admin'));
--> statement-breakpoint

CREATE POLICY "user_roles_update_admin"
  ON user_roles FOR UPDATE
  USING (public.has_role('admin'));
--> statement-breakpoint

CREATE POLICY "user_roles_delete_admin"
  ON user_roles FOR DELETE
  USING (public.has_role('admin'));
--> statement-breakpoint

-- ============================================
-- RLS Policies — ai_call_log
-- ============================================

CREATE POLICY "ai_call_log_select_own"
  ON ai_call_log FOR SELECT
  USING (user_id = auth.uid());
--> statement-breakpoint

CREATE POLICY "ai_call_log_select_admin"
  ON ai_call_log FOR SELECT
  USING (public.has_role('admin'));
--> statement-breakpoint

CREATE POLICY "ai_call_log_insert_own"
  ON ai_call_log FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.has_role('admin'));
--> statement-breakpoint

-- ============================================
-- Trigger: auto-create user_role on auth.users insert
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;--> statement-breakpoint

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();