import { createServerClient, getUserRole, type Role } from '@template/auth';
import type { User } from '@supabase/supabase-js';

export interface Context {
  user: User | null;
  userRole: Role | null;
}

export async function createContext(): Promise<Context> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: Role | null = null;
  if (user) {
    userRole = await getUserRole(user.id);
  }

  return { user, userRole };
}
