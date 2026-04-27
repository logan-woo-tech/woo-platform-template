# Glossary

Project-specific terms and concepts.

## Technical terms

### ADR

Architecture Decision Record. Documents architectural decisions với context, options considered, decision, và rationale. Located trong `docs/decisions/`.

### RLS

Row-Level Security. Postgres feature for fine-grained access control at row level. Critical for multi-tenant apps.

### SECURITY DEFINER

Postgres function attribute making function run với privileges của function creator (not caller). Used trong helper functions to bypass RLS for permission checks.

### Skill (Claude Code)

Reusable instruction file in `.claude/skills/`. Provides Claude Code với specific guidance for common tasks.

### Agent (Claude Code)

Specialized Claude Code instance with isolated context, defined trong `.claude/agents/`. Used for specific tasks like plan review.

## Add terms here

When term used 2+ times trong repo, add definition here.
