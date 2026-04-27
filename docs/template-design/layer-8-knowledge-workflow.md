# Layer 8: Knowledge & Workflow

**Status:** Proposed (Phase 2)
**Frame:** B

---

## ADR system

**Architecture Decision Records — single source of truth for decisions.**

### Folder structure

```
docs/decisions/
├── _template.md
├── 0001-monorepo-tooling.md
├── 0002-tech-stack-choices.md
├── 0003-package-boundaries.md
├── 0004-auth-strategy.md
├── 0005-rls-security-definer.md
├── 0006-api-design-trpc.md
├── 0007-ai-integration-pattern.md
├── 0008-logging-strategy.md
└── ...
```

### Numbering

4-digit sequential, no gaps: `0001`, `0002`, ..., `9999`.

Reserves space for 10K ADRs over project lifetime.

### Template

`docs/decisions/_template.md`:

```markdown
# {NNNN}. {Title}

**Status:** Proposed | Accepted | Superseded by {NNNN}
**Date:** YYYY-MM-DD
**Deciders:** {names}

## Context

[What is the issue we're seeing that is motivating this decision?]

## Considered options

1. **Option A:** {description}
2. **Option B:** {description}
3. **Option C:** {description}

## Decision

We chose **Option A**.

## Rationale

[Why this option, why not others]

## Consequences

### Positive
- ...

### Negative
- ...

### Neutral
- ...

## References

- [Related ADR or external link]
```

### Lifecycle

1. **Proposed** — Draft for discussion
2. **Accepted** — Decision locked, applies
3. **Superseded** — Replaced by newer ADR

**Immutability:** Once Accepted, ADR content NEVER edited. Create superseding ADR with link.

## Specs

`docs/specs/` — describes what to build (different from why decided).

```
docs/specs/
├── _template.md
├── auth-flow.md
├── onboarding.md
└── ...
```

Spec template:

```markdown
# Spec: {Feature Name}

**Status:** Draft | In Development | Shipped
**Created:** YYYY-MM-DD
**Updated:** YYYY-MM-DD

## Purpose

[Why this feature exists]

## User stories

- As a {role}, I want to {action} so that {benefit}

## Requirements

### Functional
- ...

### Non-functional
- Performance: ...
- Accessibility: ...

## API contracts

[Endpoint specs, schemas]

## Data model

[Tables, fields, relationships]

## UX flows

[Step-by-step flows, optionally with mockups]

## Edge cases

- ...

## Out of scope

[What this spec does NOT cover]
```

## Runbooks

`docs/runbooks/` — operational procedures.

```
docs/runbooks/
├── _template.md
├── deploy-production.md
├── rollback-deployment.md
├── restore-from-backup.md
└── investigate-incident.md
```

Runbook template:

```markdown
# Runbook: {Procedure Name}

**Last updated:** YYYY-MM-DD
**Last tested:** YYYY-MM-DD

## When to use

[Trigger conditions]

## Pre-conditions

- ...

## Procedure

1. Step 1: [action] [expected result]
2. Step 2: ...

## Verification

[How to verify success]

## Rollback

[If procedure fails]

## Common issues

[Known problems + fixes]
```

## Conventions

`docs/conventions/`:

```
docs/conventions/
├── code.md             # TypeScript, React, naming
├── git.md              # Commit format, branches
├── pr.md               # PR template, review process
├── docs.md             # Markdown style, comments
├── tests.md            # Test conventions
└── ai.md               # AI integration conventions
```

## Glossary

`docs/glossary.md` — single source of truth for project terms.

```markdown
# Glossary

## Terms (alphabetical)

### ADR

Architecture Decision Record. Documents architectural decision với context và rationale.

### {Term}

[Definition]

[More terms...]
```

For template: generic technical terms only.
For WOO instantiation: add WOO-specific (GV, LC, Sói, learner, etc.).

## PR template

`.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## What this PR does

[Brief description]

## Why

[Rationale; link to issue, ADR, or spec]

## How tested

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed (describe)
- [ ] CI passes

## Related

- Issue: #N
- ADR: ADR-NNNN
- Spec: docs/specs/...

## Reviewer focus areas

[What should reviewer pay attention to]

## Risks

[What could go wrong if this PR has bugs]

## Checklist

- [ ] Documentation updated
- [ ] No secrets committed
- [ ] Breaking changes noted (if any)
- [ ] Performance considered
- [ ] Accessibility considered (if UI)
```

## Issue templates

`.github/ISSUE_TEMPLATE/`:

**`bug_report.yml`:**
```yaml
name: Bug Report
description: Report a bug
labels: ['bug']
body:
  - type: textarea
    attributes:
      label: Description
      description: What happened?
    validations:
      required: true
  - type: textarea
    attributes:
      label: Steps to reproduce
  - type: textarea
    attributes:
      label: Expected vs actual
  - type: textarea
    attributes:
      label: Environment
```

**`feature_request.yml`:** Feature proposals
**`adr_proposal.yml`:** Trigger for ADR creation

## Commit conventions

**Conventional Commits:**

```
{type}({scope}): {description}

{body}

{footer}
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `style`

Examples:
- `feat(auth): add Google OAuth`
- `fix(rls): correct admin policy recursion`
- `docs(adr): add ADR-0010 for Vercel deployment`

CI lints commits.

## Branch naming

`{type}/{description}`

- `feat/onboarding-flow`
- `fix/rls-recursion-bug`
- `docs/update-readme`
- `chore/upgrade-typescript`

## Merge strategy

**Squash and merge to main.**

- 1 commit per PR on main
- Clean history
- Easy revert
- Linear history (no merge commits)

## Branch protection

Main branch:
- Require PR
- Require status checks: lint, typecheck, test, build, verify-conventions
- Require approval (1 reviewer when team scales)
- Require conversation resolution
- Linear history (squash enforces)

## Documentation conventions

- Markdown files
- Headers ATX-style (`#`, `##`)
- Code blocks with language
- Tables for structured data
- Lists for enumeration
- Bold sparingly

**Filename:** kebab-case for `.md` files.

**Cross-references:** relative links khi possible.

## Onboarding

`docs/onboarding/`:

```
docs/onboarding/
├── new-engineer.md             # Day-1 checklist
├── first-pr-suggestions.md     # Starter tasks
└── reading-list.md             # Recommended reading order
```

Goal: New engineer productive trong 1 day.

## Decision summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ADR numbering | 4-digit | Future-proof |
| ADR immutability | Yes | History preserved |
| Specs separate from ADRs | Yes | Different purposes |
| Runbooks template | Yes | Battle-tested patterns |
| PR template | Required sections | CI enforced |
| Commit format | Conventional Commits | CI enforced |
| Merge strategy | Squash and merge | Clean history |
| Branch protection | Strict | Quality gate |

---

*End of layer-8-knowledge-workflow.md*
