// src/services/patternSync.ts
// MyCrochetKit Pattern Library - Online/Offline Sync Service

import {
  getPatterns,
  createPattern,
  updatePattern,
  deletePattern as deletePatternFirestore,
} from './patternService';
import {
  getAllPatternsLocally,
  savePatternLocally,
  getPendingSyncActions,
  clearSyncAction,
  markPatternSynced,
  deletePatternLocally,
} from '../db/patternDB';
import type { Pattern, PatternFormData } from '../types/pattern';

// ─── Main Sync Function ──────────────────────────────────

export async function syncPatterns(uid: string): Promise<{
  pushed: number;
  pulled: number;
  conflicts: number;
}> {
  let pushed = 0;
  let pulled = 0;
  let conflicts = 0;

  // Push pending local changes to Firestore
  const pendingActions = await getPendingSyncActions();

  for (const action of pendingActions) {
    try {
      switch (action.action) {
        case 'create': {
          if (!action.data) break;
          const createFormData = patternToFormData(action.data);
          const created = await createPattern(uid, createFormData);
          await deletePatternLocally(action.patternId);
          await savePatternLocally(created);
          await clearSyncAction(action.patternId);
          pushed++;
          break;
        }
        case 'update': {
          if (!action.data) break;
          const updateFormData = patternToFormData(action.data);
          await updatePattern(uid, action.patternId, updateFormData);
          await markPatternSynced(action.patternId);
          pushed++;
          break;
        }
        case 'delete': {
          await deletePatternFirestore(uid, action.patternId);
          await deletePatternLocally(action.patternId);
          await clearSyncAction(action.patternId);
          pushed++;
          break;
        }
      }
    } catch (error) {
      console.error(`Sync failed for pattern ${action.patternId}:`, error);
    }
  }

  // Pull remote patterns into local store
  try {
    const remotePatterns = await getPatterns(uid);
    const localPatterns = await getAllPatternsLocally();

    const localMap = new Map(localPatterns.map((p) => [p.id, p]));
    const remoteMap = new Map(remotePatterns.map((p) => [p.id, p]));

    for (const remote of remotePatterns) {
      const local = localMap.get(remote.id);

      if (!local) {
        await savePatternLocally(remote);
        pulled++;
      } else if (local.syncStatus === 'synced') {
        if (remote.updatedAt > local.updatedAt) {
          await savePatternLocally(remote);
          pulled++;
        }
      } else if (local.syncStatus === 'pending') {
        if (remote.updatedAt > local.updatedAt) {
          await savePatternLocally(remote);
          await clearSyncAction(local.id);
          conflicts++;
        }
      }
    }

    for (const local of localPatterns) {
      if (local.syncStatus === 'synced' && !remoteMap.has(local.id)) {
        await deletePatternLocally(local.id);
      }
    }
  } catch (error) {
    console.error('Failed to pull remote patterns:', error);
  }

  return { pushed, pulled, conflicts };
}

// ─── Helper: Convert Pattern to FormData ─────────────────

function patternToFormData(pattern: Pattern): PatternFormData {
  return {
    name: pattern.name,
    type: pattern.type,
    difficulty: pattern.difficulty,
    hookSize: pattern.hookSize,
    yarnWeight: pattern.yarnWeight,
    gaugeNotes: pattern.gaugeNotes,
    materials: pattern.materials,
    tags: pattern.tags,
    source: pattern.source,
    rights: pattern.rights,
    sections: pattern.sections,
    abbreviations: pattern.abbreviations,
    finishedSize: pattern.finishedSize,
    estimatedTime: pattern.estimatedTime,
    notes: pattern.notes,
  };
}

// ─── Online/Offline Detection ───────────────────────────

export function setupOnlineSyncListener(
  uid: string,
  onSyncComplete?: (result: { pushed: number; pulled: number; conflicts: number }) => void
): () => void {
  const handler = async () => {
    if (navigator.onLine) {
      try {
        const result = await syncPatterns(uid);
        onSyncComplete?.(result);
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }
  };

  window.addEventListener('online', handler);

  if (navigator.onLine) {
    handler();
  }

  return () => {
    window.removeEventListener('online', handler);
  };
}
