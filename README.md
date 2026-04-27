# woo-platform-template

AI-native platform template based on 9-layer architecture.

Built on woo-platform-template — 9-layer architecture for AI-native platforms.

## Stack

- **Framework:** Next.js 15.5 App Router
- **UI:** React 19 + Tailwind 4
- **Language:** TypeScript 5.9 strict
- **API:** tRPC v11
- **Database:** Postgres (Supabase) với Drizzle ORM
- **Auth:** Supabase Auth
- **AI:** Anthropic SDK
- **Analytics:** PostHog
- **Hosting:** Vercel
- **Monorepo:** pnpm + Turborepo

## Quick start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local với your credentials

# Apply database migrations (see docs/runbooks/setup-supabase.md)

# Run dev server
pnpm dev
```

Open http://localhost:3000

## Instantiate as new project

```bash
git clone https://github.com/logan-woo-tech/woo-platform-template.git my-project
cd my-project
rm -rf .git && git init
pnpm install
pnpm setup
```

See `docs/runbooks/instantiate-template.md` for full instructions.

## Architecture

9 layers documented trong `docs/template-design/`:

1. **Code** — Monorepo, packages, apps
2. **API** — tRPC + OpenAPI
3. **Design** — Tailwind tokens + components
4. **Localization** — next-intl với vi+en
5. **Data** — PostHog analytics
6. **Security** — Supabase Auth + RLS SECURITY DEFINER
7. **AI** — Anthropic SDK với cost tracking
8. **Knowledge** — ADRs + conventions
9. **Operations** — Vercel + GitHub Actions CI/CD

## Documentation

- **[Architecture decisions](docs/decisions/)** — Locked technical decisions (ADRs)
- **[Conventions](docs/conventions/)** — Code, git, PR, docs, tests, AI
- **[Runbooks](docs/runbooks/)** — Operational procedures
- **[Onboarding](docs/onboarding/)** — New engineer setup
- **[Template design](docs/template-design/)** — Layer-by-layer architecture

## Project structure

```
apps/
├── web/          # Next.js application
└── mobile/       # Expo (React Native)

packages/
├── types/        # Shared TypeScript types và Zod schemas
├── utils/        # Pure utilities
├── db/           # Drizzle ORM client + schema
├── auth/         # Supabase Auth helpers
├── ui/           # Tailwind tokens + shadcn-style components
└── ai/           # Anthropic SDK wrapper

docs/
├── decisions/    # ADRs
├── conventions/  # Code conventions
├── runbooks/     # Operational procedures
├── prompts/      # AI prompt versions
├── specs/        # Feature specs
└── template-design/  # Architecture documentation

.claude/
├── skills/       # Claude Code skills
└── agents/       # Claude Code agents
```

## Development workflow

1. **Plan** — Discuss approach
2. **Write Prompt** — For Claude Code execution
3. **Review Plan** — Fresh-eyes check
4. **Build** — Execute via Claude Code
5. **Test** — Verify locally
6. **Docs** — Update as needed
7. **/clear** — Reset context

Pre-flight git check mandatory before feature branches.

## Hard constraints

See `CLAUDE.md` for complete list. Critical:

- TypeScript strict mode
- Anthropic SDK exact-pinned
- DB pool max=1 (sequential queries only)
- Drizzle generate-only (NEVER db:push)
- RLS SECURITY DEFINER pattern (NEVER inline EXISTS)
- Service role key server-only

## License

MIT
