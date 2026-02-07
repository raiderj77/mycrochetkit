import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface CrochetDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      counters: Array<{ id: string; name: string; count: number }>;
      activeId: string;
      updatedAt: string;
      synced: boolean;
    };
  };
  pendingSync: {
    key: string;
    value: {
      id: string;
      action: 'update';
      data: {
        counters: Array<{ id: string; name: string; count: number }>;
        activeId: string;
        notes?: string;
      };
      timestamp: string;
    };
  };
  projectsList: {
    key: string;
    value: {
      id: string;
      odData: Array<{
        id: string;
        name: string;
        notes: string;
        createdAt: string;
        updatedAt: string;
      }>;
      cachedAt: string;
    };
  };
}

const DB_NAME = 'mycrochetkit-offline';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<CrochetDB> | null = null;

export async function getDb(): Promise<IDBPDatabase<CrochetDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<CrochetDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('projectsList')) {
        db.createObjectStore('projectsList', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

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
    synced,
  });
}

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
    synced: project.synced,
  };
}

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
    timestamp: new Date().toISOString(),
  });
}

export async function getPendingSyncs(): Promise<
  Array<{
    id: string;
    action: 'update';
    data: {
      counters: Array<{ id: string; name: string; count: number }>;
      activeId: string;
      notes?: string;
    };
    timestamp: string;
  }>
> {
  const db = await getDb();
  return db.getAll('pendingSync');
}

export async function clearPendingSync(key: string): Promise<void> {
  const db = await getDb();
  await db.delete('pendingSync', key);
}

export async function markProjectSynced(userId: string, projectId: string): Promise<void> {
  const db = await getDb();
  const key = `${userId}_${projectId}`;
  const project = await db.get('projects', key);

  if (project) {
    project.synced = true;
    await db.put('projects', project);
  }
}

export async function saveProjectsListLocal(
  userId: string,
  projects: Array<{
    id: string;
    name: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
  }>
): Promise<void> {
  const db = await getDb();
  await db.put('projectsList', {
    id: userId,
    odData: projects,
    cachedAt: new Date().toISOString(),
  });
}

export async function getProjectsListLocal(userId: string): Promise<Array<{
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}> | null> {
  const db = await getDb();
  const data = await db.get('projectsList', userId);
  return data ? data.odData : null;
}

export function isOnline(): boolean {
  return navigator.onLine;
}
