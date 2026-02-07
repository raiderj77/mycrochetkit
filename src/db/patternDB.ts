// src/db/patternDB.ts
// MyCrochetKit Pattern Library - IndexedDB Offline Storage

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Pattern, SyncStatus, OfflinePattern } from '../types/pattern';

// ─── Database Schema ─────────────────────────────────────

interface MyCrochetKitDB extends DBSchema {
  patterns: {
    key: string;
    value: OfflinePattern;
    indexes: {
      'by-type': string;
      'by-difficulty': string;
      'by-updated': Date;
      'by-sync': SyncStatus;
    };
  };
  patternSync: {
    key: string;
    value: {
      patternId: string;
      action: 'create' | 'update' | 'delete';
      data: Pattern | null;
      timestamp: Date;
    };
  };
}

const DB_NAME = 'mycrochetkit';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<MyCrochetKitDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MyCrochetKitDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<MyCrochetKitDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2) {
        const patternStore = db.createObjectStore('patterns', {
          keyPath: 'id',
        });
        patternStore.createIndex('by-type', 'type');
        patternStore.createIndex('by-difficulty', 'difficulty');
        patternStore.createIndex('by-updated', 'updatedAt');
        patternStore.createIndex('by-sync', 'syncStatus');

        db.createObjectStore('patternSync', {
          keyPath: 'patternId',
        });
      }
    },
  });

  return dbInstance;
}

// ─── PATTERN CRUD (local) ────────────────────────────────

export async function savePatternLocally(pattern: Pattern): Promise<void> {
  const db = await getDB();
  const offlinePattern: OfflinePattern = {
    ...pattern,
    syncStatus: 'synced',
    lastSyncedAt: new Date(),
  };
  await db.put('patterns', offlinePattern);
}

export async function savePatternsPendingSync(pattern: Pattern): Promise<void> {
  const db = await getDB();
  const offlinePattern: OfflinePattern = {
    ...pattern,
    syncStatus: 'pending',
    lastSyncedAt: null,
  };
  await db.put('patterns', offlinePattern);

  await db.put('patternSync', {
    patternId: pattern.id,
    action: 'create',
    data: pattern,
    timestamp: new Date(),
  });
}

export async function getPatternLocally(patternId: string): Promise<OfflinePattern | undefined> {
  const db = await getDB();
  return db.get('patterns', patternId);
}

export async function getAllPatternsLocally(): Promise<OfflinePattern[]> {
  const db = await getDB();
  return db.getAll('patterns');
}

export async function getPatternsByTypeLocally(type: string): Promise<OfflinePattern[]> {
  const db = await getDB();
  return db.getAllFromIndex('patterns', 'by-type', type);
}

export async function deletePatternLocally(patternId: string): Promise<void> {
  const db = await getDB();
  await db.delete('patterns', patternId);
}

export async function markPatternForDeletion(patternId: string): Promise<void> {
  const db = await getDB();

  const pattern = await db.get('patterns', patternId);
  if (pattern) {
    pattern.syncStatus = 'pending';
    await db.put('patterns', pattern);
  }

  await db.put('patternSync', {
    patternId,
    action: 'delete',
    data: null,
    timestamp: new Date(),
  });
}

// ─── SYNC OPERATIONS ─────────────────────────────────────

export async function getPendingSyncActions(): Promise<
  Array<{
    patternId: string;
    action: 'create' | 'update' | 'delete';
    data: Pattern | null;
    timestamp: Date;
  }>
> {
  const db = await getDB();
  return db.getAll('patternSync');
}

export async function clearSyncAction(patternId: string): Promise<void> {
  const db = await getDB();
  await db.delete('patternSync', patternId);
}

export async function markPatternSynced(patternId: string): Promise<void> {
  const db = await getDB();
  const pattern = await db.get('patterns', patternId);
  if (pattern) {
    pattern.syncStatus = 'synced';
    pattern.lastSyncedAt = new Date();
    await db.put('patterns', pattern);
  }
  await clearSyncAction(patternId);
}

export async function getPendingPatterns(): Promise<OfflinePattern[]> {
  const db = await getDB();
  return db.getAllFromIndex('patterns', 'by-sync', 'pending');
}

// ─── BULK SYNC ───────────────────────────────────────────

export async function bulkSavePatterns(patterns: Pattern[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('patterns', 'readwrite');

  for (const pattern of patterns) {
    const offlinePattern: OfflinePattern = {
      ...pattern,
      syncStatus: 'synced',
      lastSyncedAt: new Date(),
    };
    await tx.store.put(offlinePattern);
  }

  await tx.done;
}

export async function clearAllPatterns(): Promise<void> {
  const db = await getDB();
  await db.clear('patterns');
  await db.clear('patternSync');
}

// ─── PATTERN COUNT ──────────────────────────────────────

export async function getLocalPatternCount(): Promise<number> {
  const db = await getDB();
  return db.count('patterns');
}
