---
description: Quick reference for common Git operations
---

# Git Workflow Quick Reference

## Daily Git Commands

### Check Status
```bash
git status                    # See what files changed
git log --oneline -5          # Last 5 commits
git branch                    # List branches
```

### Save Your Work
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Description of what you did"

# Push to GitHub
git push origin main
```

### Undo Mistakes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard HEAD

# Unstage files
git reset HEAD <file>
```

### Get Latest Code
```bash
# Pull from GitHub
git pull origin main

# Or if you have local changes
git stash              # Save local changes
git pull origin main   # Get latest
git stash pop          # Restore local changes
```

### Branch Management
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Delete branch
git branch -d feature/old-feature
```

## Common Scenarios

### "I made changes but forgot to commit"
```bash
git add .
git commit -m "WIP: description"
git push origin main
```

### "I committed to wrong branch"
```bash
git log --oneline -1  # Copy the commit hash
git checkout correct-branch
git cherry-pick <commit-hash>
```

### "I need to start over"
```bash
git reset --hard HEAD
git clean -fd  # Remove untracked files
```

### "Merge conflict help"
```bash
# Open conflicted files, look for:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# Edit to keep what you want, then:
git add .
git commit -m "Resolved merge conflict"
```

## Pro Tips

1. **Commit often** - Small commits are easier to understand
2. **Write clear messages** - "Fixed bug" is bad, "Fixed counter reset on page load" is good
3. **Pull before push** - Always `git pull` before starting work
4. **Don't commit secrets** - Never commit `.env` files
5. **Use branches** - Keep `main` stable, work in feature branches
