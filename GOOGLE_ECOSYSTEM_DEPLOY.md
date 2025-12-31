# Google Ecosystem Deployment Guide

## My Crochet Kit - Firebase Hosting + Google Services

This guide covers deploying your app using **100% Google ecosystem** services.

---

## 📦 Google Services You're Using

### Already Configured:

- ✅ **Firebase Authentication** - User login
- ✅ **Cloud Firestore** - Database
- ✅ **Firebase Storage** - File uploads
- ✅ **Google Analytics** - User tracking

### To Enable:

- ⏳ **Google Sign-In** - OAuth login
- ⏳ **Firebase Hosting** - Website deployment
- ⏳ **Cloud Build** - Auto-deploy on push (optional)

---

## Phase 1: Enable Google Sign-In

### Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Add new provider**
5. Select **Google**
6. Toggle **Enable**
7. Enter your **support email** (your Gmail)
8. Click **Save**

### Step 2: Test OAuth Flow

Your app already has Google Sign-In code in `Login.tsx`. Just test it:

1. Click "Sign in with Google" button
2. Select your Google account
3. Verify you're redirected to `/dashboard`

**That's it!** No code changes needed.

---

## Phase 2: Enable Google Analytics

### Step 1: Firebase Console

1. Go to Firebase Console → **Analytics**
2. Click **Enable Google Analytics**
3. Select existing Google Analytics account OR create new
4. Click **Enable**

**✅ Already integrated!** Your app will automatically start tracking:

- Page views
- User sessions
- Custom events (when you add them)

### Step 2: View Analytics

- Firebase Console → **Analytics** → **Dashboard**
- OR Google Analytics → [analytics.google.com](https://analytics.google.com)

---

## Phase 3: Deploy to Firebase Hosting

### Why Firebase Hosting vs Vercel?

**Firebase Hosting Advantages:**

- ✅ Part of Google ecosystem (seamless integration)
- ✅ Free tier: 10GB storage, 360MB/day transfer
- ✅ Auto SSL certificates
- ✅ Global CDN
- ✅ One-command deploy
- ✅ Custom domains included

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

Opens browser → Select your Google account → Authorize

### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

**Answer the prompts:**

- **Select project:** Choose your existing project
- **Public directory:** `dist` (this is where Vite builds to)
- **Configure as single-page app:** **Yes**
- **Set up automatic builds with GitHub:** **No** (for now)
- **Overwrite index.html:** **No**

This creates:

- `firebase.json` - Hosting configuration
- `.firebaserc` - Project settings

### Step 4: Build Your App

```bash
npm run build
```

This creates the `dist` folder with production files.

### Step 5: Deploy!

```bash
firebase deploy --only hosting
```

**Result:**

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT/overview
Hosting URL: https://YOUR_PROJECT.web.app
```

---

## Phase 4: Custom Domain (Optional)

### Step 1: Purchase Domain

Buy domain from **Google Domains** (to stay in ecosystem):

- Go to [domains.google.com](https://domains.google.com)
- Search for "mycrochetkit.com"
- Purchase ($12/year)

**Alternative:** Use Namecheap or GoDaddy ($10/year)

### Step 2: Add Domain to Firebase

1. Firebase Console → **Hosting**
2. Click **Add custom domain**
3. Enter `mycrochetkit.com`
4. Follow DNS setup instructions

Firebase will provide DNS records:

```
A     @     151.101.1.195
A     @     151.101.65.195
```

### Step 3: Update DNS

- If using **Google Domains:** DNS settings auto-populate
- If using **others:** Manually add A records

**Wait 24-48 hours for propagation**

### Step 4: Verify

Visit `https://mycrochetkit.com` → Should show your app!

---

## Phase 5: Auto-Deploy with GitHub (Optional)

### Setup Cloud Build

1. Firebase Console → **Hosting**
2. Click **"Set up a GitHub connection"**
3. Authorize GitHub access
4. Select repository: `mycrochetkit`
5. Configure build:
   ```
   Build command: npm run build
   Output directory: dist
   ```

**Result:** Every push to `main` auto-deploys!

---

## Environment Variables

### For Local Development: `.env.local`

Already set up ✅

### For Firebase Hosting:

**Don't need to set env vars!** They're compiled into the build.

But if you have **server-side** secret keys:

```bash
firebase functions:config:set stripe.secret="sk_live_..."
```

---

## Firestore Security Rules

### Current Status: ⚠️ **Wide Open (Development Mode)**

### Production Rules (Required!):

1. Firebase Console → **Firestore Database** → **Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Posts are public to read, but only author can write
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }

    // Reports only readable by admins (you'll need custom claims)
    match /reports/{reportId} {
      allow read: if request.auth.token.admin == true;
      allow create: if request.auth != null;
    }

    // Projects - user's own only
    match /projects/{projectId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Patterns - user's own only
    match /patterns/{patternId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **Publish**

---

## Firebase Storage Rules

### For Image Uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId &&
                     request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
  }
}
```

---

## Complete Deployment Checklist

### Pre-Deploy:

- [x] Google Analytics enabled
- [x] Google Sign-In enabled
- [ ] Create app icons (192px, 512px)
- [ ] Update admin email in `Admin.tsx`
- [ ] Test all features locally
- [ ] Run `npm run build` successfully

### Deploy:

- [ ] `firebase login`
- [ ] `firebase init hosting`
- [ ] `npm run build`
- [ ] `firebase deploy --only hosting`

### Post-Deploy:

- [ ] Test live site (click all links)
- [ ] Set Firestore security rules
- [ ] Set Storage security rules
- [ ] Purchase custom domain (optional)
- [ ] Set up auto-deploy via GitHub (optional)

---

## Useful Commands

```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View live logs
firebase functions:log

# Open Firebase Console
firebase open

# View currently logged in user
firebase login:list

# Build + Deploy in one command
npm run build && firebase deploy --only hosting
```

---

## Monitoring & Analytics

### Firebase Console Dashboards:

1. **Analytics** - User behavior, page views
2. **Authentication** - Login metrics
3. **Firestore** - Database usage
4. **Hosting** - Traffic, bandwidth
5. **Performance** - Loading times

### Google Analytics:

- Real-time users
- User demographics
- Traffic sources
- Conversion tracking

---

## Cost Estimate (Free Tier Limits)

**Firebase Spark Plan (FREE):**

- Hosting: 10GB storage, 360MB/day transfer ✅
- Firestore: 1GB storage, 50K reads/day, 20K writes/day ✅
- Auth: Unlimited (no cost) ✅
- Storage: 5GB ✅

**You won't hit these limits until 1,000+ active users**

**Upgrade to Blaze Plan (Pay-as-you-go):**

- Only if you exceed free tier
- Still free under limits
- Typical cost: $5-25/month for 10K users

---

## Next Steps

1. **Enable Google Sign-In** (5 minutes)
2. **Deploy to Firebase Hosting** (10 minutes)
3. **Set Firestore security rules** (5 minutes)
4. **Test live site** (15 minutes)

**Then you're LIVE! 🚀**
