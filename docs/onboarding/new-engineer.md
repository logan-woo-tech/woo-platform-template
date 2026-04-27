# New Engineer Onboarding

Welcome to the team. This document gets you productive on Day 1.

## Pre-Day 1 access

Confirm you have:

- [ ] GitHub repo access
- [ ] Vercel team membership
- [ ] Supabase project access
- [ ] Anthropic API key (for development)

## Day 1: Hour-by-hour

### Hour 1: Environment

```bash
# Clone
git clone https://github.com/{org}/{repo}.git
cd {repo}

# Install
nvm use 24
pnpm install

# Configure
cp .env.example .env.local
# Fill in values (ask Logan for actual values)

# Verify
pnpm verify:all
pnpm build
pnpm dev
```

Open http://localhost:3000 — should see template homepage.

### Hour 2: Read context

In order:

1. `README.md`
2. `CLAUDE.md` (hard constraints)
3. `docs/decisions/0001-monorepo-tooling.md` through `0008-vercel-deployment.md`
4. `docs/conventions/code.md`
5. `docs/template-design/decisions-summary.md` (overview)

### Hour 3: Explore architecture

- Skim `docs/template-design/layer-{1-9}*.md`
- Browse `packages/` structure
- Look at `apps/web/` skeleton

### Hour 4: First PR

Pick task from `docs/onboarding/first-pr-suggestions.md`.

Workflow:

```bash
git checkout -b docs/{your-name}-first-contribution
# Make change
pnpm verify:all
git add .
git commit -m "docs(...): your change"
git push origin docs/{your-name}-first-contribution
gh pr create
```

Wait for review. Address feedback. Merge.

## Where to find things

| Looking for...   | Location                |
| ---------------- | ----------------------- |
| Architecture     | `docs/template-design/` |
| Decisions        | `docs/decisions/`       |
| Conventions      | `docs/conventions/`     |
| Runbooks         | `docs/runbooks/`        |
| Hard constraints | `CLAUDE.md`             |

## Communication

- Async by default (PR comments, GitHub issues)
- Slack for team-wide
- Pre-flight git check mandatory before feature branches

## Asking for help

When stuck >30 min:

1. Search docs/issues/PRs first
2. Document what you tried
3. Ask với context

## End of Day 1 checklist

- [ ] Local environment working
- [ ] Read core docs
- [ ] First PR opened
- [ ] Filed any documentation gaps as issues

Welcome aboard.
