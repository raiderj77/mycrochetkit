---
description: Firebase CLI commands and troubleshooting
---

# Firebase Workflow Quick Reference

## Essential Firebase Commands

### Authentication
```bash
# Login to Firebase
firebase login

# Check who's logged in
firebase login:list

# Logout
firebase logout
```

### Project Management
```bash
# List all projects
firebase projects:list

# Switch to production
firebase use my-crochetkit

# Switch to staging
firebase use my-crochetkit-staging

# See current project
firebase use
```

### Deployment
```bash
# Deploy everything
firebase deploy

# Deploy only hosting (fastest)
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

### Local Development
```bash
# Run local emulators
firebase emulators:start

# Run specific emulators
firebase emulators:start --only hosting,firestore
```

### Debugging
```bash
# View function logs
firebase functions:log

# View function logs (tail mode)
firebase functions:log --only functionName

# Open Firebase Console
firebase open
```

## Common Issues & Fixes

### "No project active"
```bash
firebase use my-crochetkit
firebase projects:list  # Verify project exists
```

### "Permission denied"
```bash
firebase logout
firebase login
firebase use my-crochetkit
```

### "Changes not showing on live site"
```bash
# Redeploy
firebase deploy --only hosting

# Clear browser cache
# Chrome/Edge: Ctrl+Shift+R (Windows)
# Chrome/Safari: Cmd+Shift+R (Mac)
```

### "Build failed during deploy"
```bash
# Build locally first to see errors
npm run build

# Check dist/ folder exists
ls -la dist/

# Then deploy
firebase deploy --only hosting
```

### "Function deployment timeout"
```bash
# Deploy functions separately
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:functionName
```

## Environment Variables

### For Cloud Functions
```bash
# Set secret
firebase functions:config:set stripe.secret="sk_live_..."

# Get all config
firebase functions:config:get

# Delete config
firebase functions:config:unset stripe.secret
```

### For Hosting (Build-time)
Environment variables are compiled into the build via `.env` files.
They are NOT available at runtime in the browser.

## Hosting Channels (Preview Deploys)

```bash
# Create preview channel
firebase hosting:channel:deploy preview

# Deploy to specific channel
firebase hosting:channel:deploy feature-x

# List all channels
firebase hosting:channel:list

# Delete channel
firebase hosting:channel:delete preview
```

## Quick Deploy Checklist

Before deploying:
- [ ] `npm run build` succeeds
- [ ] `dist/` folder exists with files
- [ ] `.env` has correct values (or use `cloudbuild.yaml`)
- [ ] Test locally with `npm run dev`

Deploy:
```bash
npm run build
firebase deploy --only hosting
```

Verify:
- [ ] Visit https://my-crochetkit.web.app
- [ ] Check Firebase Console for deployment status
- [ ] Test key features on live site

## Pro Tips

1. **Use `--only hosting`** - Faster deploys, skip functions
2. **Check before deploy** - Run `npm run build` first
3. **Monitor deployments** - Watch Firebase Console during first few deploys
4. **Use preview channels** - Test risky changes before production
5. **Keep CLI updated** - Run `npm install -g firebase-tools` monthly
