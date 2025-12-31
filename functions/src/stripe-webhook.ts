/**
 * Stripe Webhook Handler
 * 
 * Processes Stripe webhook events and updates Firestore user profiles
 * with subscription status changes
 */

import { onRequest } from 'firebase-functions/v2/https';
import { getStripe, admin } from './shared';
import Stripe from 'stripe';
import { qualifyReferralOnLifetimePurchase } from './qualifyReferralOnLifetime';

const db = admin.firestore();

// @ts-ignore
export const stripeEvents = onRequest({ enforceAppCheck: false }, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('Missing stripe-signature header');
    res.status(400).send('Missing signature');
    return;
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errMsg);
    res.status(400).send(`Webhook Error: ${errMsg}`);
    return;
  }

  // ---------- STEP 2: IDEMPOTENCY GUARD ----------
  const eventRef = db.collection("stripeEvents").doc(event.id);
  const alreadyProcessed = await eventRef.get();

  if (alreadyProcessed.exists) {
    console.log("🔁 Stripe event already handled:", event.id);
    res.json({ received: true, duplicate: true });
    return;
  }
  // -----------------------------------------------

  // ---------- STEP 3: EVENT ROUTING -----------
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(sub);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log("Ignoring event type:", event.type);
        res.json({ received: true, ignored: true });
        return;
    }

    // ---------- MARK AS PROCESSED ----------
    await eventRef.set({
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      type: event.type,
    });
    // ---------------------------------------

    res.json({ received: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errMsg);
    res.status(500).send(`Webhook processing error: ${errMsg}`);
  }
});

/**
 * Robust User Identity Resolution (Step 1)
 */
async function resolveUserId(session: Stripe.Checkout.Session | Stripe.Invoice | Stripe.Subscription): Promise<string | null> {
  // Check metadata for firebaseUID
  let userId = session.metadata?.firebaseUID;
  if (userId) return userId;

  // Check client_reference_id (standard Stripe field)
  if (session.object === 'checkout.session') {
    userId = (session as Stripe.Checkout.Session).client_reference_id || undefined;
    if (userId) return userId;
  }
 
  // If session is Checkout Session, check subscription metadata with retrieve
  if (session.object === 'checkout.session' && session.subscription) {
    try {
      const subId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription.id;
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(subId);
      userId = sub.metadata?.firebaseUID;
      if (userId) return userId;
    } catch (e) {
      console.warn('Subscription metadata retrieval failed:', e);
    }
  }
 
  // If session is Invoice, check subscription metadata
  if (session.object === 'invoice' && session.subscription) {
     try {
      const subId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription.id;
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(subId);
      userId = sub.metadata?.firebaseUID;
      if (userId) return userId;
     } catch (e) {
       console.warn('Subscription metadata retrieval failed for invoice:', e);
     }
  }
 
  // Fallback: lookup by email
  const email = (session as Stripe.Checkout.Session).customer_details?.email || 
                (session as Stripe.Checkout.Session).customer_email || 
                (session as any).email; // Invoice doesn't have email in top level, but customer_email
  
  if (email && typeof email === 'string') {
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    if (!usersSnapshot.empty) return usersSnapshot.docs[0].id;
  }
 
  // Fallback: Customer ID lookup
  if (session.customer) {
    const customerId = typeof session.customer === 'string' 
      ? session.customer 
      : session.customer.id;
    return await getUserIdFromCustomerId(customerId);
  }
 
  return null;
}

