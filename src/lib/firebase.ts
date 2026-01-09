import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA3pdixOcnqbs7HECuUnCcb1tITIfHSE94",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-crochetkit.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-crochetkit",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-crochetkit.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "646754548026",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:646754548026:web:1aba50399e980570d73803",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-23B576BHEZ"
};

// Safety check: Don't initialize if API key is missing
const isConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here';

if (!isConfigured && typeof window !== 'undefined') {
  console.warn('⚠️ Firebase API Key is missing. Check your .env file.');
}

export const app = isConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

// Export instances or nulls if not configured
export const auth = app ? getAuth(app) : (null as any);
export const db = app ? getFirestore(app) : (null as any);

// Google Analytics - only initialize in browser and if app exists
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined' && app) {
  isSupported().then(yes => {
    if (yes) analyticsInstance = getAnalytics(app);
  });
}
export const analytics = analyticsInstance;
