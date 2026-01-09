import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// HARDCODED CONFIG - PROVING IT WORKS
const firebaseConfig = {
  apiKey: "AIzaSyA3pdixOcnqbs7HECuUnCcb1tITIfHSE94",
  authDomain: "my-crochetkit.firebaseapp.com",
  projectId: "my-crochetkit",
  storageBucket: "my-crochetkit.firebasestorage.app",
  messagingSenderId: "646754548026",
  appId: "1:646754548026:web:1aba50399e980570d73803",
  measurementId: "G-23B576BHEZ"
};

console.log("🔥 Firebase Lib: Initializing with Hardcoded Keys (v1.0.1)");

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Analytics
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined' && app) {
  isSupported().then(yes => {
    if (yes) analyticsInstance = getAnalytics(app);
  });
}
export const analytics = analyticsInstance;
