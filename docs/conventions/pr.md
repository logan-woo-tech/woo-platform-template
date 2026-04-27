# PR Conventions

## Title

Conventional Commits format: `{type}({scope}): {description}`

## Description

Use template (`.github/PULL_REQUEST_TEMPLATE.md`).

Required sections (CI checks):

- What this PR does
- Why
- How tested

## Size

Target: <500 lines changed (excluding generated files).

If approaching 500: consider splitting.

## Self-review

Before opening PR:

1. Read diff as reviewer would
2. Run `pnpm verify:all && pnpm typecheck && pnpm lint && pnpm build`
3. Test manually
4. Verify PR description matches changes
5. Check no secrets accidentally committed

## Review SLA

- Normal: 24h
- Blocking: 4h
- Non-urgent: 48h

## Comment etiquette

| Prefix      | Meaning               |
| ----------- | --------------------- |
| `nit:`      | Minor, optional       |
| `question:` | Asking clarification  |
| `consider:` | Suggestion            |
| `must:`     | Blocker               |
| `praise:`   | Acknowledge good work |

## Merge

Squash and merge. Commit message = PR title + description summary.
