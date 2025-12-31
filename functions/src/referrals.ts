/**
 * Referral Code Generation
 * 
 * Automatically generates a unique referral code for each new user
 */

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

if (!admin.apps.length) admin.initializeApp();

function randomCode(len = 6): string {
  // Exclude confusing characters: 0/O/1/I
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function generateUniqueReferralCode(): Promise<string> {
  // Try a few times; collisions are rare with 6 chars
  for (let i = 0; i < 10; i++) {
    const code = randomCode(6);
    const snap = await admin.firestore()
      .collection("users")
      .where("referralCode", "==", code)
      .limit(1)
      .get();
    if (snap.empty) return code;
  }
  // Fallback if somehow unlucky
  return randomCode(8);
}

/**
 * Async User Creation Hook (v1) - generates referral code
 * Using v1 trigger because it works reliably without GCIP blocking requirements
 */
export const onAuthUserCreated = functions.auth.user().onCreate(async (user) => {
  if (!user.uid) return;

  const referralCode = await generateUniqueReferralCode();

  // Store the referral code in Firestore
  await admin.firestore().doc(`users/${user.uid}`).set(
    {
      email: user.email || "",
      plan: "FREE",
      referralCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  
  console.log(`Generated referral code ${referralCode} for user ${user.uid}`);
});
