/**
 * Firebase Cloud Functions - Main Entry Point
 * 
 * Exports all cloud functions for deployment
 */

// Export event handler
export { stripeEvents } from './stripe-webhook';

// Export checkout session creator
export { checkoutSession } from './create-checkout-session';

// Export customer portal session creator
export { portalSession } from './create-portal-session';

// Export founders spots decrement
export { decrementLifetimeSpotsOnSuccessfulPayment } from './founders_spots';

// Export direct checkout (no auth required)
export { directCheckout as lifetimePurchase } from './lifetime-checkout';

// Export referral code generation on user creation
export { onAuthUserCreated } from './referrals';

// Export daily referral check
export { checkPendingReferrals } from './referralDailyCheck';

// Export content scheduler functions
export { 
  runContentScheduler, 
  scheduledContentPublish, 
  getSchedulerStatus 
} from './contentScheduler';
