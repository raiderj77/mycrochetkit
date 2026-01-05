/**
 * Counter Store - Zustand State Management
 * 
 * Manages counters with history for undo functionality
 */

import { create } from 'zustand';
import { db } from '@/db/schema';
import type { Counter } from '@/types/models';
// ============ DEBOUNCE FIX FOR VOICE DOUBLE-INCREMENT ============
const incrementTimestamps = new Map<string, number>();
const DEBOUNCE_MS = 300;

function canIncrement(counterId: string): boolean {
  const lastTime = incrementTimestamps.get(counterId) || 0;
  const now = Date.now();
  
  if (now - lastTime < DEBOUNCE_MS) {
    console.warn(`[Counter] Debounce: Ignoring duplicate increment for ${counterId}`);
    return false;
  }
  
  incrementTimestamps.set(counterId, now);
  return true;
}
// ============ END DEBOUNCE FIX ============

interface CounterStore {
  // State
  counters: Map<string, Counter>; // by counter ID
  
  // Counter Operations
  increment: (counterId: string) => Promise<void>;
  decrement: (counterId: string) => Promise<void>;
  reset: (counterId: string) => Promise<void>;
  setValue: (counterId: string, value: number) => Promise<void>;
  
  // CRUD
  addCounter: (projectId: string, counter: Omit<Counter, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCounter: (counterId: string, updates: Partial<Counter>) => Promise<void>;
  deleteCounter: (counterId: string) => Promise<void>;
  
  // History
  undo: (counterId: string) => Promise<void>;
  
  // Helpers
  getCountersByProject: (projectId: string) => Counter[];
}

export const useCounterStore = create<CounterStore>((set, get) => ({
  // Initial State
  counters: new Map(),
  
  // Increment Counter
  increment: async (counterId) => {
    const counter = get().counters.get(counterId);
    if (!counter) return;
    
    const newValue = counter.current + 1;
    
    // Add to history
    const historyEntry = {
      timestamp: new Date(),
      previousValue: counter.current,
      newValue,
      action: 'increment' as const,
    };
    
    const updatedCounter = {
      ...counter,
      current: newValue,
      history: [...counter.history, historyEntry],
      updatedAt: new Date(),
    };
    
    // Update in state
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(counterId, updatedCounter);
      return { counters: newCounters };
    });
    
    // Persist to IndexedDB (via project)
    await persistCounterToProject(counterId, updatedCounter);
  },
  
  // Decrement Counter
  decrement: async (counterId) => {
    const counter = get().counters.get(counterId);
    if (!counter || counter.current <= 0) return;
    
    const newValue = counter.current - 1;
    
    const historyEntry = {
      timestamp: new Date(),
      previousValue: counter.current,
      newValue,
      action: 'decrement' as const,
    };
    
    const updatedCounter = {
      ...counter,
      current: newValue,
      history: [...counter.history, historyEntry],
      updatedAt: new Date(),
    };
    
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(counterId, updatedCounter);
      return { counters: newCounters };
    });
    
