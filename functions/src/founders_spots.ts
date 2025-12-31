import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "./shared";

/**
 * Decrement founders lifetime spots ONLY when:
 * - foundersOpen === true
 * - payment.status === "succeeded"
 * - payment.metadata.purchase === "LIFETIME"
 *
 * Idempotent:
 * - Uses a ledger doc at foundersLedger/{paymentId}
 * - If it already exists, we do nothing (prevents double decrement on retries)
 *
 * Never below 0:
 * - Spots clamp at 0.
 */
export const decrementLifetimeSpotsOnSuccessfulPayment = onDocumentCreated(
  "customers/{uid}/payments/{paymentId}",
  async (event) => {
    const uid = event.params.uid;
    const paymentId = event.params.paymentId;
    const payment = event.data?.data() || {};

    const status = String(payment.status || "");
    if (status !== "succeeded") return;

    const purchase = String(payment.metadata?.purchase || "");
    if (purchase !== "LIFETIME") return;

    const db = admin.firestore();
    const billingRef = db.doc("appConfig/billing");
    const ledgerRef = db.doc(`foundersLedger/${paymentId}`);

    await db.runTransaction(async (tx) => {
      // Idempotency ledger check
      const ledgerSnap = await tx.get(ledgerRef);
      if (ledgerSnap.exists) return; // already processed

      const billingSnap = await tx.get(billingRef);
      if (!billingSnap.exists) {
        // If config doesn't exist, create it safely (ethical default: founders open but no spots claimed)
        tx.set(
          billingRef,
          { foundersOpen: true, lifetimeSpotsRemaining: 500 },
          { merge: true }
        );
      }

      const billingData = (billingSnap.data() || {}) as Record<string, unknown>;
      const foundersOpen = billingData.foundersOpen === true;

      // If founders are closed, do not decrement
      if (!foundersOpen) {
        tx.set(ledgerRef, {
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          uid,
          paymentId,
          note: "Founders closed; no decrement.",
        });
        return;
      }

      const current = Number(billingData.lifetimeSpotsRemaining ?? 0);
      const next = Math.max(0, current - 1);

      tx.set(
        billingRef,
        {
          lifetimeSpotsRemaining: next,
          // Optional: auto-close founders when it hits 0
          foundersOpen: next > 0,
        },
        { merge: true }
      );

      // Record ledger to prevent double-decrement
      tx.set(ledgerRef, {
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        uid,
        paymentId,
        purchase,
        status,
        before: current,
        after: next,
      });
    });
  }
);
