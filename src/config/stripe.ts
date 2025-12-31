/**
 * Stripe Client Configuration
 * 
 * Initializes Stripe.js for client-side payment processing
 * Provides utility functions for price IDs and checkout
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PRICING } from './pricing';

// Get publishable key from environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Stripe instance (lazy loaded)
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance
 * Lazy loads Stripe.js on first call
 */
export function getStripeInstance(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY not set in environment');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
}

/**
 * Get price ID for a specific tier and billing period
 */
export function getPriceId(
  tier: 'pro' | 'lifetime',
  period: 'monthly' | 'annual'
): string {
  if (tier === 'lifetime') return PRICING.lifetime.priceId;
  if (tier === 'pro') {
    return period === 'monthly' ? PRICING.proMonthly.priceId : PRICING.proAnnual.priceId;
  }
  return '';
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!stripePublishableKey &&
         !!PRICING.proMonthly.priceId &&
         !!PRICING.proAnnual.priceId &&
         !!PRICING.lifetime.priceId;
}

/**
 * Log Stripe configuration status (for debugging)
 */
export function logStripeStatus(): void {
  console.group('💳 Stripe Configuration');
  console.log('Publishable Key Set:', !!stripePublishableKey);
  console.log('Pro Monthly Price:', !!PRICING.proMonthly.priceId);
  console.log('Pro Annual Price:', !!PRICING.proAnnual.priceId);
  console.log('Lifetime Price:', !!PRICING.lifetime.priceId);
  console.groupEnd();
}

