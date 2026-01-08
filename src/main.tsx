/**
 * Main Application Entry Point
 * 
 * Initializes Firebase, IndexedDB, and renders React app with providers
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeFirebase, logFirebaseStatus } from './config/firebase';
import { initializeDatabase } from './db/schema';

// Import styles
import './styles/accessibility.css';
import './styles/content-protection.css';
import './index.css';

// Initialize services
async function initializeApp() {
  try {
    // Initialize Firebase (gracefully degrades if not configured)
    initializeFirebase();
    
    // Initialize IndexedDB (required - local-first)
    await initializeDatabase();

    // Verify critical environment variables
    ["VITE_STRIPE_PRICE_MONTHLY", "VITE_STRIPE_PRICE_YEARLY", "VITE_STRIPE_PRICE_LIFETIME"]
      .forEach((k) => { 
        if (!import.meta.env[k]) console.warn(`Missing env: ${k}`); 
      });
    
    // Log Firebase status in development
    if (import.meta.env.DEV) {
      logFirebaseStatus();
    }
    
    console.log('✅ CrochetFlow initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    // App can still work in offline-only mode even if initialization fails
  }
}

import { HelmetProvider } from 'react-helmet-async';
import { AnalyticsWrapper } from './components/AnalyticsWrapper';

// Initialize and render
initializeApp().then(() => {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <HelmetProvider>
        <AnalyticsWrapper>
          <App />
        </AnalyticsWrapper>
      </HelmetProvider>
    </React.StrictMode>
  );
});

// Register service worker for PWA using vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log('✅ App is ready to work offline');
    },
  });
}
