# MyCrochetKit Troubleshooting Guide

Quick solutions to common problems when GitHub/Firebase/Antigravity aren't cooperating.

---

## Problem: "My changes aren't showing on the live site"

### Diagnosis
```bash
# Check what's actually deployed
firebase hosting:channel:list

# Check last build time
ls -lh dist/index.html
```

### Solutions

**Solution 1: Hard Refresh Browser**
```
Chrome/Edge: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
Firefox: Ctrl + Shift + R
Safari: Cmd + Option + R
```

**Solution 2: Clear Firebase Cache & Redeploy**
```bash
firebase deploy --only hosting
```

**Solution 3: Verify Build Actually Happened**
```bash
# Check if dist/ has recent files
ls -lah dist/

# If empty or missing, rebuild
npm run build

# Check for build errors
```

**Solution 4: Check Which Project You're On**
```bash
firebase use
# Should say: my-crochetkit

# If wrong:
firebase use my-crochetkit
firebase deploy --only hosting
```

---

## Problem: "Cloud Build isn't triggering when I push to GitHub"

### Diagnosis
1. Check Cloud Build history: https://console.cloud.google.com/cloud-build/builds?project=my-crochetkit
2. Look for builds with your commit message
3. Check trigger status: https://console.cloud.google.com/cloud-build/triggers?project=my-crochetkit

### Solutions

**Solution 1: Verify Trigger is Enabled**
- Go to: https://console.cloud.google.com/cloud-build/triggers?project=my-crochetkit
- Find "deploy-site" trigger
- Ensure Status = "Enabled" (not paused/disabled)

**Solution 2: Check Branch Name**
```bash
# Cloud Build watches 'main' branch
git branch --show-current

# If you're on a different branch:
git checkout main
git push origin main
```

**Solution 3: Verify GitHub Connection**
- Go to Cloud Build Triggers
- Click "deploy-site"
- Check Repository section shows: raiderj77/mycrochetkit
- If "Repository not found": Reconnect GitHub in Cloud Build

**Solution 4: Manual Trigger**
- Go to Cloud Build Triggers
- Click "RUN" button next to deploy-site
- Watch build progress

---

## Problem: "Git says 'nothing to commit, working tree clean'"

### Diagnosis
```bash
git status
# Shows what's actually changed
```

### Solutions

**Solution 1: You Already Committed**
```bash
# Check recent commits
git log --oneline -5

# If your work is there, just push
git push origin main
```

**Solution 2: Files Aren't Saved**
- Save all files in editor (Ctrl+S or Cmd+S)
- Run `git status` again

**Solution 3: Files Are Gitignored**
```bash
# Check if file is ignored
git check-ignore -v src/yourfile.ts

# If ignored but shouldn't be, edit .gitignore
```

---

## Problem: "Firebase deploy failed: Permission denied"

### Solutions

**Solution 1: Re-authenticate**
```bash
firebase logout
firebase login
```

**Solution 2: Verify Project Access**
```bash
firebase projects:list
# Should see my-crochetkit in the list

# If not there, you don't have access
# Check Firebase console to verify your email has access
```

**Solution 3: Check Project Selection**
```bash
firebase use my-crochetkit
firebase deploy --only hosting
```

---

## Problem: "npm run build fails with errors"

### Diagnosis
```bash
npm run build
# Read the error message carefully
```

### Common Build Errors

**Error: "Cannot find module 'X'"**
```bash
# Missing dependency
npm install

# If still fails, clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "TypeScript compilation errors"**
```bash
# Check your recent code changes
# Look at the file and line number in error

# Quick fix: Check for typos, missing imports
```

**Error: "Out of memory"**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Error: "EACCES permission denied"**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER ~/mycrochetkit/node_modules
```

---

## Problem: "Cloud Build fails but local build works"

### Diagnosis
1. Check Cloud Build logs: https://console.cloud.google.com/cloud-build/builds
2. Click on failed build (red X)
3. Look for error in "Build Logs" section

### Common Issues

**Issue 1: Environment Variables Missing**
```bash
# Check cloudbuild.yaml for env vars
cat cloudbuild.yaml

# Compare with your local .env.local
# Add missing vars to cloudbuild.yaml substitutions
```

**Issue 2: Node/npm Version Mismatch**
```bash
# Check cloudbuild.yaml for node version
# Ensure it matches your local version
node --version
```

**Issue 3: Dependencies Not Locked**
```bash
# Commit package-lock.json
git add package-lock.json
git commit -m "Lock dependencies"
git push
```

---

## Problem: "I pushed to GitHub but old code is still deployed"

### Solutions

**Solution 1: Verify Push Succeeded**
```bash
git push origin main
# Should say "Everything up-to-date" or show uploaded changes

# Verify on GitHub:
# Go to https://github.com/raiderj77/mycrochetkit
# Click "commits" - see your latest commit?
```

