/**
 * Referral Daily Check Cloud Function
 * 
 * Runs daily to verify if pending referrals have passed the 30-day window
 * and if the referred user still has an active paid subscription.
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

export const checkPendingReferrals = functions.pubsub
  .schedule('0 0 * * *') // Run daily at midnight
  .onRun(async () => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    const thirtyDaysAgo = new Date(now.toDate());
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log(`Checking pending referrals older than: ${thirtyDaysAgo.toISOString()}`);

    // Find all pending referrals older than 30 days
    const pendingReferrals = await db.collection('users')
      .where('referralStatus', '==', 'pending')
      .where('purchaseDate', '<=', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();

    if (pendingReferrals.empty) {
      console.log('No pending referrals to process.');
      return null;
    }

    const batch = db.batch();
    let processedCount = 0;

    for (const doc of pendingReferrals.docs) {
      const userData = doc.data();
      
      // Check if user still has paid subscription (not refunded/cancelled)
      // Note: tier 'free' means they cancelled or were refunded or their subscription expired
      const hasPaidPlan = userData.tier === 'pro' || userData.tier === 'lifetime' || 
                         userData.subscriptionTier === 'pro' || userData.subscriptionTier === 'lifetime';

      if (hasPaidPlan && userData.subscriptionStatus !== 'canceled') {
        // Mark referral as completed
        batch.update(doc.ref, {
          referralStatus: 'completed',
          referralCompletedDate: now,
          updatedAt: now
        });

        // Increment referrer's completed count
        if (userData.referredByCode) {
          // Look up referrer by code
          const referrerSnap = await db.collection('users')
            .where('referralCode', '==', userData.referredByCode)
            .limit(1)
            .get();

          if (!referrerSnap.empty) {
            const referrerRef = referrerSnap.docs[0].ref;
            batch.update(referrerRef, {
              completedReferrals: admin.firestore.FieldValue.increment(1),
              updatedAt: now
            });
            console.log(`✅ Success: Completed referral for code ${userData.referredByCode}. Referred User: ${doc.id}`);
          } else {
            console.warn(`⚠️ Referrer not found for code: ${userData.referredByCode}`);
          }
        }
      } else {
        // User downgraded to free or cancelled within 30 days
        batch.update(doc.ref, {
          referralStatus: 'failed',
          updatedAt: now
        });
        console.log(`❌ Failed: Referral for user ${doc.id} failed (User is on ${userData.tier} tier or canceled)`);
      }
      processedCount++;
    }

    await batch.commit();
    console.log(`Done. Processed ${processedCount} pending referrals.`);
    return null;
  });
