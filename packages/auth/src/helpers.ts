import 'server-only';
import type { User } from '@supabase/supabase-js';
import { createServerClient } from './server';

export type Role = 'user' | 'admin';

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN',
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Get current user (nullable).
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Require authenticated user. Throws if not authenticated.
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new AuthError('Authentication required', 'UNAUTHORIZED');
  }
  return user;
}

/**
 * Get a user's role from database.
 */
export async function getUserRole(userId: string): Promise<Role | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data.role as Role;
}

/**
 * Require user with specific role. Throws if missing.
 */
export async function requireRole(role: Role): Promise<User> {
  const user = await requireAuth();
  const userRole = await getUserRole(user.id);
  if (userRole !== role) {
    throw new AuthError(`Role '${role}' required`, 'FORBIDDEN');
  }
  return user;
}
