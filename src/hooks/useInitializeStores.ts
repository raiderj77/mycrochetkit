/**
 * Store Initialization Hook
 * 
 * Loads all data from IndexedDB on app startup
 * Loads subscription tier from Firestore when user authenticates
 */

import { useEffect } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { usePatternStore } from '@/stores/patternStore';
import { useStashStore } from '@/stores/stashStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

export function useInitializeStores() {
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const loadPatterns = usePatternStore((state) => state.loadPatterns);
  const loadStash = useStashStore((state) => state.loadStash);
  
  const initializeAuth = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  
  const loadSubscription = useSubscriptionStore((state) => state.loadSubscription);
  
  useEffect(() => {
    // Load all data from IndexedDB on mount
    loadProjects();
    loadPatterns();
    loadStash();
    
    // Initialize Auth listener
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [loadProjects, loadPatterns, loadStash, initializeAuth]);
  
  // Load subscription when user changes
  useEffect(() => {
    if (user?.uid) {
      loadSubscription(user.uid);
    }
  }, [user?.uid, loadSubscription]);
}

