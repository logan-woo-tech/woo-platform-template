# Runbook: Deploy to Production

**Last updated:** 2026-04-27
**Last tested:** TBD (first deployment)

## When to use

Deploying changes from main branch to production environment.

## Pre-conditions

- [ ] All CI checks green on main
- [ ] No active production incidents
- [ ] Database migrations applied (if any)
- [ ] Environment variables current trong Vercel dashboard

## Procedure

1. **Verify CI:** Open https://github.com/{org}/{repo}/actions, latest main commit green
2. **Auto-deploy triggers:** Push to main → Vercel auto-deploys
3. **Wait for completion:** ~3-5 min trong Vercel dashboard
4. **Verify health:**
   ```bash
   curl https://{domain}/api/health
   # Should return: {"status":"ok",...}
   ```
5. **Smoke test:** Open production URL, verify auth flow works
6. **Monitor logs:** Vercel logs first 5 min for errors

## Verification

- Health endpoint returns 200
- Production URL loads
- Auth flow works
- No errors trong Vercel logs

## Rollback

### Within 30 min:

1. Revert problematic commit on main:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
2. Auto-deploy rolls out revert

### Later:

1. Open Vercel dashboard
2. Find previous successful deployment
3. Promote to production
4. Investigate root cause
5. Fix in PR, redeploy

## Common issues

| Issue                    | Fix                                              |
| ------------------------ | ------------------------------------------------ |
| Build fails              | Check Vercel build logs, missing env var typical |
| DB migration not applied | Apply manually via Supabase CLI                  |
| Health check fails       | Auto-rollback triggered, investigate             |
