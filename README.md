# woo-platform-template

AI-native platform template based on 9-layer architecture.

## Status

🚧 Under construction (Phase 3 Sub-phase A)

## Architecture

9 layers:

1. Code (monorepo, packages, apps)
2. API (tRPC, OpenAPI)
3. Product/Design (Tailwind, components)
4. Localization (next-intl)
5. Data (PostHog analytics)
6. Security (Supabase Auth + RLS)
7. AI Integration (Anthropic SDK, skills, agents)
8. Knowledge & Workflow (ADRs, conventions)
9. Operations (CI/CD, monitoring)

## Quick start

```bash
pnpm install
pnpm dev
```

## Documentation

- [Architecture overview](docs/architecture/overview.md) (TBD)
- [Decision records](docs/decisions/)
- [Design decisions](docs/template-design/)
- [Conventions](docs/conventions/) (TBD)

## License

MIT
