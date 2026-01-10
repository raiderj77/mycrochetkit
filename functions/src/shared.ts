/**
 * Shared utilities for Cloud Functions
 * 
 * Contains initialized Firebase Admin and Stripe instances
 * Separated to avoid circular imports
 * [Redeploy Trigger: 2026-01-10]
 */

import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Get Stripe client lazily
 * This ensures secrets are available in process.env (Firebase v2)
 */
export function getStripe(): Stripe {
  // Use the secret injected via defineSecret or env var
  const rawKey = process.env.STRIPE_SECRET_KEY || '';
  const key = rawKey.replace(/\s+/g, '');

  console.log(`Initializing Stripe. Key length: ${rawKey.length}`);

  if (!key) {
    console.error('STRIPE_SECRET_KEY is MISSING in environment!');
    throw new Error('STRIPE_SECRET_KEY is not set or is empty in environment');
  }

  // Create a new instance (or cache it if we want, but for now let's be safe)
  const stripe = new Stripe(key, {
    apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
  });

  return stripe;
}

export { admin };
