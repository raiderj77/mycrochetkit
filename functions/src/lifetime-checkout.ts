import { onRequest } from "firebase-functions/v2/https";
import { getStripe, admin } from "./shared";
import Stripe from "stripe";

// Env vars needed in Firebase Functions:
// STRIPE_SECRET_KEY=sk_...
// STRIPE_PRICE_LIFETIME=price_...
// SITE_URL=https://mycrochetkit.com

/**
 * Lifetime Checkout - Direct Stripe Checkout Session
 * 
 * GET /api/lifetime-checkout → Creates a Stripe Checkout Session and redirects
 * This allows unauthenticated users to purchase Lifetime directly
 * 
 * Server-side enforcement of:
 * - paymentsEnabled (kill switch)
 * - foundersOpen
 * - lifetimeSpotsRemaining > 0
 */
export const directCheckout = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const method = req.method;
      if (method !== "GET" && method !== "POST") {
        res.status(405).send("Method not allowed");
        return;
      }

      // Get priceId from request
      const data = method === "POST" ? req.body : req.query;
      let priceId = (data.priceId || data.price_id) as string | undefined;

      // Default to Lifetime ONLY if no priceId provided AND specifically hitting the old endpoint (implicit)
      // Actually, let's just make it required or use the environment variable if we are absolutely sure.
      if (!priceId) {
        priceId = process.env.STRIPE_PRICE_LIFETIME || 'price_1ScrcR2fs8jzmCc3utSIHZTr';
      }

      const siteUrl = process.env.SITE_URL || "https://mycrochetkit.com";

      if (!priceId) {
        res.status(400).send("Price ID is required.");
        return;
      }

      // Validate Price ID - fallback values if env vars not set
      const PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY || 'price_1ScrYv2fs8jzmCc38dhVgbwS';
      const PRICE_YEARLY = process.env.STRIPE_PRICE_YEARLY || 'price_1ScrYv2fs8jzmCc3fIWaz7Eg';
      const PRICE_LIFETIME = process.env.STRIPE_PRICE_LIFETIME || 'price_1ScrcR2fs8jzmCc3utSIHZTr';

      const ALLOWED_PRICES = new Set([
        PRICE_MONTHLY,
        PRICE_YEARLY,
        PRICE_LIFETIME,
      ]);

      if (!ALLOWED_PRICES.has(priceId)) {
        res.status(400).send("Invalid Price ID.");
        return;
      }

      // ✅ Enforce billing rules from Firestore
      const billingSnap = await admin.firestore().doc("appConfig/billing").get();
      const billing = (billingSnap.exists ? billingSnap.data() : {}) as Record<string, unknown>;

      if (billing.paymentsEnabled === false) {
        res.status(403).send("Payments are currently paused.");
        return;
      }

      const isLifetime = (priceId === PRICE_LIFETIME);
      const mode = isLifetime ? 'payment' : 'subscription';

      // Specific checks for Lifetime
      if (isLifetime) {
        if (billing.foundersOpen === false) {
          res.status(403).send("Founders Lifetime is closed.");
          return;
        }
        if (Number(billing.lifetimeSpotsRemaining ?? 0) <= 0) {
          res.status(403).send("Founders Lifetime is sold out.");
          return;
        }
      }

      const userId = (data.userId || data.uid) as string | undefined;
      const email = (data.email) as string | undefined;

      console.log(`Direct checkout. Mode: ${mode}, Price: ${priceId}, User: ${userId || 'Guest'}`);

      const stripe = getStripe();
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${siteUrl}/welcome?success=1`,
        cancel_url: `${siteUrl}/pricing?canceled=1`,
        customer_email: email || undefined,
        client_reference_id: userId,
        metadata: {
          purchase: isLifetime ? "LIFETIME" : "PRO",
          firebaseUID: userId || ""
        },
        locale: 'en',
        allow_promotion_codes: true,
      };

      if (mode === 'subscription') {
        sessionConfig.subscription_data = {
          trial_period_days: 30, // 30-Day Money-Back Guarantee
          metadata: {
            firebaseUID: userId || "",
          }
        };
      }

      console.log(`Creating Stripe Checkout session with mode: ${mode}, priceId: ${priceId}`);
      const session = await stripe.checkout.sessions.create(sessionConfig);
      console.log(`Stripe session created: ${session.id}, URL present: ${!!session.url}`);

      if (!session.url) {
        console.error("Stripe returned a session WITHOUT a URL.");
        res.status(500).send("No checkout URL returned from Stripe.");
        return;
      }

      if (method === "POST" && req.headers['accept']?.includes('application/json')) {
        console.log("Responding with JSON session URL");
        res.json({ url: session.url });
      } else {
        console.log(`Redirecting to Stripe: ${session.url.substring(0, 50)}...`);
        res.redirect(303, session.url);
      }
    } catch (e: unknown) {
      console.error("Direct checkout error:", e);
      res.status(500).send("Error creating checkout session");
    }
  }
);
