# GitHub Deployment Documentation

This document details the steps taken to deploy the Investment Calculator to GitHub and enable GitHub Pages.

## Repository Information

- **Repository Name**: `investment-calc`
- **GitHub Account**: `mahoney-jones` (Account 2)
- **Repository URL**: https://github.com/mahoney-jones/investment-calc
- **Live Site URL**: https://mahoney-jones.github.io/investment-calc/
- **Deployment Date**: November 15, 2024

## Prerequisites

This deployment used the multi-account GitHub setup configured in `~/code/github-setup/`. The setup includes:
- SSH keys for multiple GitHub accounts
- SSH config mapping `github.com-account2` to the `mahoney-jones` account
- Account switcher script for easy account management

For details on the GitHub multi-account setup, see:
- `~/code/github-setup/GITHUB_ACCOUNTS_README.md`
- `~/code/github-setup/GITHUB_WORKFLOW.md`

## Deployment Steps

### Step 1: Initialize Git Repository

```bash
cd ~/code/roi-calc
git init
```

### Step 2: Configure Git User (mahoney-jones Account)

```bash
git config user.name "mahoney-jones"
git config user.email "mahoney.jones@gmail.com"
```

### Step 3: Create README.md

Created a comprehensive README.md file documenting:
- Project features
- Calculator descriptions
- Getting started instructions
- Documentation links

### Step 4: Stage and Commit All Files

```bash
git add .
git commit -m "Initial commit: ROI Calculator with generational wealth planning tools

- Main compound interest calculator
- Generational wealth calculator (forward projection)
- 3-Generation reverse calculator (calculate needed investment)
- Parent investment calculator (forward projection with grandkid seeding)
- Fee impact comparison tool
- Compound schedule viewer
- Comprehensive documentation"
```

### Step 5: Rename Branch to Main

```bash
git branch -M main
```

### Step 6: Create GitHub Repository

1. Navigated to https://github.com/new
2. Repository name: `investment-calc`
3. Description: "Investment calculators for generational wealth planning"
4. Selected Public visibility
5. **Did NOT** initialize with README, .gitignore, or license (files already exist locally)

### Step 7: Configure Remote URL (SSH with Account 2)

Since this project uses the `mahoney-jones` account (Account 2), configured the remote to use the SSH host `github.com-account2`:

```bash
git remote add origin git@github.com-account2:mahoney-jones/investment-calc.git
```

**Note**: The `github.com-account2` host is configured in `~/.ssh/config` to use the correct SSH key for the mahoney-jones account.

### Step 8: Verify SSH Authentication

```bash
ssh -T git@github.com-account2
```

Expected output:
```
Hi mahoney-jones! You've successfully authenticated, but GitHub does not provide shell access.
```

### Step 9: Push to GitHub

```bash
git push -u origin main
```

Successfully pushed all files:
- 24 objects
- 59.04 KiB total
- Branch `main` set up to track `origin/main`

### Step 10: Enable GitHub Pages

1. Navigated to: https://github.com/mahoney-jones/investment-calc/settings/pages
2. Under "Source":
   - Selected "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`
3. Clicked "Save"

### Step 11: Verify Deployment

After enabling GitHub Pages, the site becomes available at:
**https://mahoney-jones.github.io/investment-calc/**

Deployment typically takes 1-2 minutes. Status can be checked in the repository's "Actions" tab.

## Files Deployed

The following files were included in the deployment:

### HTML Files (Calculators)
- `index.html` - Main compound interest calculator
- `generational-wealth.html` - Forward generational wealth calculator
- `reverse-generational.html` - 3-generation reverse calculator
- `parent-perspective.html` - Parent investment calculator
- `fee-impact.html` - Fee impact comparison tool
- `schedule.html` - Compound schedule viewer

### JavaScript Files
- `main.js` - Main calculator logic
- `generational-wealth.js` - Generational wealth calculations
- `reverse-generational.js` - Reverse calculation logic
- `parent-perspective.js` - Parent perspective calculations
- `fee-impact.js` - Fee comparison logic
- `schedule.js` - Schedule display logic

### Styles
- `styles.css` - Shared stylesheet for all calculators

### Documentation
- `README.md` - Main project documentation
- `CALCULATOR-FEATURES.md` - Detailed calculator documentation
- `PARENT-PERSPECTIVE-CALCULATOR.md` - Parent calculator guide
- `TODAYS-PROGRESS.md` - Development progress
- `BALANCED-PORTFOLIO-STRATEGY.md` - Investment strategy docs
- `AGENTS.md` - Agent documentation
- `DEPLOYMENT.md` - This file

### Other Files
- `Product List.csv` - Product data
- Various setup and authentication guides

## Continuous Deployment

GitHub Pages automatically deploys updates whenever changes are pushed to the `main` branch:

```bash
# Make changes to files
git add .
git commit -m "Description of changes"
git push
```

The site will automatically update within 1-2 minutes after pushing.

## Troubleshooting

### SSH Authentication Issues

If you encounter authentication errors:

1. Verify SSH key is configured:
   ```bash
   ssh -T git@github.com-account2
   ```

2. Check SSH config:
   ```bash
   cat ~/.ssh/config
   ```

3. Verify remote URL:
   ```bash
   git remote -v
   ```
   Should show: `git@github.com-account2:mahoney-jones/investment-calc.git`

### GitHub Pages Not Updating

1. Check Pages settings: https://github.com/mahoney-jones/investment-calc/settings/pages
2. Verify branch is set to `main` and folder is `/ (root)`
3. Check Actions tab for deployment status
4. Wait 1-2 minutes for changes to propagate

### Wrong Account Used

If commits show the wrong author:

```bash
git config user.name "mahoney-jones"
git config user.email "mahoney.jones@gmail.com"
```

To switch accounts, use the account switcher script:
```bash
~/code/github-setup/git-account-switch.sh account2
```

## Account Configuration Reference

**Account 2 (mahoney-jones)**:
- Username: `mahoney-jones`
- Email: `mahoney.jones@gmail.com`
- SSH Host: `github.com-account2`
- SSH Key: `~/.ssh/id_ed25519_account2`
- Remote URL Format: `git@github.com-account2:username/repo.git`

## Related Documentation

- [GitHub Multi-Account Setup](../github-setup/GITHUB_ACCOUNTS_README.md)
- [GitHub Workflow Guide](../github-setup/GITHUB_WORKFLOW.md)
- [GitHub Pages Setup](GITHUB-PAGES-SETUP.md)
- [Project README](README.md)

