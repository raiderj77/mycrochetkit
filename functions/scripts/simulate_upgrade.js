/**
 * MyCrochetKit Webhook Simulation Script
 * -------------------------------------
 * This script localizes the logic from your Stripe Webhook to test 
 * how Firestore updates your user profile to LIFETIME.
 * 
 * Usage: node simulate_upgrade.js <USER_UID>
 */

const admin = require('firebase-admin');
const path = require('path');

// 1. Initialize Admin SDK
const serviceAccount = require('../../scripts/service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function simulateUpgrade(uid) {
  if (!uid) {
    console.error('❌ Error: Please provide a User UID as an argument.');
    process.exit(1);
  }

  console.log(`🔍 Checking user: ${uid}...`);
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    console.error(`❌ Error: User ${uid} not found in Firestore.`);
    process.exit(1);
  }

  const userData = userSnap.data();
  console.log('--- Current Status ---');
  console.log(`Tier: ${userData.tier || 'free'}`);
  console.log(`Plan: ${userData.plan || 'none'}`);

  // 2. Mock Stripe Event Payload
  const eventId = `test_evt_${Date.now()}`;
  const sessionId = `cs_test_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('\n🚀 Starting Simulation: checkout.session.completed');
  
  // ---------- IDEMPOTENCY GUARD TEST ----------
  console.log(`\nStep 1: Creating event audit for ${eventId}...`);
  const eventRef = db.collection("stripeEvents").doc(eventId);
  
  await eventRef.set({
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
    type: "checkout.session.completed",
  });

  // ---------- UPGRADE LOGIC ----------
  console.log('Step 2: Upgrading user to LIFETIME...');
  
  await userRef.set(
    {
      tier: "lifetime",
      plan: "LIFETIME", 
      subscriptionStatus: "active",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lifetimeSince: admin.firestore.FieldValue.serverTimestamp(),
      stripeCheckoutSessionId: sessionId,
    },
    { merge: true }
  );

  // ---------- REFERRAL QUALIFICATION ----------
  console.log('Step 3: Checking for Referral Qualification...');
  const referredByCode = userData.referredByCode;

  if (referredByCode) {
    console.log(`Found Referral Code: ${referredByCode}. Searching for referrer...`);
    const referrerQuery = await db.collection("users")
      .where("referralCode", "==", referredByCode.toUpperCase())
      .limit(1)
      .get();

    if (!referrerQuery.empty) {
      const referrerDoc = referrerQuery.docs[0];
      const referrerUid = referrerDoc.id;
      const eligibleAt = new Date();
      eligibleAt.setDate(eligibleAt.getDate() + 30); // 30-day hold

      console.log(`✅ Referrer found: ${referrerUid}. Creating reward (Status: Pending 30-day hold)...`);
      
      await db.collection("referralRewards").add({
        referrerUid,
        rewardType: "AMAZON_10",
        threshold: 3,
        status: "verifying",
        eligibleAt: admin.firestore.Timestamp.fromDate(eligibleAt),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        referredUid: uid
      });
    } else {
      console.log('⚠️ Referrer not found for code:', referredByCode);
    }
  } else {
    console.log('ℹ️ No referral code present for this user.');
  }

  console.log('\n--- ✅ SIMULATION COMPLETE ---');
  console.log('Refresh your Firestore dashboard to see the updates.');
}

const targetUid = process.argv[2];
simulateUpgrade(targetUid);
