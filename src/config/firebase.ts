/**
 * Firebase Configuration and Service Initialization
 * 
 * Initializes Firebase services: Auth, Firestore, Storage, Analytics
 * Includes offline persistence for Firestore
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { 
  getAnalytics, 
  type Analytics, 
  isSupported,
  setUserId,
  setUserProperties,
  logEvent
} from 'firebase/analytics';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is configured
const isConfigured = Object.values(firebaseConfig).every(value => value && value !== 'undefined');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;
let appCheck: AppCheck | null = null;

/**
 * Initialize Firebase services
 * Only initializes if environment variables are properly configured
 */
export function initializeFirebase(): void {
  if (!isConfigured) {
    console.warn('⚠️ Firebase not configured. Running in offline-only mode.');
    console.log('To enable cloud sync, copy .env.example to .env.local and add your Firebase credentials.');
    return;
  }

  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');

    // Initialize Auth
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');

    // Initialize Firestore with offline persistence
    db = getFirestore(app);
    
    // Enable offline persistence (Google's best practice)
    enableIndexedDbPersistence(db, {
      forceOwnership: false, // Allow multiple tabs
    }).then(() => {
      console.log('✅ Firestore offline persistence enabled');
    }).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Multiple tabs open, persistence enabled in first tab only');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Browser does not support offline persistence');
      } else {
        console.error('❌ Failed to enable offline persistence:', err);
      }
    });

    // Initialize Storage
    storage = getStorage(app);
    console.log('✅ Firebase Storage initialized');

    // Initialize Analytics (only in production and if supported)
    const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || import.meta.env.PROD;
    if (analyticsEnabled) {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
          console.log('✅ Firebase Analytics initialized');
          
          // ===== NEW CODE: Track user ID for retention analytics =====
          if (auth) {
            onAuthStateChanged(auth, (user) => {
              if (user && analytics) {
                // User is signed in - set user ID for analytics
                setUserId(analytics, user.uid);
                
                // Set user properties for better segmentation
                setUserProperties(analytics, {
                  account_created: user.metadata.creationTime || new Date().toISOString(),
                  sign_in_method: user.providerData[0]?.providerId || 'password',
                  user_type: 'authenticated'
                });
                
                // Log engagement event
                logEvent(analytics, 'user_engagement', {
                  engagement_time_msec: 100
                });
                
                console.log('✅ Analytics: User ID set for retention tracking:', user.uid);
              } else if (analytics) {
                // User is signed out - clear user ID
                setUserId(analytics, null);
                console.log('📊 Analytics: User signed out, ID cleared');
              }
            });
          }
          // ===== END NEW CODE =====
        }
      });
    }

    // Initialize App Check (Security Fix)
    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (recaptchaKey && app) {
      // Allow debug token for development
      if (import.meta.env.DEV) {
        // @ts-expect-error - FIREBASE_APPCHECK_DEBUG_TOKEN is not on window/self types
        self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        console.log('🔧 App Check: Debug mode enabled for development');
      }

      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaKey),
        isTokenAutoRefreshEnabled: true
      });
      console.log('✅ Firebase App Check initialized');
    }

  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
}

/**
 * Get Firebase Auth instance
 * Returns null if not initialized
 */
export function getAuthInstance(): Auth | null {
  return auth;
}

/**
 * Get Firestore instance
 * Returns null if not initialized
 */
export function getFirestoreInstance(): Firestore | null {
  return db;
}

/**
 * Get Storage instance
 * Returns null if not initialized
 */
export function getStorageInstance(): FirebaseStorage | null {
  return storage;
}

/**
 * Get Analytics instance
 * Returns null if not initialized or not supported
 */
export function getAnalyticsInstance(): Analytics | null {
  return analytics;
}

/**
 * Get App Check instance
 * Returns null if not initialized
 */
export function getAppCheckInstance(): AppCheck | null {
  return appCheck;
}

/**
 * Check if Firebase is configured and initialized
 */
export function isFirebaseAvailable(): boolean {
  return app !== null;
}

/**
 * Development helper: log configuration status
 */
export function logFirebaseStatus(): void {
  console.group('🔥 Firebase Status');
  console.log('Configured:', isConfigured);
  console.log('App initialized:', app !== null);
  console.log('Auth available:', auth !== null);
  console.log('Firestore available:', db !== null);
  console.log('Storage available:', storage !== null);
  console.log('Analytics available:', analytics !== null);
  console.groupEnd();
}
