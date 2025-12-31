/**
 * Create Customer Portal Session
 * 
 * Creates a Stripe Customer Portal session for subscription management
 * Allows users to update payment methods, cancel subscriptions, view invoices
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getStripe, admin } from './shared';

const db = admin.firestore();

interface PortalSessionRequest {
  userId: string;
  returnUrl: string;
}

export const portalSession = onCall({}, async (request) => {
  const { auth, data } = request;
  
  // Verify user is authenticated
  if (!auth) {
    throw new HttpsError(
      'unauthenticated',
      'You must be logged in to access the customer portal'
    );
  }

  const { userId, returnUrl } = data as PortalSessionRequest;

  // Verify the user matches the authenticated user
  if (auth.uid !== userId) {
    throw new HttpsError(
      'permission-denied',
      'You can only access your own customer portal'
    );
  }

  try {
    // Get user's Stripe customer ID
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData) {
      throw new HttpsError('not-found', 'User profile not found');
    }

    const customerId = userData.stripeCustomerId;

    if (!customerId) {
      throw new HttpsError(
        'failed-precondition',
        'No Stripe customer found. Please subscribe first.'
      );
    }

    // Create portal session
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      // Pass UID in session metadata just in case (though portal usually doesn't trigger webhooks directly)
      metadata: {
        firebaseUID: userId,
      }
    } as any);

    console.log(`Created customer portal session for user ${userId}`);

    return {
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating portal session:', error);
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new HttpsError('internal', errMsg);
  }
});

