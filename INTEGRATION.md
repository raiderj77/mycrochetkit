# MyCrochetKit Pro Features - Integration Guide

## Step 1: Extract the archive
```bash
cd ~/projects/mycrochetkit
tar -xzf pro-features.tar.gz
```
This copies files into the correct directories under `src/`.

## Step 2: Verify files landed
```bash
ls -la src/services/subscriptionService.ts src/hooks/useSubscription.ts src/components/ProGate.tsx src/components/ProjectTimer.tsx src/components/TemperaturePlanner.tsx src/components/GrannySquareLayout.tsx src/components/PatternNotes.tsx src/components/ProjectFeatureTabs.tsx
```
You should see 8 files.

## Step 3: Wire ProjectFeatureTabs into VoiceCounter.tsx

Open `src/components/VoiceCounter.tsx` in your editor and make these changes:

### 3a. Add imports (near top, after other imports):
```typescript
import { ProjectFeatureTabs } from './ProjectFeatureTabs';
import { useSubscription } from '../hooks/useSubscription';
```

### 3b. Add hook (inside the component, right after the `user` state line):
Find this line:
```typescript
const [user, setUser] = useState<User | null>(null);
```
Add right below it:
```typescript
const { isPro } = useSubscription(user);
```

### 3c. Add tabs in JSX (right before the final closing `</div>` of the return):
Find the Voice Commands help section (the last `</motion.div>`) and add this right after it, before the final `</div>`:
```tsx
      {/* Pro Feature Tabs */}
      {user && (
        <ProjectFeatureTabs
          projectId={projectId}
          userId={user.uid}
          isPro={isPro}
          currentRow={activeCounter?.count || 0}
          proData={{}}
        />
      )}
```

## Step 4: Lift project limit for Pro users

Open `src/components/ProjectsList.tsx` and make these changes:

### 4a. Add import (at top):
```typescript
import { useSubscription } from '../hooks/useSubscription';
```

### 4b. Add hook (inside the component):
Find where user is received as a prop, then add:
```typescript
const { isPro } = useSubscription(user);
```

### 4c. Change the limit check:
Find:
```typescript
projects.length >= 3
```
Change to:
```typescript
!isPro && projects.length >= 3
```

## Step 5: Build and test
```bash
npm run build
```
Fix any TypeScript errors, then deploy:
```bash
firebase deploy
```

## Step 6: Test Pro features
To test without Stripe, open browser console after signing in:
```javascript
// Replace YOUR_UID with your actual Firebase UID
import('/src/services/subscriptionService').then(m => m.setProStatus('YOUR_UID', 'lifetime'));
```
Or set it directly in Firestore console: `users/{uid}/subscription.isPro = true`
