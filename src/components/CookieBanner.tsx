/**
 * Cookie Consent Banner
 * GDPR/CCPA/ePrivacy Compliant
 * 
 * - Accept all / Reject non-essential buttons
 * - Links to Cookie Policy
 * - Stores consent in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const CONSENT_KEY = 'mk_cookie_consent';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    const isPending = !stored || (stored !== 'accepted' && stored !== 'rejected');
    
    if (isPending) {
      // Show banner after a short delay to avoid flash
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShow(false);
    // Analytics would be enabled here
    console.log('[Analytics] Consent granted');
  }, []);

  const handleReject = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-sm md:flex md:items-center md:justify-between md:p-6">
        <div className="flex-1 pr-4">
          <h3 className="mb-2 font-semibold text-slate-100">
            🍪 Cookie Settings
          </h3>
          <p className="text-sm text-slate-400">
            We use essential cookies for authentication and site functionality. 
            Analytics cookies help us improve your experience.{' '}
            <Link 
              to="/cookies" 
              className="text-blue-400 underline hover:text-blue-300"
            >
              Cookie Policy
            </Link>
          </p>
        </div>
        
        <div className="mt-4 flex flex-shrink-0 gap-3 md:mt-0 md:ml-6">
          <button
            onClick={handleReject}
            className="rounded-xl border border-slate-600 bg-transparent px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
          >
            Reject non-essential
          </button>
          <button
            onClick={handleAccept}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Accept all
          </button>
        </div>

        <button
          onClick={handleReject}
          className="absolute right-3 top-3 rounded-full p-1 text-slate-500 hover:bg-slate-800 md:hidden"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
