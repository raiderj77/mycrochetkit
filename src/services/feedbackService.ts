/**
 * Feedback Service
 * Collects user feedback and feature requests
 * Stores in Firestore (public collection)
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface FeedbackEntry {
  type: 'bug' | 'feature' | 'feedback' | 'other';
  message: string;
  email?: string;
  page?: string;
  userAgent?: string;
  createdAt: ReturnType<typeof serverTimestamp>;
}

const COLLECTION = 'feedback';

/**
 * Submit feedback
 */
export async function submitFeedback(
  type: FeedbackEntry['type'],
  message: string,
  email?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!message.trim() || message.length < 10) {
      return { success: false, error: 'Please provide more details (at least 10 characters).' };
    }

    await addDoc(collection(db, COLLECTION), {
      type,
      message: message.trim(),
      email: email?.toLowerCase().trim() || null,
      page: typeof window !== 'undefined' ? window.location.pathname : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Feedback submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
