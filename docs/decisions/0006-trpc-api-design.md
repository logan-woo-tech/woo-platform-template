# 0006. tRPC for API Design

**Status:** Accepted
**Date:** 2026-04-27

## Decision

tRPC v11 vanilla client for API layer.

## Rationale

- End-to-end type safety
- No separate schema (TS types are the contract)
- Excellent Next.js integration
- Auto-generates OpenAPI via trpc-openapi

## Trade-offs

### Pro

- Type safety from server to client
- Refactoring safe (rename = both sides update)
- Faster development

### Con

- Locks into TypeScript clients
- B2B/external API needs OpenAPI (provided via trpc-openapi)
- Less familiar than REST

## References

- docs/template-design/layer-2-api-design.md
