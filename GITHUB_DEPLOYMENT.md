# GitHub Deployment Guide

This guide explains how to share your Personal Videoke app on GitHub as a public repository.

## ✅ Files to Include (Commit to GitHub)

### Source Code
```
✓ app/                    # Next.js pages
✓ src/                    # Components, hooks, types, utils
✓ public/                 # Static assets
```

### Configuration Files
```
✓ package.json            # Dependencies
✓ package-lock.json       # Lock file
✓ tsconfig.json           # TypeScript config
✓ tailwind.config.js      # Tailwind config
✓ postcss.config.js       # PostCSS config
✓ next.config.js          # Next.js config
✓ .eslintrc.json          # ESLint config
```

### Environment Templates
```
✓ .env.example            # Template (NO real API key!)
```

### Documentation
```
✓ README.md               # Main documentation
✓ OPERATING_GUIDE.md      # User manual
✓ TECHNICAL_STACK.md      # Tech documentation
✓ MOBILE_ACCESS_GUIDE.md  # Mobile setup
✓ GIT_GUIDE.md            # Git instructions
✓ GITHUB_DEPLOYMENT.md    # This file
```

### Git Files
```
✓ .gitignore              # Files to exclude
✓ LICENSE                 # MIT License
```

---

## ❌ Files to Exclude (Protected by .gitignore)

### Secrets & API Keys
```
✗ .env.local              # Contains YOUR API key - NEVER commit!
✗ .env.*.local            # Any local environment files
```

### Build Artifacts
```
✗ node_modules/           # Dependencies (users run npm install)
✗ .next/                  # Build output
✗ /out/                   # Export output
✗ /build/                 # Production build
```

### System Files
```
✗ .DS_Store               # macOS
✗ Thumbs.db               # Windows
✗ *.log                   # Log files
✗ *.pem                   # Private keys
```

### IDE Files
```
✗ .vscode/                # VS Code settings (optional - can include)
✗ .idea/                  # IntelliJ IDEA
✗ *.swp                   # Vim swap files
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Verify .gitignore Protection

Check that sensitive files are protected:

```bash
# Should show .env.local is ignored
git check-ignore .env.local

# Should return: .env.local
```

If it doesn't show up, your `.gitignore` is working correctly.

### Step 2: Check What Will Be Committed

```bash
# See all files that will be committed
git status

# Should NOT see:
# - .env.local
# - node_modules/
# - .next/
```

### Step 3: Commit to improvement Branch

```bash
# Add new files
git add .env.example LICENSE README.md GITHUB_DEPLOYMENT.md

# Commit
git commit -m "Prepare for GitHub deployment: Add docs and env template"

# Verify no secrets
git log --stat
```

### Step 4: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com/new](https://github.com/new)

2. **Create Repository:**
   - Repository name: `personal-videoke` (or your choice)
   - Description: "Simple karaoke app with YouTube integration"
   - Visibility: **Public**
   - ❌ Don't initialize with README (we have one)
   - ❌ Don't add .gitignore (we have one)
   - ❌ Don't add license (we have one)
   - Click **Create repository**

### Step 5: Push to GitHub

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/personal-videoke.git

# Push the improvement branch
git push -u origin improvement

# Optional: Push master/baseline too
git push origin master
git push --tags  # Push all tags (baseline-v1)
```

### Step 6: Set Default Branch (Optional)

On GitHub:
1. Go to repository **Settings**
2. Click **Branches** in sidebar
3. Change default branch to `improvement`
4. Confirm the change

### Step 7: Verify Security

**CRITICAL:** Check that your API key is NOT visible:

1. **On GitHub**, browse your repository
2. **Search** for your API key text
3. **Should NOT find it anywhere**
4. **Check** `.env.example` only has placeholder text

**If your API key is visible:**
```bash
# IMMEDIATELY rotate your API key in Google Cloud Console
# Delete the key and create a new one
# Update your local .env.local with new key
```

---

## 📋 Complete File Checklist

Use this checklist to verify what's committed:

### ✅ Must Include

- [ ] `README.md` - Main documentation
- [ ] `.env.example` - API key template (placeholder only!)
- [ ] `package.json` - Dependencies
- [ ] `package-lock.json` - Lock file
- [ ] `LICENSE` - MIT License
- [ ] `.gitignore` - Exclusion rules
- [ ] `app/` directory - All pages
- [ ] `src/` directory - All source code
- [ ] `public/` directory - Static assets
- [ ] All config files (tsconfig, tailwind, etc.)
- [ ] Documentation files (guides)

