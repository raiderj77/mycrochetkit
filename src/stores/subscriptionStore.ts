/**
 * Subscription Store - Zustand State Management
 * 
 * Manages subscription tiers and feature access
 * Integrates with Stripe via Firebase Functions
 */

import { create } from 'zustand';
import type { SubscriptionTier, SubscriptionStatus } from '@/types/models';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestoreInstance } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Tier Limits
const TIER_LIMITS = {
  free: {
    projects: 3,
    patterns: 3,
    listings: 0,
    cloudStorageGB: 0, // Local only - no cloud storage
    photosPerProject: 0, // No cloud photos
  },
  pro: {
    projects: 100,
    patterns: 50,
    listings: 0,
    cloudStorageGB: 2, // 2GB cloud storage
    photosPerProject: 10,
  },
  lifetime: {
    projects: Infinity,
    patterns: Infinity,
    listings: Infinity,
    cloudStorageGB: 1, // 1GB cloud storage (as per user request)
    photosPerProject: Infinity,
  },
};

interface SubscriptionStore {
  // State
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trialEndsAt: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  loading: boolean;
  error: string | null;
  bonusStorageGB: number; // For manual add-ons
  
  // Helper Functions
  isFree: () => boolean;
  isPro: () => boolean;
  isLifetime: () => boolean;
  isTrialActive: () => boolean;
  
  // Feature Access
  canAccessTimer: () => boolean;
  canAccessGlossary: () => boolean;
  canSellItems: () => boolean;
  getProjectLimit: () => number;
  getPatternLimit: () => number;
  getListingLimit: () => number;
  getCloudStorageLimit: () => number;
  
  // Stripe Actions
  createCheckoutSession: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  
  // Actions
  setTier: (tier: SubscriptionTier) => void;
  setStatus: (status: SubscriptionStatus) => void;
  loadSubscription: (userId: string) => Promise<void>;
}

// Default limits for unknown/legacy tiers
const DEFAULT_LIMITS = TIER_LIMITS.free;

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  // State
  tier: 'free',
  status: null,
  trialEndsAt: null,
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  currentPeriodEnd: null,
  loading: false,
  error: null,
  bonusStorageGB: 0,
  
  // Tier Checks
  isFree: () => get().tier === 'free',
  isPro: () => get().tier === 'pro',
  isLifetime: () => get().tier === 'lifetime',
  
  // Trial Check
  isTrialActive: () => {
    const { status, trialEndsAt } = get();
    if (status !== 'trial' || !trialEndsAt) return false;
    return new Date() < trialEndsAt;
  },
  
  // Feature Access Checks
  canAccessTimer: () => {
    const { isPro, isTrialActive } = get();
    return isPro() || isTrialActive();
  },
  
  canAccessGlossary: () => {
    const { isPro, isTrialActive } = get();
    return isPro() || isTrialActive();
  },
  
  canSellItems: () => {
    const { isLifetime } = get();
    return isLifetime();
  },
  
  // Limit Getters with safe fallback
  getProjectLimit: () => {
    const tier = get().tier;
    return (TIER_LIMITS as any)[tier]?.projects ?? DEFAULT_LIMITS.projects;
  },
  
  getPatternLimit: () => {
    const tier = get().tier;
    return (TIER_LIMITS as any)[tier]?.patterns ?? DEFAULT_LIMITS.patterns;
  },
  
  getListingLimit: () => {
    const tier = get().tier;
    return (TIER_LIMITS as any)[tier]?.listings ?? DEFAULT_LIMITS.listings;
  },

  getCloudStorageLimit: () => {
    const { tier, bonusStorageGB } = get();
    const base = (TIER_LIMITS as any)[tier]?.cloudStorageGB ?? DEFAULT_LIMITS.cloudStorageGB;
    return base + bonusStorageGB;
  },
  
  // Stripe Actions
  createCheckoutSession: async (priceId: string) => {
    if (import.meta.env.VITE_IS_PLAYWRIGHT === 'true') {
      alert('Playwright Mode: Stripe Redirect Blocked');
      return;
    }
    set({ loading: true, error: null });
    
    try {
      const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to subscribe');
      }
      
      const functions = getFunctions();
      const createCheckout = httpsCallable(functions, 'checkoutSession');
      
      const result = await createCheckout({
        priceId,
        userId: user.uid,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });
      
      const { url } = result.data as { url: string };
      window.location.href = url;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create checkout session';
      console.error('Error creating checkout session:', error);
      set({ error: message, loading: false });
      throw error;
    }
  },
  
  openCustomerPortal: async () => {
    if (import.meta.env.VITE_IS_PLAYWRIGHT === 'true') {
      alert('Playwright Mode: Customer Portal Redirect Blocked');
      return;
    }
    set({ loading: true, error: null });
    
    try {
      const { auth } = await import('@/lib/firebase');
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to manage subscription');
      }
      
      const functions = getFunctions();
      const createPortal = httpsCallable(functions, 'portalSession');
      
      const result = await createPortal({
        userId: user.uid,
        returnUrl: `${window.location.origin}/settings`,
      });
      
      const { url } = result.data as { url: string };
      window.location.href = url;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to open customer portal';
      console.error('Error opening customer portal:', error);
      set({ error: message, loading: false });
      throw error;
    }
  },
  
  // Actions
  setTier: (tier) => set({ tier }),
  setStatus: (status) => set({ status }),
  
  // Load subscription from user profile
  loadSubscription: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const db = getFirestoreInstance();
      if (!db) {
        console.warn('Firestore not available, using default free tier');
        set({ tier: 'free', status: null, loading: false });
        return;
      }
      
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        set({
          tier: data.subscriptionTier || 'free',
          status: data.subscriptionStatus || null,
          trialEndsAt: data.trialEndsAt?.toDate() || null,
          stripeCustomerId: data.stripeCustomerId || null,
          stripeSubscriptionId: data.stripeSubscriptionId || null,
          currentPeriodEnd: data.currentPeriodEnd?.toDate() || null,
          bonusStorageGB: data.bonusStorageGB || 0,
          loading: false,
        });
      } else {
        set({
          tier: 'free',
          status: null,
          trialEndsAt: null,
          loading: false,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load subscription';
      console.error('Error loading subscription:', error);
      set({ error: message, loading: false });
    }
  },
}));

// Expose store for E2E testing
if (import.meta.env.DEV || import.meta.env.VITE_IS_PLAYWRIGHT === 'true') {
  (window as any).__SUBSCRIPTION_STORE__ = useSubscriptionStore;
}