    await persistCounterToProject(counterId, updatedCounter);
  },
  
  // Reset Counter
  reset: async (counterId) => {
    const counter = get().counters.get(counterId);
    if (!counter) return;
    
    const confirmed = confirm(`Reset "${counter.name}" to 0?`);
    if (!confirmed) return;
    
    const historyEntry = {
      timestamp: new Date(),
      previousValue: counter.current,
      newValue: 0,
      action: 'reset' as const,
    };
    
    const updatedCounter = {
      ...counter,
      current: 0,
      history: [...counter.history, historyEntry],
      updatedAt: new Date(),
    };
    
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(counterId, updatedCounter);
      return { counters: newCounters };
    });
    
    await persistCounterToProject(counterId, updatedCounter);
  },
  
  // Set Value
  setValue: async (counterId, value) => {
    const counter = get().counters.get(counterId);
    if (!counter) return;
    
    const historyEntry = {
      timestamp: new Date(),
      previousValue: counter.current,
      newValue: value,
      action: 'set' as const,
    };
    
    const updatedCounter = {
      ...counter,
      current: value,
      history: [...counter.history, historyEntry],
      updatedAt: new Date(),
    };
    
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(counterId, updatedCounter);
      return { counters: newCounters };
    });
    
    await persistCounterToProject(counterId, updatedCounter);
  },
  
  // Add New Counter
  addCounter: async (projectId, counterData) => {
    const newCounter: Counter = {
      ...counterData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      current: 0,
      history: [],
      reminders: counterData.reminders || [],
    };
    
    // Add to state
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(newCounter.id, newCounter);
      return { counters: newCounters };
    });
    
    // Add to project in IndexedDB
    const project = await db.projects.get(projectId);
    if (project) {
      const updatedCounters = [...project.counters, newCounter];
      await db.projects.update(projectId, {
        counters: updatedCounters,
      });
      
      // IMPORTANT: Also update the project store so UI refreshes
      const { useProjectStore } = await import('./projectStore');
      useProjectStore.getState().loadProjects();
    }
    
    return newCounter.id;
  },
  
  // Update Counter
  updateCounter: async (counterId, updates) => {
    const counter = get().counters.get(counterId);
    if (!counter) return;
    
    const updatedCounter = {
      ...counter,
      ...updates,
      updatedAt: new Date(),
    };
    
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(counterId, updatedCounter);
      return { counters: newCounters };
    });
    
    await persistCounterToProject(counterId, updatedCounter);
  },
  
  // Delete Counter
  deleteCounter: async (counterId) => {
    const counter = get().counters.get(counterId);
    if (!counter) return;
    
    const confirmed = confirm(`Delete counter "${counter.name}"?`);
    if (!confirmed) return;
    
    // Remove from state
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.delete(counterId);
      return { counters: newCounters };
    });
    
    // Remove from project in IndexedDB
    const projects = await db.projects.toArray();
    for (const project of projects) {
      const hasCounter = project.counters.some((c) => c.id === counterId);
      if (hasCounter) {
        await db.projects.update(project.id, {
          counters: project.counters.filter((c) => c.id !== counterId),
        });
        
        // Refresh project store
        const { useProjectStore } = await import('./projectStore');
        useProjectStore.getState().loadProjects();
        break;
      }
    }
  },
  
  // Undo Last Change
  undo: async (counterId) => {
    const counter = get().counters.get(counterId);
    if (!counter || counter.history.length === 0) return;
    
    const lastEntry = counter.history[counter.history.length - 1];
    
    const updatedCounter = {
      ...counter,
      current: lastEntry.previousValue,
      history: counter.history.slice(0, -1),
      updatedAt: new Date(),
    };
    
    set((state) => {
      const newCounters = new Map(state.counters);
      newCounters.set(counterId, updatedCounter);
      return { counters: newCounters };
    });
    
    await persistCounterToProject(counterId, updatedCounter);
  },
  
  // Get Counters by Project
  getCountersByProject: (_projectId) => {
    return Array.from(get().counters.values()).filter(
      (_counter) => {
        // This is a simplified check - in reality we'd need to track project association
        // For now, we'll rely on the project's counters array
        return true;
      }
    );
  },
}));

// Helper function to persist counter changes to project
async function persistCounterToProject(counterId: string, updatedCounter: Counter) {
  const projects = await db.projects.toArray();
  
  for (const project of projects) {
    const counterIndex = project.counters.findIndex((c) => c.id === counterId);
    if (counterIndex !== -1) {
      const newCounters = [...project.counters];
      newCounters[counterIndex] = updatedCounter;
      
      await db.projects.update(project.id, {
        counters: newCounters,
        updatedAt: new Date(),
      });
      
      // IMPORTANT: Reload project store so UI refreshes
      const { useProjectStore } = await import('./projectStore');
      useProjectStore.getState().loadProjects();
      break;
    }
  }
}

// Initialize counters from projects
export async function loadCountersFromProjects() {
  const projects = await db.projects.toArray();
  const countersMap = new Map<string, Counter>();
  
  projects.forEach((project) => {
    project.counters.forEach((counter) => {
      countersMap.set(counter.id, counter);
    });
  });
  
  useCounterStore.setState({ counters: countersMap });
}
