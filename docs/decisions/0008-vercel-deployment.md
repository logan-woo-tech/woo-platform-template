# 0008. Vercel Deployment

**Status:** Accepted
**Date:** 2026-04-27

## Decision

Vercel for web hosting (vs Fly.io, AWS, self-host).

## Rationale

- Native Next.js support (made by same team)
- Zero-config deploy from GitHub
- Preview deployments per PR
- Edge network global
- Generous free tier, predictable Pro pricing

## Trade-offs

### Pro

- Best Next.js experience
- Easy CI/CD
- Auto-rollback on health check fail

### Con

- Vendor lock-in
- Cold starts on free tier
- Edge functions different paradigm

## Future considerations

When v2.5+ multi-region needed, evaluate Fly.io or hybrid approach.
