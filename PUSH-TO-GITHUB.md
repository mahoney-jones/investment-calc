# Push to GitHub Instructions

**Note**: This project uses the `mahoney-jones` GitHub account (Account 2) with SSH authentication. For complete deployment documentation, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `investment-calc` (or your preferred name)
3. Description: "Investment calculators for generational wealth planning"
4. Choose Public or Private
5. **DO NOT** check "Initialize this repository with a README"
6. Click "Create repository"

## Step 2: Configure Git (if not already done)

```bash
git config user.name "mahoney-jones"
git config user.email "mahoney.jones@gmail.com"
```

## Step 3: Add Remote and Push (SSH with Account 2)

This project uses SSH with the `mahoney-jones` account. The remote URL uses `github.com-account2`:

```bash
# Add remote (replace REPO-NAME with your repository name)
git remote add origin git@github.com-account2:mahoney-jones/investment-calc.git

# Push to GitHub
git push -u origin main
```

**Note**: The `github.com-account2` host is configured in `~/.ssh/config` to use the correct SSH key for the mahoney-jones account. See `~/code/github-setup/` for multi-account setup details.

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/mahoney-jones/investment-calc/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Select branch: `main`
4. Select folder: `/ (root)`
5. Click "Save"
6. Your site will be available at: `https://mahoney-jones.github.io/investment-calc/`

## Alternative: Using HTTPS with Personal Access Token

If you prefer HTTPS instead of SSH:

```bash
git remote add origin https://github.com/mahoney-jones/investment-calc.git
git push -u origin main
# When prompted, use your GitHub username and a Personal Access Token as the password
```

See [GITHUB-AUTH.md](GITHUB-AUTH.md) for authentication options.

## Complete Documentation

For detailed deployment steps and troubleshooting, see [DEPLOYMENT.md](DEPLOYMENT.md).

