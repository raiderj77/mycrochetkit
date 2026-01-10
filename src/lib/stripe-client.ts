/**
 * Stripe Client Helpers
 * 
 * Client-side Stripe redirect utilities
 */

import { useAuthStore } from '../stores/useAuthStore';

/**
 * Unified checkout redirect
 */
export function goToCheckout(tier: 'pro' | 'lifetime', billingPeriod: 'monthly' | 'annual' = 'monthly') {
  const { user } = useAuthStore.getState();

  let priceId = '';
  if (tier === 'lifetime') {
    priceId = import.meta.env.VITE_STRIPE_PRICE_LIFETIME || 'price_1ScrcR2fs8jzmCc3utSIHZTr';
  } else {
    priceId = billingPeriod === 'monthly'
      ? (import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_1ScrYv2fs8jzmCc38dhVgbwS')
      : (import.meta.env.VITE_STRIPE_PRICE_YEARLY || 'price_1ScrYv2fs8jzmCc3fIWaz7Eg');
  }

  // Use a direct GET redirect which is handled by the Cloud Function's res.redirect
  window.location.href = `/api/checkout?priceId=${priceId}&userId=${user?.uid || ''}`;
}

export function goToLifetimeCheckout() {
  goToCheckout('lifetime');
}
