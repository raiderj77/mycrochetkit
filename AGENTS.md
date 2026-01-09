# MyCrochetKit - Agent Guidelines

## Project Overview
MyCrochetKit is a Progressive Web App (PWA) for crochet enthusiasts to track projects, manage yarn stash, count rows, and price their handmade items.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Database**: Firebase Firestore + Local IndexedDB (Dexie) for offline-first
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions → Firebase Deploy

## Key Directories
```
src/
├── pages/          # Route components (Landing, Settings, etc.)
├── components/     # Reusable UI components
├── stores/         # Zustand state stores
├── lib/            # Utilities, Firebase config
├── config/         # Configuration files
├── services/       # Business logic services
├── db/             # IndexedDB schema (Dexie)
└── styles/         # Global CSS
```

## Important Patterns

### Firebase Configuration
There are TWO Firebase config files (historical reasons):
- `src/lib/firebase.ts` - Used by stores and components
- `src/config/firebase.ts` - Used by main.tsx initialization

**Both must stay in sync!** When updating Firebase config, update BOTH files.

### Environment Variables
All frontend env vars must be prefixed with `VITE_`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- etc.

### Deployment
- **Production**: Push to `main` → GitHub Actions → Firebase Hosting
- **Manual Deploy**: `npx firebase-tools@13 deploy --only hosting:production --project my-crochetkit`

## Known Gotchas

### 1. npm ci failures
Some packages have peer dependency conflicts. Use `--legacy-peer-deps` flag:
```bash
npm ci --legacy-peer-deps
```

### 2. Service Worker Caching
The PWA aggressively caches. After deployment, users may need to:
- Hard refresh (Ctrl+Shift+R)
- Clear site data (Chrome: Lock icon → Site settings → Clear data)

### 3. Firebase Auth in Dev Mode
Local development needs `.env.local` with Firebase keys. Copy from `.env.example`.

## Ralph Autonomous Workflow

This project uses Ralph for autonomous story completion.

### Files
- `scripts/ralph/ralph.sh` - Main automation script
- `scripts/ralph/prompt.md` - Agent instructions
- `prd.json` - User stories with status
- `progress.txt` - Learnings log (append-only)

### Running Ralph
```bash
./scripts/ralph/ralph.sh [max_iterations]
```

### Story Guidelines
Each story should be small enough to complete in one context window:
- ✅ "Add a button to the settings page"
- ✅ "Fix the Firebase API key error"
- ❌ "Build the entire dashboard" (too big)

## Quality Checks
Before committing:
```bash
npm run build        # TypeScript check + production build
npm run test:e2e     # Playwright tests (optional for small changes)
```

## Current Issues (2026-01-09)
- GitHub Actions failing at "Install Dependencies" step
- Live site showing old broken build with Firebase error
- See `progress.txt` for detailed debugging history
