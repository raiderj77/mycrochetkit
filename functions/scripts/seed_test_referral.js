/**
 * Seed Referrer/Referral Test Pair
 */
const admin = require('firebase-admin');
const serviceAccount = require('../../scripts/service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function seedTestPair() {
  const referrerUid = 'TEST_REFERRER_UID_' + Date.now();
  const referralUid = 'TEST_REFERRAL_UID_' + Date.now();
  const referralCode = 'LAUNCH2026';

  console.log('🌱 Seeding Test Referrer...');
  await db.collection('users').doc(referrerUid).set({
    email: 'referrer@test.com',
    referralCode: referralCode,
    tier: 'free',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('🌱 Seeding Test Referral (with referral code)...');
  await db.collection('users').doc(referralUid).set({
    email: 'referral@test.com',
    referredByCode: referralCode,
    tier: 'free',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('\n✅ Test Pair Created!');
  console.log('Referrer UID:', referrerUid);
  console.log('Referral UID:', referralUid);
  console.log('Referral Code:', referralCode);
  console.log('\n🚀 NOW RUN: node scripts/simulate_upgrade.js ' + referralUid);
}

seedTestPair();
