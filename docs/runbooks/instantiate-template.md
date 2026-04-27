# Runbook: Instantiate Template for New Project

**Last updated:** 2026-04-27

## When to use

Starting a new project based on this template.

## Pre-conditions

- Template repo cloned to local machine
- Node 24 LTS installed
- pnpm 10.32.1 installed
- New GitHub repo ready (empty)

## Procedure

### Step 1: Clone template

```bash
git clone https://github.com/logan-woo-tech/woo-platform-template.git my-project
cd my-project
rm -rf .git  # Remove template git history
git init  # Fresh git history
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Run setup script

```bash
pnpm setup
```

Interactive prompts:

- Package scope (e.g., `@my-org`)
- Project name (kebab-case)
- Brand colors (optional)

Script will:

- Replace `@template/*` package names với your scope
- Update README, CLAUDE.md với project info
- Generate `.env.local` from `.env.example`
- Create symlink `apps/web/.env.local` → root

### Step 4: Configure credentials

Edit `.env.local` với:

- Supabase project URL + keys
- Anthropic API key
- PostHog key (if using analytics)
- Database URLs (pooler + direct)

See `docs/runbooks/setup-supabase.md` for Supabase setup.

### Step 5: Verify

```bash
pnpm verify:all
pnpm typecheck
pnpm lint
pnpm build
```

All should pass.

### Step 6: Apply database migrations

If your project needs custom tables, follow:

- `.claude/skills/migration-with-rls.md`

For initial template tables (user_roles, ai_call_log):

- Create Supabase project
- Apply `packages/db/migrations/0000_*.sql` via Supabase Studio SQL Editor

### Step 7: Test locally

```bash
pnpm dev
```

Open http://localhost:3000 — should redirect to default locale and load homepage.

### Step 8: Push to your GitHub

```bash
git add .
git commit -m "chore: initial template instantiation"
git remote add origin https://github.com/your-org/my-project.git
git push -u origin main
```

### Step 9: Set up CI/CD

Follow:

- `docs/runbooks/setup-branch-protection.md` (apply on your repo)
- `docs/runbooks/deploy-production.md` (when ready to deploy)

## Verification

- [ ] All package names use your scope
- [ ] README has your project name
- [ ] Brand colors applied (check playground)
- [ ] CI passes on first PR
- [ ] Dev server runs without errors

## Common issues

| Issue                    | Fix                                                 |
| ------------------------ | --------------------------------------------------- |
| Setup script fails       | Check Node 24 LTS active, pnpm 10.32.1 installed    |
| Type errors after setup  | Run `pnpm install` again, check for missing renames |
| .env.local not loading   | Verify symlink: `ls -la apps/web/.env.local`        |
| Brand colors not applied | Edit `packages/ui/src/tokens/brand.ts` manually     |

## References

- Template design: `docs/template-design/`
- Original template: `https://github.com/logan-woo-tech/woo-platform-template`
