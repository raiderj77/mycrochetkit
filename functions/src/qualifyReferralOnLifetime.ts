/**
 * Qualify Referrals on Lifetime Purchase
 * 
 * When a user makes a Lifetime purchase:
 * 1. Look up who referred them
 * 2. Mark the referral as "qualified"
 * 3. If referrer has 3+ qualified referrals, create a reward record
 */

import * as admin from "firebase-admin";

if (!admin.apps.length) admin.initializeApp();

const db = admin.firestore();

// Max $100 in rewards (10 x $10 cards)
const MAX_REWARDS_PER_USER = 10;
// Wait period for fraud/churn prevention (30 days)
const REWARD_WAIT_DAYS = 30;

type QualifyArgs = {
  referredUid: string;
  lifetimePurchaseId: string; // Stripe session/payment intent id
};

/**
 * Call this after confirming a successful Lifetime purchase
 */
export async function qualifyReferralOnLifetimePurchase(args: QualifyArgs) {
  const { referredUid, lifetimePurchaseId } = args;

  // Get the referred user's data
  const referredRef = db.doc(`users/${referredUid}`);
  const referredSnap = await referredRef.get();
  if (!referredSnap.exists) return;

  const referred = referredSnap.data() as Record<string, unknown>;
  const referredByCode = ((referred.referredByCode as string) || "").trim().toUpperCase();
  if (!referredByCode) return;

  // Look up referrer by referralCode
  const referrerQuery = await db
    .collection("users")
    .where("referralCode", "==", referredByCode)
    .limit(1)
    .get();

  if (referrerQuery.empty) return;

  const referrerDoc = referrerQuery.docs[0];
  const referrerUid = referrerDoc.id;

  // No self-referrals
  if (referrerUid === referredUid) return;

  // Only Lifetime users can earn rewards
  const referrer = referrerDoc.data() as Record<string, unknown>;
  if (referrer.plan !== "LIFETIME") return;

  // Create/Update referral record idempotently
  const referralId = `${referrerUid}_${referredUid}`;
  const referralRef = db.doc(`referrals/${referralId}`);

  // Anti-Fraud: Rate Limit (Max 10 qualified referrals per 24h)
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  
  const recentReferralsSnap = await db.collection("referrals")
    .where("referrerUid", "==", referrerUid)
    .where("status", "==", "qualified")
    .where("qualifiedAt", ">", admin.firestore.Timestamp.fromDate(yesterday))
    .count()
    .get();
  
  const recentCount = recentReferralsSnap.data().count;
  const isSpam = recentCount >= 10;

  if (isSpam) {
    console.warn(`Referral FLAGGED (Rate Limit): ${referrerUid} has ${recentCount} recent referrals`);
  }

  await db.runTransaction(async (tx) => {
    const existing = await tx.get(referralRef);

    // If already qualified, do nothing (idempotent)
    if (existing.exists && existing.data()?.status === "qualified") return;

    tx.set(
      referralRef,
      {
        referrerUid,
        referrerCode: referredByCode,
        referredUid,
        status: isSpam ? "flagged" : "qualified",
        qualifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        lifetimePurchaseId,
      },
      { merge: true }
    );

    // Store referrerUid on referred user (helpful for lookup)
    tx.set(referredRef, { referredByUid: referrerUid }, { merge: true });
  });

  // Count qualified referrals for referrer
  const qualifiedSnap = await db
    .collection("referrals")
    .where("referrerUid", "==", referrerUid)
    .where("status", "==", "qualified")
    .get();

  const qualifiedCount = qualifiedSnap.size;

  // Every 3 qualified referrals → create a reward record (manual fulfillment)
  if (qualifiedCount > 0 && qualifiedCount % 3 === 0) {
    // Check if user has already hit the $100 cap
    const totalRewardsSnap = await db
      .collection("referralRewards")
      .where("referrerUid", "==", referrerUid)
      .count()
      .get();
    
    const rewardsCount = totalRewardsSnap.data().count;

    if (rewardsCount >= MAX_REWARDS_PER_USER) {
      console.log(`Reward CAPPED: ${referrerUid} has already earned max ${MAX_REWARDS_PER_USER} rewards.`);
      return;
    }

    // Prevent duplicate rewards for same threshold
    const existingReward = await db
      .collection("referralRewards")
      .where("referrerUid", "==", referrerUid)
      .where("qualifiedReferralsAtCreation", "==", qualifiedCount)
      .limit(1)
      .get();

    if (existingReward.empty) {
      const eligibleAt = new Date();
      eligibleAt.setDate(eligibleAt.getDate() + REWARD_WAIT_DAYS);

      await db.collection("referralRewards").add({
        referrerUid,
        rewardType: "AMAZON_10",
        threshold: 3,
        qualifiedReferralsAtCreation: qualifiedCount,
        issued: false,
        status: "verifying",
        eligibleAt: admin.firestore.Timestamp.fromDate(eligibleAt),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Created reward for ${referrerUid} at ${qualifiedCount} referrals. Eligible on ${eligibleAt.toISOString()}`);
    }
  }
  
  console.log(`Qualified referral: ${referredUid} referred by ${referrerUid}`);
}
