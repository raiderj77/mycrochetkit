# 🧶 CrochetFlow

**The Unified, Accessible, Offline-First Crochet Companion**

CrochetFlow is an accessibility-first Progressive Web App (PWA) designed to solve the critical failures in the crochet application ecosystem:

✅ **No Accessibility Crises** - Built with WCAG 2.1 AA compliance from day one  
✅ **No Data Loss** - Local-first architecture with guaranteed persistence  
✅ **No Fragmentation** - One app for the entire crochet workflow

---

## Features

### Phase 1: Foundation (✅ Complete)

- ⚡ Vite + React + TypeScript project
- 🔥 Firebase integration (Auth, Firestore, Storage, Analytics)
- 💾 IndexedDB with Dexie.js for offline-first data
- ♿ Comprehensive accessibility system with 4 themes
- 📱 PWA configuration with Workbox
- 🎨 Material Design 3 with Tailwind CSS
- 📤 Export/import (JSON, CSV, PDF)

### Phase 2: Core Features (🚧 Coming Next)

- 📊 Project tracker with counters
- 📖 Smart pattern reader
- 🧵 Yarn stash manager
- 📚 Pattern library

---

## Tech Stack

**Google Ecosystem Throughout:**

- **Frontend**: React 18, TypeScript 5, Vite 5
- **Backend**: Firebase (Auth, Firestore, Storage, Analytics, Hosting)
- **State**: Zustand + IndexedDB (Dexie.js)
- **UI**: Tailwind CSS + Radix UI (Material Design 3)
- **PWA**: Workbox (Google's service worker library)
- **Analytics**: Google Analytics 4
- **Performance**: Lighthouse CI

---

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Configure Firebase (optional):**

```bash
cp .env.example .env.local
# Add your Firebase credentials to .env.local
```

3. **Run dev server:**

```bash
npm run dev
```

---

## Accessibility Commitment

✅ WCAG 2.1 AA compliant | ✅ Reduced motion DEFAULT | ✅ 4 color schemes | ✅ Screen reader optimized

**Accessibility is NOT a feature. It is the foundation.**

---

Built with ❤️ for the crochet community 🧶
