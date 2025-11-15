# GitHub Authentication Guide

## Option 1: Personal Access Token (Recommended)

### Step 1: Create a Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "roi-calc-push"
4. Select expiration (or no expiration)
5. Check the `repo` scope (full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** - you won't see it again!

### Step 2: Push Using Token
When prompted for password during `git push`, paste the token (not your GitHub password).

```bash
git push -u origin main
# Username: mahoney-jones
# Password: [paste your personal access token]
```

### Step 3: Store Credentials (Optional)
To avoid entering credentials each time:

```bash
git config credential.helper store
```

Then push again - it will save your credentials.

## Option 2: SSH Keys

### Step 1: Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "mahoney-jones@users.noreply.github.com"
# Press Enter to accept default location
# Enter passphrase (optional but recommended)
```

### Step 2: Add SSH Key to GitHub
1. Copy your public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Go to https://github.com/settings/keys
3. Click "New SSH key"
4. Paste the key and save

### Step 3: Change Remote to SSH
```bash
git remote set-url origin git@github.com:mahoney-jones/roi-calc.git
git push -u origin main
```

## Option 3: GitHub CLI

```bash
# Install GitHub CLI (if not installed)
# Then authenticate:
gh auth login
# Follow the prompts

# Then push:
git push -u origin main
```

