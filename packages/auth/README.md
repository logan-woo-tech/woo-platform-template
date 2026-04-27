# @template/auth

Supabase Auth helpers and session management.

## Status

Skeleton — implementation in Sub-phase C.

## Will provide

- `requireAuth()` — Throws if not authenticated
- `requireRole(role)` — Throws if missing role
- `getUser()` — Gets current user (nullable)
- `hasPermission(perm)` — Permission check
- Server-side helpers (App Router compatible)
- Middleware for route protection