/**
 * STEP 4: Handle checkout.session.completed (Lifetime vs Subscription Trial)
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // A) Resolve userId
  const userId = await resolveUserId(session);
  if (!userId) return;

  // IMPORTANT: Only process paid sessions for one-time payments
  // (Subscriptions might be 'paid' or just 'trialing' depending on config)
  const isLifetime = session.metadata?.purchase === "LIFETIME";

  if (isLifetime) {
    if (session.payment_status !== 'paid') {
      console.log(`Checkout session ${session.id} not yet paid, skipping lifetime upgrade`);
      return;
    }

    // B) upgrade idempotently
    const userRef = db.collection("users").doc(userId);
    const snap = await userRef.get();

    if (snap.exists && snap.data()?.tier === "lifetime") {
      console.log("✅ Already lifetime:", userId);
      return;
    }

    await userRef.set(
      {
        tier: "lifetime",
        plan: "LIFETIME", // frontend compatibility
        subscriptionTier: "lifetime", // legacy compatibility
        subscriptionStatus: "active",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lifetimeSince: admin.firestore.FieldValue.serverTimestamp(),
        stripeCustomerId: session.customer ?? null,
        stripeCheckoutSessionId: session.id,
      },
      { merge: true }
    );

    console.log(`Updated user ${userId} to LIFETIME plan`);

    // C) Qualify referral AFTER tier update
    try {
      await qualifyReferralOnLifetimePurchase({
        referredUid: userId,
        lifetimePurchaseId: session.id,
      });
    } catch (err) {
      console.error('Error qualifying referral:', err);
    }
  } else {
    // It's a subscription setup
    console.log('Subscription checkout completed, handling via subscription events');
  }
}

/**
 * STEP 5: Handle invoice.payment_succeeded (Subscription Activation)
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const userId = await resolveUserId(invoice);
  if (!userId) return;

  // We primarily care about subscription invoices
  if (!invoice.subscription) return;

  const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
  const stripe = getStripe();
  const sub = await stripe.subscriptions.retrieve(subId);
  
  const tier = getTierFromPriceId(sub.items.data[0].price.id);
  const status = sub.status === 'trialing' ? 'trial' : 'active';

  console.log(`Payment succeeded for user ${userId}: $${invoice.amount_paid / 100} (${tier})`);

  // Update user profile
  await db.collection('users').doc(userId).update({
    tier: tier,
    subscriptionTier: tier,
    subscriptionStatus: status,
    stripeSubscriptionId: sub.id,
    currentPeriodEnd: new Date(sub.current_period_end * 1000),
    trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
    lastPaymentDate: new Date(invoice.created * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // If this is the FIRST payment after trial, could qualify for non-cancel referral here
  // For now, Lifetime is the primary trigger, but we track billing status accurately.
}

/**
 * Handle subscription created or updated
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  let userId = subscription.metadata?.firebaseUID || null;
  
  if (!userId) {
    userId = await getUserIdFromCustomerId(customerId);
  }
  
  if (!userId) {
    console.error('No user found for customer:', customerId);
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  const tier = getTierFromPriceId(priceId);
  
  let status: string;
  if (subscription.status === 'trialing') {
    status = 'trial';
  } else if (subscription.status === 'active') {
    status = 'active';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  } else if (subscription.status === 'canceled') {
    status = 'canceled';
  } else {
    status = subscription.status;
  }

  await db.collection('users').doc(userId).update({
    tier: tier,
    subscriptionTier: tier,
    subscriptionStatus: status,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Updated subscription for user ${userId}: ${tier} (${status})`);
}

/**
 * Handle subscription deleted/canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  let userId = subscription.metadata?.firebaseUID || null;
  
  if (!userId) {
    userId = await getUserIdFromCustomerId(customerId);
  }
  
  if (!userId) {
    console.error('No user found for customer:', customerId);
    return;
  }

  await db.collection('users').doc(userId).update({
    tier: 'free',
    subscriptionTier: 'free',
    subscriptionStatus: 'canceled',
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Subscription canceled for user ${userId}, reverted to free tier`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = await resolveUserId(invoice);
  if (!userId) return;

  console.error(`Payment failed for user ${userId}`);
  
  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'past_due',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Get user ID from Stripe customer ID
 */
async function getUserIdFromCustomerId(customerId: string): Promise<string | null> {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('stripeCustomerId', '==', customerId).limit(1).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  return snapshot.docs[0].id;
}

/**
 * Get tier from Stripe price ID
 */
function getTierFromPriceId(priceId: string): 'free' | 'pro' {
  const proPrices = [
    process.env.STRIPE_PRICE_MONTHLY,
    process.env.STRIPE_PRICE_YEARLY,
  ];
  
  if (proPrices.includes(priceId)) {
    return 'pro';
  }
  
  return 'free';
}
