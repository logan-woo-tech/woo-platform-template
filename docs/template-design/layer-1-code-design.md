# Layer 1: Code Design

**Status:** Proposed (Phase 2)
**Frame:** B (Claude-driven)
**Hard constraints applied:** ESM, TypeScript strict, exact-pin Anthropic SDK

---

## Monorepo structure

```
woo-platform-template/
├── apps/
│   ├── web/                    # Next.js 15.5 App Router
│   └── mobile/                 # Expo (React Native)
├── packages/
│   ├── types/                  # Shared Zod schemas + TypeScript types
│   ├── utils/                  # Pure utilities (cn, formatDate, etc.)
│   ├── db/                     # Drizzle ORM client + schema
│   ├── auth/                   # Supabase Auth helpers
│   ├── ui/                     # Tailwind tokens + shadcn-style components
│   └── ai/                     # Anthropic SDK + AI helpers
├── docs/
├── scripts/
├── .claude/                    # Claude Code skills + agents
├── .github/                    # GitHub workflows + templates
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── .nvmrc                      # Node 24 LTS
```

## Tooling

| Tool | Version | Reason |
|------|---------|--------|
| Node | 24 LTS | Latest stable |
| pnpm | 10.32.1 | Fast, efficient workspaces |
| Turborepo | latest | Build orchestration + caching |
| TypeScript | 5.9.3 | Strict mode |
| ESLint | 9 | Flat config |
| Prettier | latest | Code formatting |
| Husky | latest | Git hooks |
| lint-staged | latest | Pre-commit linting |

## Package boundaries

**`packages/types`:**
- Pure type definitions
- Zod schemas
- No runtime logic
- Imported everywhere

**`packages/utils`:**
- Pure functions (no side effects)
- Generic utilities (cn, formatDate, debounce)
- No external dependencies (lightweight)

**`packages/db`:**
- Drizzle ORM client (pool max=1)
- Schema definitions
- Migration files
- DB-specific types

**`packages/auth`:**
- Supabase Auth helpers
- Session management
- Role-based access helpers
- Auth types

**`packages/ui`:**
- Tailwind config + tokens
- shadcn-style components
- Design system primitives

**`packages/ai`:**
- Anthropic SDK wrapper
- Skills/agents/prompts management
- Cost tracking
- Degraded mode helpers
- Eval framework (Promptfoo)

## Apps

**`apps/web`:**
- Next.js 15.5 App Router
- React 19
- Tailwind 4
- Server Components default
- tRPC client

**`apps/mobile`:**
- Expo SDK latest
- React Native
- Same tRPC client (shared backend)
- Branded colors via `packages/ui` tokens

## TypeScript configuration

`tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "allowJs": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

## Turbo configuration

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Naming conventions

- **Workspaces:** `@woo/{package}` for template; renamed during instantiation
- **Components:** PascalCase
- **Files:** kebab-case (utilities), PascalCase (components)
- **Functions:** camelCase
- **Types:** PascalCase

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Package count | 6 | Balance separation vs maintenance |
| Apps from day 1 | Both web + mobile | Multi-client validation |
| Module system | ESM | Modern, future-proof |
| Strict TypeScript | Yes | Catch errors compile-time |
| Build tool | Turborepo | Industry standard, caching |
| Package manager | pnpm | Workspace efficiency |

---

*End of layer-1-code-design.md*
