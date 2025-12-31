import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, 'service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ service-account.json not found in scripts directory.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const initialFeatures = [
  {
    title: "AI Pattern Scaler",
    description: "Automatically adjust stitch counts for different sizes (S to 3XL) with one click.",
    votes: 0
  },
  {
    title: "Voice-Controlled Instructions",
    description: "Navigate through pattern steps and toggle row counters purely by voice.",
    votes: 0
  },
  {
    title: "Social Project Sharing",
    description: "Share your WIP photos and counter progress directly to a community feed.",
    votes: 0
  },
  {
    title: "PDF Pattern Import",
    description: "Upload your existing PDF patterns and have them parsed into interactive steps.",
    votes: 0
  }
];

async function seedRoadmap() {
  console.log("🚀 Seeding roadmap collection...");
  const roadmapRef = db.collection("roadmap");
  
  // Check if already seeded to avoid duplicates
  const snapshot = await roadmapRef.get();
  if (!snapshot.empty) {
    console.log("⚠️ Roadmap collection already has data. Skipping seed.");
    return;
  }

  for (const feature of initialFeatures) {
    await roadmapRef.add(feature);
    console.log(`✅ Added: ${feature.title}`);
  }
  
  console.log("🎉 Seeding complete!");
}

seedRoadmap()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
