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

  if (!user?.uid) {
    console.error('No user ID found - user must be logged in');
    alert('Please sign in to continue with checkout.');
    window.location.href = '/login';
    return;
  }

  let priceId = '';

  if (tier === 'lifetime') {
    priceId = import.meta.env.VITE_STRIPE_PRICE_LIFETIME || 'price_1ScrcR2fs8jzmCc3utSIHZTr';
  } else {
    priceId = billingPeriod === 'monthly'
      ? (import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_1ScrYv2fs8jzmCc38dhVgbwS')
      : (import.meta.env.VITE_STRIPE_PRICE_YEARLY || 'price_1ScrYv2fs8jzmCc3fIWaz7Eg');
  }

  if (!priceId) {
    console.error('Price ID not found for tier:', tier, 'billing:', billingPeriod);
    alert('Checkout configuration error. Please contact support.');
    return;
  }

  console.log('Redirecting to checkout:', { tier, billingPeriod, priceId, userId: user.uid });

  // Redirect to Cloud Function endpoint
  window.location.href = `/api/checkout?priceId=${priceId}&userId=${user.uid}`;
}

export function goToLifetimeCheckout() {
  goToCheckout('lifetime');
}

