# Git Conventions

## Commits

Format: Conventional Commits

```
{type}({scope}): {description}

{body}

{footer}
```

Types: feat, fix, docs, chore, refactor, test, perf, style

Examples:

- `feat(auth): add Google OAuth`
- `fix(rls): correct admin policy`
- `docs(adr): add ADR-0010`

Description: imperative ("add" not "added"), lowercase, no period, <72 chars.

## Branches

Format: `{type}/{description}`

- `feat/onboarding-flow`
- `fix/rls-recursion-bug`
- `docs/update-readme`

Lifecycle: short-lived (<1 week target).

## Merging

Squash and merge to main. Linear history. Branches auto-delete after merge.

## Pre-flight check (mandatory before feature branch)

```bash
git status              # Should be clean
git log origin/main..HEAD  # Should be empty
git fetch origin
git log HEAD..origin/main  # Should be empty
```

If any check fails, address before creating feature branch.
