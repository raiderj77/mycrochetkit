/**
 * Shared utilities for Cloud Functions
 * 
 * Contains initialized Firebase Admin and Stripe instances
 * Separated to avoid circular imports
 * [Redeploy Trigger: 2025-12-24]
 */

import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

let _stripe: Stripe | null = null;

/**
 * Get Stripe client lazily
 * This ensures secrets are available in process.env (Firebase v2)
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const rawKey = process.env.STRIPE_SECRET_KEY || '';
    const key = rawKey.replace(/\s+/g, '');
    
    console.log(`Initializing Stripe. Key length: ${rawKey.length}, Sanitized length: ${key.length}`);
    if (rawKey.length > 0 && key.length === 0) {
      console.warn("STRIPE_SECRET_KEY was all whitespace!");
    }

    if (!key) {
      console.error('STRIPE_SECRET_KEY is MISSING in environment!');
      throw new Error('STRIPE_SECRET_KEY is not set or is empty in environment');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    });
    console.log("Stripe instance initialized successfully.");
  }
  return _stripe;
}

export { admin };
