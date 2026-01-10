---
description: Deploy to Firebase (Fast Dev or Production via GitHub)
---

# MyCrochetKit Deployment Workflows

**Your Project:** `my-crochetkit`  
**GitHub:** `raiderj77/mycrochetkit`  
**Cloud Build Trigger:** `deploy-site` (ENABLED ✓)

---

## 🚀 Workflow #1: Fast Dev Deploy (30 seconds)

**When to use:** Active development, testing features, quick iterations

```bash
# 1. Build your app
npm run build

# 2. Deploy directly to Firebase
firebase deploy --only hosting

# 3. Commit to GitHub (separate step)
git add .
git commit -m "Description of changes"
git push origin main
```

**Result:** Changes live in ~30 seconds. GitHub updated for version control.

---

## 🏭 Workflow #2: Production Deploy via GitHub (2-3 minutes)

**When to use:** Production releases, shared team work, clean deployment history

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Release: v1.2.3 - Description"
git push origin main

# 2. Cloud Build automatically:
#    - Detects push to main branch
#    - Runs npm install
#    - Runs npm run build
#    - Deploys to Firebase Hosting
#    - Takes 2-3 minutes total
```

**Monitor deployment:**
- Cloud Build: https://console.cloud.google.com/cloud-build/builds?project=my-crochetkit
- Firebase Console: https://console.firebase.google.com/project/my-crochetkit/overview

**Result:** GitHub is source of truth. Clean deployment pipeline. Automatic.

---

## 🔄 My Recommended Daily Workflow

### During Active Development (Morning/Afternoon)
```bash
# Make changes in Antigravity editor
# Test locally: npm run dev

# Quick deploy for testing
npm run build
firebase deploy --only hosting
# Test on live site

# Keep working, repeat as needed
```

### End of Day / Before Breaks
```bash
# Commit everything to GitHub
git add .
git commit -m "Summary of today's work"
git push origin main

# This triggers Cloud Build (backup deployment)
# Takes 2-3 min, but you can walk away
```

### Production Releases
```bash
# Use GitHub workflow ONLY
git add .
git commit -m "Release v1.0: Launch-ready"
git push origin main

# Wait for Cloud Build to finish
# Verify deployment in Firebase console
```

---

## 🛠️ Essential Commands Reference

### Check Git Status
```bash
git status                    # See what's changed
git log --oneline -5          # Last 5 commits
```

### Firebase Commands
```bash
firebase login                # Authenticate (first time)
firebase projects:list        # See all your projects
firebase use my-crochetkit    # Switch to production
firebase deploy --only hosting  # Deploy hosting only
firebase deploy               # Deploy everything (hosting + functions)
```

### Undo Mistakes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# See deployment history
firebase hosting:channel:list
```

---

## 🚨 Troubleshooting

### "Changes not showing on live site"
```bash
# Clear Firebase cache
firebase deploy --only hosting

# Hard refresh browser
# Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### "Cloud Build failed"
1. Check Cloud Build history: https://console.cloud.google.com/cloud-build/builds
2. Look for red X, click for error details
3. Common issues:
   - Missing environment variables in `cloudbuild.yaml`
   - npm install failures (check `package.json`)
   - Build errors (check your code)

### "Git says 'nothing to commit'"
```bash
# You forgot to save files, or already committed
git status  # Check what's actually changed
```

### "Firebase says 'No project active'"
```bash
firebase use my-crochetkit
firebase projects:list  # Verify it exists
```

---

## 📋 Pre-Flight Checklist

Before you start working:
```bash
cd ~/mycrochetkit           # Navigate to project
git pull origin main        # Get latest from GitHub
firebase use my-crochetkit  # Ensure correct project
npm install                 # Update dependencies if needed
```

Before you deploy:
```bash
npm run build  # Verify build succeeds
# Check dist/ folder exists with files
ls -la dist/
```

Before you commit:
```bash
git status  # Review what's changed
# Make sure you're not committing secrets (.env files)
```

---

## 🎯 Quick Decision Tree

**Need changes live RIGHT NOW?**
→ Use Workflow #1 (Fast Dev Deploy)

**Releasing to users / End of day?**
→ Use Workflow #2 (GitHub Auto-Deploy)

**Something broke in production?**
→ Use Workflow #1 to hotfix immediately
→ Then commit with Workflow #2

**Not sure if Cloud Build is working?**
→ Check: https://console.cloud.google.com/cloud-build/builds?project=my-crochetkit
→ Should see "deploy-site" builds after each push

---

## 💡 Pro Tips

1. **Commit often** - At least every hour, even if it's "WIP: working on counters"
2. **Use descriptive commit messages** - Future you will thank you
3. **Test before pushing** - Use Workflow #1 to test, then Workflow #2 to release
4. **Keep .env.local** - Never commit secrets to GitHub
5. **Watch Cloud Build** - First few times, watch it build to understand timing

---

## 🎉 You're All Set!

Pin this file to your desktop. When you forget which workflow to use, just open this.

**Most common daily flow:**
1. Edit code in Antigravity
2. `npm run build && firebase deploy --only hosting` (quick test)
3. Keep working
4. `git add . && git commit -m "message" && git push` (end of session)

That's it. You now have both speed AND clean deployments.
