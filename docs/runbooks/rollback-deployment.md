# Runbook: Rollback Deployment

**Last updated:** 2026-04-27

## When to use

Production deployment causing issues, need to revert ASAP.

## Pre-conditions

- Production issue confirmed (not local/preview)
- Previous deployment was healthy

## Procedure

### Option 1: Revert commit (preferred)

1. Identify problematic commit:
   ```bash
   git log --oneline -10
   ```
2. Revert:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. Auto-deploy rolls out revert
4. Verify health endpoint returns 200

### Option 2: Promote previous deployment (faster)

1. Open Vercel dashboard → Deployments
2. Find last successful deployment (green check)
3. Click "..." → "Promote to Production"
4. Wait for promotion (~30 sec)
5. Verify health endpoint

## Verification

```bash
curl https://{domain}/api/health
# Should return: {"status":"ok",...}
```

## Post-rollback

1. Open issue documenting:
   - What broke
   - Why rollback necessary
   - Investigation findings
2. Add fix to next sprint
3. Update relevant ADR if architectural

## Common issues

| Issue                       | Fix                                            |
| --------------------------- | ---------------------------------------------- |
| Both options fail           | Manual deploy from local: `vercel --prod`      |
| Database state inconsistent | Document state, investigate before next deploy |
