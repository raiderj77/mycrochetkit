/**
 * Waitlist Service
 * Collects emails for founders tier waitlist + referral tracking
 * Stores in Firestore (public collection, no auth required)
 */

import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export interface WaitlistEntry {
  email: string;
  source: 'founders' | 'newsletter' | 'beta' | 'referral';
  referrer?: string;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
  createdAt: ReturnType<typeof serverTimestamp>;
}

const COLLECTION = 'waitlist';

/**
 * Generate a simple referral code from email
 */
function generateReferralCode(email: string): string {
  const hash = email.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString(36).slice(0, 8).toUpperCase();
}

/**
 * Get referral code from URL params
 */
export function getReferralFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('ref') || params.get('referral');
}

/**
 * Build referral URL for sharing
 */
export function buildReferralURL(referralCode: string): string {
  return `https://mycrochetkit.com/?ref=${referralCode}`;
}

/**
 * Add email to waitlist with referral tracking
 * Returns referral code for sharing
 */
export async function addToWaitlist(
  email: string,
  source: WaitlistEntry['source'] = 'founders',
  referredByCode?: string
): Promise<{ success: boolean; isNew: boolean; referralCode?: string; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const referralCode = generateReferralCode(normalizedEmail);
    
    // Check if email already exists
    const existingQuery = query(
      collection(db, COLLECTION),
      where('email', '==', normalizedEmail)
    );
    const existing = await getDocs(existingQuery);
    
    if (!existing.empty) {
      // Return existing user's referral code
      const existingData = existing.docs[0].data();
      return { 
        success: true, 
        isNew: false, 
        referralCode: existingData.referralCode || referralCode 
      };
    }

    // If referred by someone, credit them
    let referredByEmail: string | undefined;
    if (referredByCode) {
      const referrerQuery = query(
        collection(db, COLLECTION),
        where('referralCode', '==', referredByCode)
      );
      const referrerDocs = await getDocs(referrerQuery);
      if (!referrerDocs.empty) {
        const referrerDoc = referrerDocs.docs[0];
        referredByEmail = referrerDoc.data().email;
        // Increment referral count for the referrer
        await updateDoc(referrerDoc.ref, {
          referralCount: increment(1),
        });
      }
    }

    // Add new entry with referral code
    await addDoc(collection(db, COLLECTION), {
      email: normalizedEmail,
      source: referredByCode ? 'referral' : source,
      referrer: document.referrer || null,
      referralCode,
      referredBy: referredByEmail || null,
      referralCount: 0,
      createdAt: serverTimestamp(),
    });

    return { success: true, isNew: true, referralCode };
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return { 
      success: false, 
      isNew: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get waitlist count (for social proof)
 */
export async function getWaitlistCount(): Promise<number> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.size;
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return 0;
  }
}
