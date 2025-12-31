/**
 * Pattern Store - Zustand State Management
 * 
 * Manages pattern library with search and filtering
 */

import { create } from 'zustand';
import { db } from '@/db/schema';
import type { Pattern, SkillLevel } from '@/types/models';

interface PatternStore {
  // State
  patterns: Pattern[];
  isLoading: boolean;
  
  // CRUD Operations
  addPattern: (pattern: Omit<Pattern, 'id' | 'dateAdded' | 'lastAccessed'>) => Promise<void>;
  updatePattern: (id: string, updates: Partial<Pattern>) => Promise<void>;
  deletePattern: (id: string) => Promise<void>;
  
  // Queries
  searchPatterns: (query: string) => Pattern[];
  filterBySkillLevel: (level: SkillLevel) => Pattern[];
  getFavorites: () => Pattern[];
  
  // Pattern Access
  markAccessed: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  // Data Loading
  loadPatterns: () => Promise<void>;
}

export const usePatternStore = create<PatternStore>((set, get) => ({
  // Initial State
  patterns: [],
  isLoading: false,
  
  // Add New Pattern
  addPattern: async (patternData) => {
    const newPattern: Pattern = {
      ...patternData,
      id: crypto.randomUUID(),
      dateAdded: new Date(),
      lastAccessed: new Date(),
      isFavorite: false,
    };
    
    await db.patterns.add(newPattern);
    
    // Reload to refresh UI
    await get().loadPatterns();
  },
  
  // Update Pattern
  updatePattern: async (id, updates) => {
    await db.patterns.update(id, updates);
    
    // Reload to refresh UI
    await get().loadPatterns();
  },
  
  // Delete Pattern
  deletePattern: async (id) => {
    await db.patterns.delete(id);
    
    // Reload to refresh UI
    await get().loadPatterns();
  },
  
  // Search Patterns
  searchPatterns: (query) => {
    const { patterns } = get();
    const lowerQuery = query.toLowerCase();
    return patterns.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.designer?.toLowerCase().includes(lowerQuery) ||
        p.notes?.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  // Filter by Skill Level
  filterBySkillLevel: (level) => {
    const { patterns } = get();
    return patterns.filter((p) => p.skillLevel === level);
  },
  
  // Get Favorites
  getFavorites: () => {
    const { patterns } = get();
    return patterns.filter((p) => p.isFavorite);
  },
  
  // Mark as Accessed
  markAccessed: async (id) => {
    await get().updatePattern(id, {
      lastAccessed: new Date(),
    });
  },
  
  // Toggle Favorite
  toggleFavorite: async (id) => {
    const pattern = get().patterns.find((p) => p.id === id);
    if (pattern) {
      await get().updatePattern(id, {
        isFavorite: !pattern.isFavorite,
      });
    }
  },
  
  // Load Patterns
  loadPatterns: async () => {
    set({ isLoading: true });
    
    try {
      const patterns = await db.patterns.toArray();
      set({ patterns, isLoading: false });
    } catch (error) {
      console.error('Failed to load patterns:', error);
      set({ isLoading: false });
    }
  },
}));
