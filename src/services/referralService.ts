/**
 * Referral System Service
 * Tracks referrals, generates codes, and manages rewards
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ReferralData {
  code: string;
  userId: string;
  referrals: number;
  rewardsClaimed: number;
  createdAt: Date;
  lastReferralAt?: Date;
}

const REFERRALS_COLLECTION = 'referrals';
const REFERRAL_TRACKING_COLLECTION = 'referral_tracking';

/**
 * Generate unique 6-character referral code
 */
export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create referral code for a user
 */
export async function createReferralCode(userId: string): Promise<string> {
  // Check if user already has a code
  const existingDoc = await getDoc(doc(db, REFERRALS_COLLECTION, userId));
  if (existingDoc.exists()) {
    return existingDoc.data().code;
  }

  // Generate unique code
  let code = generateCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const q = query(
      collection(db, REFERRALS_COLLECTION),
      where('code', '==', code)
    );
    const existing = await getDocs(q);

    if (existing.empty) {
      break; // Code is unique
    }

    code = generateCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique referral code');
  }

  // Create referral document
  await setDoc(doc(db, REFERRALS_COLLECTION, userId), {
    code,
    userId,
    referrals: 0,
    rewardsClaimed: 0,
    createdAt: serverTimestamp(),
  });

  return code;
}

/**
 * Get user's referral data
 */
export async function getReferralData(userId: string): Promise<ReferralData | null> {
  const docRef = doc(db, REFERRALS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    code: data.code,
    userId: data.userId,
    referrals: data.referrals || 0,
    rewardsClaimed: data.rewardsClaimed || 0,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    lastReferralAt: data.lastReferralAt instanceof Timestamp ? data.lastReferralAt.toDate() : undefined,
  };
}

/**
 * Track a successful referral
 * Call this when a referred user completes signup/first project
 */
export async function trackReferral(
  referralCode: string,
  newUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find referrer by code
    const q = query(
      collection(db, REFERRALS_COLLECTION),
      where('code', '==', referralCode.toUpperCase())
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: 'Invalid referral code' };
    }

    const referrerDoc = snapshot.docs[0];
    const referrerId = referrerDoc.id;

    // Check if this user was already tracked
    const trackingDoc = doc(db, REFERRAL_TRACKING_COLLECTION, newUserId);
    const trackingSnap = await getDoc(trackingDoc);

    if (trackingSnap.exists()) {
      return { success: false, error: 'User already tracked' };
    }

    // Record the referral tracking
    await setDoc(trackingDoc, {
      referrerId,
      referralCode,
      newUserId,
      trackedAt: serverTimestamp(),
    });

    // Increment referrer's count
    await updateDoc(referrerDoc.ref, {
      referrals: increment(1),
      lastReferralAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking referral:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get referral code from URL parameter
 */
export function getReferralCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

/**
 * Store referral code in localStorage for later tracking
 */
export function storeReferralCode(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mycrochetkit_referral_code', code.toUpperCase());
}

/**
 * Get stored referral code from localStorage
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mycrochetkit_referral_code');
}

/**
 * Clear stored referral code (after successful tracking)
 */
export function clearStoredReferralCode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('mycrochetkit_referral_code');
}

/**
 * Calculate rewards earned
 * For founders program: $10 per 3 referrals, max $100 (30 referrals)
 */
export function calculateRewards(referralCount: number): {
  rewardsEarned: number;
  nextRewardAt: number;
  maxedOut: boolean;
} {
  const REWARD_PER_MILESTONE = 10; // $10
  const REFERRALS_PER_REWARD = 3;
  const MAX_REWARDS = 10; // $100 total

  const rewardsEarned = Math.floor(referralCount / REFERRALS_PER_REWARD);
  const cappedRewards = Math.min(rewardsEarned, MAX_REWARDS);
  const nextMilestone = (Math.floor(referralCount / REFERRALS_PER_REWARD) + 1) * REFERRALS_PER_REWARD;

  return {
    rewardsEarned: cappedRewards * REWARD_PER_MILESTONE,
    nextRewardAt: cappedRewards >= MAX_REWARDS ? 30 : nextMilestone,
    maxedOut: cappedRewards >= MAX_REWARDS,
  };
}