### ❌ Must NOT Include

- [ ] `.env.local` - Your real API key
- [ ] `node_modules/` - Dependencies folder
- [ ] `.next/` - Build artifacts
- [ ] Personal notes or sensitive data

### ⚠️ Optional (Your Choice)

- [ ] `.vscode/` - VS Code settings (helpful for contributors)
- [ ] `screenshots/` - App screenshots for README

---

## 🔒 Security Checklist

Before pushing to GitHub:

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in committed files
- [ ] `.env.example` only has placeholder text
- [ ] Run `git log --all --full-history -- .env.local` (should be empty)
- [ ] Search GitHub for your API key after push (should find nothing)

---

## 📝 Post-Deployment Tasks

### Update README with Your Info

Edit `README.md`:
```bash
# Change this line:
git clone https://github.com/YOUR_USERNAME/personal-videoke.git

# To your actual username:
git clone https://github.com/yourusername/personal-videoke.git
```

### Add Repository Topics

On GitHub:
1. Go to your repository
2. Click ⚙️ next to "About"
3. Add topics: `karaoke`, `nextjs`, `react`, `typescript`, `youtube-api`, `tailwindcss`

### Add Description

In "About" section:
```
Simple karaoke app with YouTube integration - Search, queue, and sing!
```

### Add Website (Optional)

If you deploy to Vercel/Netlify:
```
https://your-app.vercel.app
```

---

## 🎯 Example Repository URLs

After deployment, others can clone with:

```bash
# HTTPS (recommended for public repos)
git clone https://github.com/YOUR_USERNAME/personal-videoke.git

# SSH (if you have SSH keys set up)
git clone git@github.com:YOUR_USERNAME/personal-videoke.git
```

---

## 👥 For Users Cloning Your Repo

They will need to:

1. **Clone:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/personal-videoke.git
   cd personal-videoke
   ```

2. **Install:**
   ```bash
   npm install
   ```

3. **Configure:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with their own API key
   ```

4. **Run:**
   ```bash
   npm run dev
   ```

---

## 🔄 Updating Your GitHub Repository

### After Making Local Changes

```bash
# Check changes
git status

# Add files
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin improvement
```

### Syncing Branches

```bash
# Merge improvement to master when stable
git checkout master
git merge improvement
git push origin master
```

---

## 🌟 Making Your Repo More Discoverable

### Add a Banner Image

Create `public/banner.png` and reference in README:
```markdown
![Personal Videoke](public/banner.png)
```

### Add Screenshots

```markdown
## Screenshots

### Search and Queue
![Search](docs/screenshots/search.png)

### Video Player
![Player](docs/screenshots/player.png)
```

### Create GitHub Actions (Optional)

Add `.github/workflows/ci.yml` for automatic testing:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
```

---

## 📊 Repository Statistics

After deployment, track:
- ⭐ Stars
- 👁️ Watchers
- 🍴 Forks
- 📥 Clones
- 👥 Contributors

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:
- Commit `.env.local` with real API keys
- Commit `node_modules/`
- Commit build artifacts (`.next/`, `/out/`)
- Include personal data or notes
- Use offensive or unprofessional language in commits

### ✅ DO:
- Use `.env.example` with placeholders
- Write clear commit messages
- Update README with accurate info
- Respond to issues and PRs
- Keep dependencies updated

---

## 🆘 If You Accidentally Committed Secrets

**IMMEDIATE ACTIONS:**

1. **Rotate the API key:**
   ```
   Google Cloud Console → Delete old key → Create new key
   ```

2. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all

   git push origin --force --all
   ```

3. **Verify removal:**
   ```bash
   git log --all --full-history -- .env.local
   # Should return nothing
   ```

---

## 📚 Resources

- **GitHub Docs:** https://docs.github.com
- **Git Guide:** See `GIT_GUIDE.md` in this repo
- **gitignore Templates:** https://github.com/github/gitignore
- **Choosing a License:** https://choosealicense.com

---

## ✅ Final Verification

Before making repository public:

```bash
# 1. Check .gitignore works
git check-ignore .env.local  # Should return: .env.local

# 2. Check what's staged
git status

# 3. Check no secrets in commits
git log --all --oneline

# 4. Check .env.example is template only
cat .env.example

# 5. All good? Push!
git push origin improvement
```

---

**Your repository is now ready to share with the world! 🎉**

Users can clone it, add their own YouTube API key, and run their own karaoke app!

🎤 Happy Sharing! 🌟
