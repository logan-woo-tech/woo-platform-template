# Documentation Conventions

## Markdown

- ATX headers (`#`, `##`)
- Code blocks với language
- Tables for structured data
- Lists for enumeration

## Filenames

- kebab-case for `.md` files
- Numbered ADRs: `{NNNN}-{title-slug}.md`

## READMEs

Every package, app, significant subdirectory has README.

Structure:

```markdown
# {Name}

[One-sentence description]

## Purpose

## Usage

## Public API

## Related
```

Length: 50-300 lines typical.

## Cross-references

- Inline links for short URLs
- Reference-style for repeated/long URLs
- Always relative paths within repo

## File path references

Use backticks: `apps/web/src/app/page.tsx`
