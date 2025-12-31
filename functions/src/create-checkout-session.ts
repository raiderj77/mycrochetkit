/**
 * Create Checkout Session
 * 
 * Creates a Stripe Checkout session for subscription purchase
 * Called from frontend when user clicks upgrade button
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getStripe, admin } from './shared';
import Stripe from 'stripe';

const db = admin.firestore();

interface CheckoutSessionRequest {
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}

export const checkoutSession = onCall({
  // Secrets removed to avoid mangled annotations. Using plain env vars.
}, async (request) => {
  const { auth, data } = request;
  
  // Verify user is authenticated
  if (!auth) {
    throw new HttpsError(
      'unauthenticated',
      'You must be logged in to create a checkout session'
    );
  }

  const { priceId, userId, successUrl, cancelUrl } = data as CheckoutSessionRequest;

  // Verify the user matches the authenticated user
  if (auth.uid !== userId) {
    throw new HttpsError(
      'permission-denied',
      'You can only create checkout sessions for yourself'
    );
  }

  try {
    // Get user email
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData) {
      throw new HttpsError('not-found', 'User profile not found');
    }

    const userEmail = auth.token.email || userData.email;

    // Check if user already has a Stripe customer
    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      // Create new Stripe customer
      const stripe = getStripe();
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUID: userId,
        },
      });

      customerId = customer.id;

      // Save customer ID to user profile
      await db.collection('users').doc(userId).update({
        stripeCustomerId: customerId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Created Stripe customer ${customerId} for user ${userId}`);
    }

    // Verify priceId is allowed
    // Note: In production, these should be set as env vars
    const ALLOWED_PRICES = new Set([
      process.env.STRIPE_PRICE_MONTHLY,
      process.env.STRIPE_PRICE_YEARLY,
      process.env.STRIPE_PRICE_LIFETIME,
    ]);

    if (!priceId || !ALLOWED_PRICES.has(priceId)) {
      throw new HttpsError('invalid-argument', `Invalid or unknown priceId: ${priceId}. Ensure Price IDs are set in Cloud Run environment variables.`);
    }

    const isLifetime = (priceId === process.env.STRIPE_PRICE_LIFETIME);
    const mode = isLifetime ? 'payment' : 'subscription';

    console.log(`Creating checkout session for user ${userId} with price: ${priceId} (mode: ${mode})`);

    // Create session config
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: 'en',
      allow_promotion_codes: true,
    };

    // Construct metadata
    const metadata: Record<string, string> = {
      firebaseUID: userId,
    };
    if (isLifetime) {
      metadata.purchase = "LIFETIME";
      metadata.tier = "lifetime";
    }
    sessionConfig.metadata = metadata;

    // Add subscription-specific config
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        trial_period_days: 30, // 30-Day Money-Back Guarantee automated as trial
        metadata: {
          firebaseUID: userId,
        },
      };
    }

    // Create checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log(`Created checkout session ${session.id} for user ${userId}`);

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new HttpsError('internal', errMsg);
  }
});
