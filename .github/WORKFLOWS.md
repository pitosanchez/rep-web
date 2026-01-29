# GitHub Actions Workflows for REP

Three automated workflows are configured to maintain code quality and deploy your site.

## 1. **Build & Test** (`.github/workflows/build.yml`)

**Triggers**: On every push and PR to main

**What it does**:
- Install dependencies
- Run ESLint (code quality)
- Build Next.js app
- TypeScript type checking
- Run tests

**Status Badge**: Add to README:
```markdown
![Build & Test](https://github.com/pitosanchez/rep-web/actions/workflows/build.yml/badge.svg)
```

---

## 2. **Deploy to Vercel** (`.github/workflows/deploy.yml`)

**Triggers**: On every push and PR to main

**What it does**:
- Build the Next.js app
- Deploy to Vercel (production on main, preview on PRs)

**Required Secrets** (add to GitHub):
1. `VERCEL_TOKEN` — [Create in Vercel Settings](https://vercel.com/account/tokens)
2. `VERCEL_ORG_ID` — Found in Vercel project settings
3. `VERCEL_PROJECT_ID` — Found in Vercel project settings

**To set up**:
1. Go to your GitHub repo → Settings → Secrets and Variables → Actions
2. Add these three secrets from your Vercel account

**Result**:
- ✅ Main branch → Auto-deploys to production
- ✅ Pull requests → Auto-generates preview URL (comment on PR)
- ✅ Easy rollback by redeploying from GitHub

---

## 3. **Security Scan** (`.github/workflows/security.yml`)

**Triggers**: On push/PR and daily at 2 AM UTC

**What it does**:
- Audit npm dependencies for vulnerabilities
- CodeQL static analysis (detects common security issues)

**No setup required** — Uses GitHub's built-in CodeQL

**Result**:
- ✅ Alerts if vulnerabilities found
- ✅ Automatic security scanning

---

## Setup Instructions

### Step 1: Enable Actions (if not already)
1. Go to your repo → Settings → Actions
2. Ensure "Allow all actions and reusable workflows" is selected

### Step 2: Set Up Vercel Deployment (Optional)
If you want auto-deployment to Vercel:

1. **Create Vercel account** (if not already)
   - Go to https://vercel.com
   - Connect your GitHub repo

2. **Get Vercel tokens**:
   - Token: https://vercel.com/account/tokens (create new token)
   - Org ID: In project settings, look for "Org ID"
   - Project ID: In project settings, look for "Project ID"

3. **Add to GitHub Secrets**:
   - Go to repo → Settings → Secrets and Variables → Actions
   - Add three new repository secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your org ID
     - `VERCEL_PROJECT_ID`: Your project ID

### Step 3: Commit Workflows
```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

---

## Workflow Status

Once enabled, check status:
- **Actions tab**: https://github.com/pitosanchez/rep-web/actions
- See all workflow runs
- View logs for debugging

---

## Customization

### To add to README
```markdown
## Deployment & CI/CD

![Build & Test](https://github.com/pitosanchez/rep-web/actions/workflows/build.yml/badge.svg)

Automated deployments via GitHub Actions:
- **Build & Test**: Runs on every push/PR
- **Deploy**: Auto-deploys main to Vercel
- **Security**: Daily vulnerability scans
```

### To skip a workflow
Add `[skip ci]` to commit message:
```bash
git commit -m "Update docs [skip ci]"
```

### To run manually
- Go to Actions tab
- Click workflow
- Click "Run workflow"

---

## Common Issues

**Workflows not running?**
- Check Actions are enabled (repo Settings → Actions)
- Verify branch protection doesn't block status checks

**Deploy fails?**
- Check Vercel secrets are correct
- View logs in Actions tab for details
- Make sure `npm run build` succeeds locally first

**Security alerts?**
- Review vulnerable packages in Actions logs
- Run `npm audit` locally to see details
- Update dependencies: `npm update`

---

## Next Steps

1. ✅ Commit workflows
2. ⏳ Set up Vercel secrets (optional but recommended)
3. ⏳ Monitor first run in Actions tab
4. ⏳ Add status badges to README

---

**For Questions**: See GitHub Actions docs at https://docs.github.com/actions
