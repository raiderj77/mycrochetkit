// src/hooks/usePatterns.ts
// MyCrochetKit Pattern Library - React Hook

import { useState, useEffect, useCallback } from 'react';
import {
  createPattern as createPatternFirestore,
  getPatterns as getPatternsFirestore,
  getPattern as getPatternFirestore,
  updatePattern as updatePatternFirestore,
  deletePattern as deletePatternFirestore,
  duplicatePattern as duplicatePatternFirestore,
  getPatternCount,
  type PatternFilters,
} from '../services/patternService';
import {
  savePatternLocally,
  savePatternsPendingSync,
  getAllPatternsLocally,
  getPatternLocally,
  deletePatternLocally,
  markPatternForDeletion,
  getLocalPatternCount,
} from '../db/patternDB';
import { syncPatterns } from '../services/patternSync';
import type { Pattern, PatternFormData } from '../types/pattern';

// Generous free tier = sticky users = word of mouth
// Pro unlocks: unlimited patterns, cloud sync priority, future AI features
const FREE_PATTERN_LIMIT = 25;

export function usePatterns(uid: string | null) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatterns = useCallback(
    async (filters?: PatternFilters) => {
      if (!uid) return;
      setLoading(true);
      setError(null);

      try {
        if (navigator.onLine) {
          const remote = await getPatternsFirestore(uid, filters);
          setPatterns(remote);

          for (const p of remote) {
            savePatternLocally(p).catch(console.error);
          }
        } else {
          const local = await getAllPatternsLocally();

          let filtered = local as Pattern[];
          if (filters?.type) {
            filtered = filtered.filter((p) => p.type === filters.type);
          }
          if (filters?.difficulty) {
            filtered = filtered.filter((p) => p.difficulty === filters.difficulty);
          }
          if (filters?.tag) {
            filtered = filtered.filter((p) => p.tags.includes(filters.tag!));
          }
          if (filters?.searchQuery) {
            const search = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.name.toLowerCase().includes(search) ||
                p.tags.some((t) => t.toLowerCase().includes(search))
            );
          }

          filtered.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

          setPatterns(filtered);
        }
      } catch (err: unknown) {
        console.error('Failed to load patterns:', err);
        setError(err instanceof Error ? err.message : 'Failed to load patterns');

        try {
          const local = await getAllPatternsLocally();
          setPatterns(local);
        } catch {
          // Nothing we can do
        }
      } finally {
        setLoading(false);
      }
    },
    [uid]
  );

  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);

  const createPattern = useCallback(
    async (formData: PatternFormData): Promise<Pattern | null> => {
      if (!uid) return null;

      try {
        if (navigator.onLine) {
          const pattern = await createPatternFirestore(uid, formData);
          await savePatternLocally(pattern);
          setPatterns((prev) => [pattern, ...prev]);
          return pattern;
        } else {
          const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const pattern: Pattern = {
            ...formData,
            id: tempId,
            isGenerated: formData.source.type === 'generated',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await savePatternsPendingSync(pattern);
          setPatterns((prev) => [pattern, ...prev]);
          return pattern;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to create pattern');
        return null;
      }
    },
    [uid]
  );

  const updatePattern = useCallback(
    async (
      patternId: string,
      updates: Partial<PatternFormData>,
      saveVersion: boolean = false
    ): Promise<boolean> => {
      if (!uid) return false;

      try {
        if (navigator.onLine) {
          await updatePatternFirestore(uid, patternId, updates, saveVersion);
          const updated = await getPatternFirestore(uid, patternId);
          if (updated) {
            await savePatternLocally(updated);
            setPatterns((prev) => prev.map((p) => (p.id === patternId ? updated : p)));
          }
        } else {
          const local = await getPatternLocally(patternId);
          if (local) {
            const updated: Pattern = {
              ...local,
              ...updates,
              updatedAt: new Date(),
            };
            await savePatternsPendingSync(updated);
            setPatterns((prev) => prev.map((p) => (p.id === patternId ? updated : p)));
          }
        }
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to update pattern');
        return false;
      }
    },
    [uid]
  );

  const deletePattern = useCallback(
    async (patternId: string): Promise<boolean> => {
      if (!uid) return false;

      try {
        if (navigator.onLine) {
          await deletePatternFirestore(uid, patternId);
          await deletePatternLocally(patternId);
        } else {
          await markPatternForDeletion(patternId);
        }
        setPatterns((prev) => prev.filter((p) => p.id !== patternId));
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to delete pattern');
        return false;
      }
    },
    [uid]
  );

  const duplicatePattern = useCallback(
    async (patternId: string): Promise<Pattern | null> => {
      if (!uid) return null;

      try {
        if (navigator.onLine) {
          const duplicate = await duplicatePatternFirestore(uid, patternId);
          await savePatternLocally(duplicate);
          setPatterns((prev) => [duplicate, ...prev]);
          return duplicate;
        } else {
          const original = await getPatternLocally(patternId);
          if (!original) throw new Error('Pattern not found');

          const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const duplicate: Pattern = {
            ...JSON.parse(JSON.stringify(original)),
            id: tempId,
            name: `${original.name} (copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await savePatternsPendingSync(duplicate);
          setPatterns((prev) => [duplicate, ...prev]);
          return duplicate;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to duplicate pattern');
        return null;
      }
    },
    [uid]
  );

  const checkCanCreate = useCallback(
    async (isPro: boolean): Promise<{ allowed: boolean; reason?: string }> => {
      if (isPro) return { allowed: true };

      const count = navigator.onLine ? await getPatternCount(uid!) : await getLocalPatternCount();

      if (count >= FREE_PATTERN_LIMIT) {
        return {
          allowed: false,
          reason: `Free tier allows ${FREE_PATTERN_LIMIT} patterns. Upgrade to Pro for unlimited patterns + priority sync.`,
        };
      }

      return { allowed: true };
    },
    [uid]
  );

  const sync = useCallback(async () => {
    if (!uid || !navigator.onLine) return;
    try {
      const result = await syncPatterns(uid);
      if (result.pushed > 0 || result.pulled > 0) {
        await loadPatterns();
      }
      return result;
    } catch (err: unknown) {
      console.error('Manual sync failed:', err);
    }
  }, [uid, loadPatterns]);

  return {
    patterns,
    loading,
    error,
    createPattern,
    updatePattern,
    deletePattern,
    duplicatePattern,
    loadPatterns,
    checkCanCreate,
    sync,
  };
}
