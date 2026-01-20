import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

// Define what our database looks like
interface CrochetDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      counters: Array<{ id: string; name: string; count: number }>;
      activeId: string;
      updatedAt: string;
      synced: boolean;  // Has this been synced to cloud?
    };
  };
  pendingSync: {
    key: string;
    value: {
      id: string;
      action: 'update';
      data: any;
      timestamp: string;
    };
  };
}

const DB_NAME = 'mycrochetkit-offline';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<CrochetDB> | null = null;

// Open/create the database
export async function getDb(): Promise<IDBPDatabase<CrochetDB>> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB<CrochetDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create projects store
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      // Create pending sync store (for offline changes)
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id' });
      }
    },
  });
  
  return dbInstance;
}

// Save project locally
export async function saveProjectLocal(
  userId: string,
  projectId: string,
  counters: Array<{ id: string; name: string; count: number }>,
  activeId: string,
  synced: boolean = false
): Promise<void> {
  const db = await getDb();
  const key = `${userId}_${projectId}`;
  
  await db.put('projects', {
    id: key,
    counters,
    activeId,
    updatedAt: new Date().toISOString(),
    synced
  });
}

// Get project from local storage
export async function getProjectLocal(
  userId: string,
  projectId: string
): Promise<{
  counters: Array<{ id: string; name: string; count: number }>;
  activeId: string;
  updatedAt: string;
  synced: boolean;
} | null> {
  const db = await getDb();
  const key = `${userId}_${projectId}`;
  const project = await db.get('projects', key);
  
  if (!project) return null;
  
  return {
    counters: project.counters,
    activeId: project.activeId,
    updatedAt: project.updatedAt,
    synced: project.synced
  };
}

// Mark a project as needing sync
export async function addPendingSync(
  userId: string,
  projectId: string,
  counters: Array<{ id: string; name: string; count: number }>,
  activeId: string
): Promise<void> {
  const db = await getDb();
  const key = `${userId}_${projectId}`;
  
  await db.put('pendingSync', {
    id: key,
    action: 'update',
    data: { counters, activeId },
    timestamp: new Date().toISOString()
  });
}

// Get all pending syncs
export async function getPendingSyncs(): Promise<Array<{
  id: string;
  action: 'update';
  data: any;
  timestamp: string;
}>> {
  const db = await getDb();
  return db.getAll('pendingSync');
}

// Clear a pending sync after successful sync
export async function clearPendingSync(key: string): Promise<void> {
  const db = await getDb();
  await db.delete('pendingSync', key);
}

// Mark project as synced
export async function markProjectSynced(
  userId: string,
  projectId: string
): Promise<void> {
  const db = await getDb();
  const key = `${userId}_${projectId}`;
  const project = await db.get('projects', key);
  
  if (project) {
    project.synced = true;
    await db.put('projects', project);
  }
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}
