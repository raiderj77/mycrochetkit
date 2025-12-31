/**
 * Set Admin Claim Script
 * 
 * One-time script to set admin custom claim on a user
 * 
 * Usage:
 *   1. Run: gcloud auth application-default login
 *   2. Run: node scripts/setAdmin.js <USER_UID>
 *   3. User must log out and log back in to refresh token
 */

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

async function run() {
  const uid = process.argv[2];
  
  if (!uid) {
    console.error("❌ Error: Please provide a user UID");
    console.log("");
    console.log("Usage: node scripts/setAdmin.js <USER_UID>");
    console.log("");
    console.log("To find your UID:");
    console.log("  1. Go to Firebase Console → Authentication → Users");
    console.log("  2. Find your account and copy the User UID");
    process.exit(1);
  }

  try {
    // Get current user to verify they exist
    const user = await admin.auth().getUser(uid);
    console.log(`Found user: ${user.email || user.uid}`);
    
    // Set admin claim
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    console.log("");
    console.log("✅ Successfully set admin claim on:", uid);
    console.log("");
    console.log("⚠️  IMPORTANT: User must log out and log back in to refresh their token");
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

run();
