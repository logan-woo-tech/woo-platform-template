# Runbook: Setup Branch Protection

**Last updated:** 2026-04-27

## When to use

After CI workflow merged và verified working. One-time setup per repo.

## Pre-conditions

- CI workflow exists (`.github/workflows/ci.yml`)
- CI ran successfully on at least one PR
- Admin access to GitHub repo

## Procedure

1. Open https://github.com/{org}/{repo}/settings/branches
2. Click "Add branch protection rule"
3. Branch name pattern: `main`
4. Configure:

   **Require pull request before merging:**
   - ✅ Required
   - ✅ Require approvals: 1 (when team scales; 0 for solo founder phase)
   - ✅ Dismiss stale approvals when new commits pushed

   **Require status checks:**
   - ✅ Required
   - ✅ Require branches to be up to date
   - Required status checks:
     - lint
     - typecheck
     - build
     - verify-conventions
     - commitlint

   **Require conversation resolution:** ✅

   **Require linear history:** ✅

   **Restrictions:**
   - ❌ Allow force pushes
   - ❌ Allow deletions
   - ✅ Include administrators

5. Click "Create"

## Verification

1. Try direct push to main (should fail):

   ```bash
   git checkout main
   echo "test" >> README.md
   git commit -am "test"
   git push origin main
   ```

   Expected: rejected

2. Open test PR with failing CI:
   - PR cannot merge until CI green

## Rollback

If protection too strict:

- Edit rule via Settings → Branches
- Adjust required checks
- Remove rule entirely if needed

## Common issues

| Issue                               | Fix                                             |
| ----------------------------------- | ----------------------------------------------- |
| Status check not appearing          | CI must run at least once for check to register |
| "Include administrators" too strict | Toggle off for emergency overrides              |
