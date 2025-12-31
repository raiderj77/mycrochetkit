/**
 * Yarn Stash Store - Zustand State Management
 * 
 * Manages yarn inventory with search and filtering
 */

import { create } from 'zustand';
import { db } from '@/db/schema';
import type { YarnStash, YarnWeight } from '@/types/models';

interface StashStore {
  // State
  stash: YarnStash[];
  isLoading: boolean;
  
  // CRUD Operations
  addYarn: (yarn: Omit<YarnStash, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateYarn: (id: string, updates: Partial<YarnStash>) => Promise<void>;
  deleteYarn: (id: string) => Promise<void>;
  
  // Queries
  searchStash: (query: string) => YarnStash[];
  filterByWeight: (weight: YarnWeight) => YarnStash[];
  filterByBrand: (brand: string) => YarnStash[];
  getLowStock: () => YarnStash[];
  
  // Inventory Management
  decreaseYardage: (id: string, amount: number) => Promise<void>;
  increaseYardage: (id: string, amount: number) => Promise<void>;
  
  // Data Loading
  loadStash: () => Promise<void>;
}

export const useStashStore = create<StashStore>((set, get) => ({
  // Initial State
  stash: [],
  isLoading: false,
  
  // Add New Yarn
  addYarn: async (yarnData) => {
    const newYarn: YarnStash = {
      ...yarnData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.stash.add(newYarn);
    
    // Reload to refresh UI
    await get().loadStash();
  },
  
  // Update Yarn
  updateYarn: async (id, updates) => {
    const updatedYarn = {
      ...updates,
      updatedAt: new Date(),
    };
    
    await db.stash.update(id, updatedYarn);
    
    set((state) => ({
      stash: state.stash.map((y) =>
        y.id === id ? { ...y, ...updatedYarn } : y
      ),
    }));
  },
  
  // Delete Yarn
  deleteYarn: async (id) => {
    await db.stash.delete(id);
    
    // Reload to refresh UI
    await get().loadStash();
  },
  
  // Search Stash
  searchStash: (query) => {
    const { stash } = get();
    const lowerQuery = query.toLowerCase();
    return stash.filter(
      (y) =>
        y.brand.toLowerCase().includes(lowerQuery) ||
        y.line?.toLowerCase().includes(lowerQuery) ||
        y.colorway.toLowerCase().includes(lowerQuery) ||
        y.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  // Filter by Weight
  filterByWeight: (weight) => {
    const { stash } = get();
    return stash.filter((y) => y.weight === weight);
  },
  
  // Filter by Brand
  filterByBrand: (brand) => {
    const { stash } = get();
    return stash.filter((y) => y.brand.toLowerCase() === brand.toLowerCase());
  },
  
  // Get Low Stock (less than 100 yards remaining)
  getLowStock: () => {
    const { stash } = get();
    return stash.filter((y) => y.yardageRemaining < 100);
  },
  
  // Decrease Yardage (when allocating to project)
  decreaseYardage: async (id, amount) => {
    const yarn = get().stash.find((y) => y.id === id);
    if (yarn) {
      await get().updateYarn(id, {
        yardageRemaining: Math.max(0, yarn.yardageRemaining - amount),
      });
    }
  },
  
  // Increase Yardage (when returning from project or adding more)
  increaseYardage: async (id, amount) => {
    const yarn = get().stash.find((y) => y.id === id);
    if (yarn) {
      await get().updateYarn(id, {
        yardageRemaining: yarn.yardageRemaining + amount,
      });
    }
  },
  
  // Load Stash
  loadStash: async () => {
    set({ isLoading: true });
    
    try {
      const stash = await db.stash.toArray();
      set({ stash, isLoading: false });
    } catch (error) {
      console.error('Failed to load stash:', error);
      set({ isLoading: false });
    }
  },
}));
