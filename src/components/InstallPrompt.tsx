/**
 * Install Prompt Component
 * 
 * Prompts users to install the PWA to their home screen
 */

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Check if already dismissed in this session OR permanently
    const dismissedSession = sessionStorage.getItem('pwa-install-dismissed-session');
    const dismissedPermanent = localStorage.getItem('pwa-install-dismissed');
    if (dismissedSession || dismissedPermanent) return;
    
    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds or on second visit
      const visitCount = parseInt(localStorage.getItem('visit-count') || '0');
      localStorage.setItem('visit-count', String(visitCount + 1));
      
      if (visitCount >= 1) {
        setTimeout(() => setShowPrompt(true), 30000); // 30 seconds
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted install prompt');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-install-dismissed-session', 'true');
    localStorage.setItem('pwa-install-dismissed', 'true'); // Still keep local storage for long term
  };
  
  if (!showPrompt || !deferredPrompt) return null;
  
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-96">
      <div className="card relative border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-primary-100 dark:hover:bg-primary-800"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3 pr-8">
          <div className="rounded-full bg-primary-600 p-2 text-white">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary-900 dark:text-primary-100">
              Install My Crochet Kit
            </h3>
            <p className="mt-1 text-sm text-primary-800 dark:text-primary-200">
              Add to your home screen for quick access and offline use!
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstall}
                className="btn-primary text-sm"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="btn-outline text-sm"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
