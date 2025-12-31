import { db } from '../src/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
  console.log("Seeding roadmap collection...");
  const roadmapRef = collection(db, "roadmap");
  
  for (const feature of initialFeatures) {
    await addDoc(roadmapRef, feature);
    console.log(`Added: ${feature.title}`);
  }
  
  console.log("Seeding complete!");
}

seedRoadmap().catch(console.error);