**Solution 2: Wait for Cloud Build**
```bash
# Cloud Build takes 2-3 minutes
# Check progress: https://console.cloud.google.com/cloud-build/builds

# Watch for "SUCCESS" status
```

**Solution 3: Deploy Manually**
```bash
# If Cloud Build is stuck/broken, deploy directly
npm run build
firebase deploy --only hosting
```

---

## Problem: "I can't remember which workflow to use"

### Decision Tree

**Q: Do you need changes live RIGHT NOW?**
- YES → Fast Deploy: `npm run build && firebase deploy --only hosting`
- NO → Continue...

**Q: Are you done working for now?**
- YES → Production Deploy: `git add . && git commit -m "msg" && git push`
- NO → Continue working, deploy later

**Q: Are you testing a feature?**
- YES → Fast Deploy (you can commit later)

**Q: Is this a release for users?**
- YES → Production Deploy (GitHub → Cloud Build)

---

## Problem: "Everything is broken and I don't know why"

### Nuclear Options (Use Carefully)

**Option 1: Reset to Last Known Good State**
```bash
# See recent commits
git log --oneline -10

# Reset to a specific commit (replace COMMIT_ID)
git reset --hard COMMIT_ID

# Force push (WARNING: Destroys newer commits)
git push -f origin main
```

**Option 2: Fresh Start from GitHub**
```bash
# Backup your changes first!
cp -r ~/mycrochetkit ~/mycrochetkit-backup

# Clone fresh from GitHub
cd ~
rm -rf mycrochetkit
git clone https://github.com/raiderj77/mycrochetkit.git
cd mycrochetkit
npm install
firebase use my-crochetkit
```

**Option 3: Diagnostic Check**
```bash
bash ~/mycrochetkit/check-setup.sh
# Read output carefully
# Follow suggested fixes
```

---

## Problem: "I deployed broken code to production"

### Emergency Rollback

**Option 1: Deploy Previous Version**
```bash
# Find last working commit
git log --oneline -10

# Reset to that commit (replace COMMIT_ID)
git reset --hard COMMIT_ID

# Deploy immediately
npm run build
firebase deploy --only hosting

# Fix issue, then commit properly
```

**Option 2: Firebase Hosting Rollback**
```bash
# List recent deploys
firebase hosting:channel:list

# Roll back to previous version (not always available)
# Faster: Just deploy last known good code
```

**Option 3: Quick Fix & Deploy**
```bash
# Fix the bug
npm run build
firebase deploy --only hosting
# Live in 30 seconds

# Then commit fix
git add .
git commit -m "Hotfix: description of fix"
git push origin main
```

---

## Quick Diagnostic Commands

Run these when you're not sure what's wrong:

```bash
# Where am I?
pwd
git branch --show-current

# What's changed?
git status
git diff

# What's deployed?
firebase hosting:channel:list

# What's my project?
firebase use

# Are dependencies installed?
ls node_modules/ | wc -l
# Should be 1000+

# Is my build current?
ls -lah dist/index.html
# Check timestamp

# What's my last commit?
git log --oneline -1

# Am I authenticated?
firebase projects:list
```

---

## Getting Help

If none of this works:

1. **Run diagnostics**: `bash check-setup.sh`
2. **Check Cloud Build logs**: https://console.cloud.google.com/cloud-build/builds
3. **Check Firebase Console**: https://console.firebase.google.com/project/my-crochetkit
4. **Review recent commits**: `git log --oneline -10`
5. **Ask Claude** (that's me!) - provide:
   - Error messages (full text)
   - What you were trying to do
   - Last command you ran
   - Output of `bash check-setup.sh`

---

## Prevention Tips

**Daily Habits to Avoid Problems:**

1. **Start your day**: `cd ~/mycrochetkit && git pull origin main`
2. **Commit often**: Every hour or major feature
3. **Test before releasing**: Use fast deploy, verify, then push to GitHub
4. **Use descriptive commits**: "Fix counter bug" not "stuff"
5. **Check Cloud Build**: After pushing, watch it build (first few times)
6. **Keep .env.local safe**: Never commit secrets

**Weekly Maintenance:**
```bash
# Keep dependencies updated
npm outdated
npm update

# Clean up old branches
git branch -d old-branch-name

# Verify backups
git log --oneline -20
```

---

That's it! Bookmark this file. When something breaks, come here first.

Most problems are fixed by:
1. Hard refresh browser (Ctrl+Shift+R)
2. Rebuild and redeploy (`npm run build && firebase deploy --only hosting`)
3. Checking you're on the right project (`firebase use my-crochetkit`)

You've got this! 🚀
