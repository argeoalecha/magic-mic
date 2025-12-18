# Git Version Control Guide

## Baseline Version

✅ Your baseline is saved!

### What was done:

1. ✅ Initialized git repository
2. ✅ Committed all your working code (30 files)
3. ✅ Created tag `baseline-v1` for easy rollback

## How to rollback if something breaks:

### To return to this exact working version:
```bash
git checkout baseline-v1
```

### To see all your tags:
```bash
git tag -l
```

### To return to your latest changes:
```bash
git checkout master
```

### Before making improvements, create a new branch (recommended):
```bash
git checkout -b improvements
```
Then you can experiment freely and switch back to master if needed.

## Common Git Workflows

### Making Changes Safely

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. **If something breaks, go back to baseline:**
   ```bash
   git checkout baseline-v1
   ```

4. **Return to your feature branch:**
   ```bash
   git checkout feature/your-feature-name
   ```

### Saving Your Work

**Commit your changes:**
```bash
git add .
git commit -m "Your commit message"
```

**Create a new tag for a stable version:**
```bash
git tag -a v1.1 -m "Description of this version"
```

### Viewing History

**See all commits:**
```bash
git log --oneline
```

**See what changed:**
```bash
git diff
```

**See status:**
```bash
git status
```

## Important Notes

- The `baseline-v1` tag marks your working simple videoke app
- Always commit your work before trying major changes
- Use branches for experimental features
- You can always return to `baseline-v1` if everything breaks
