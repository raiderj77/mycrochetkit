import React, { useEffect } from 'react';
import { getAnalyticsInstance } from '../config/firebase';
import { logEvent } from 'firebase/analytics';

interface AnalyticsWrapperProps {
  children: React.ReactNode;
}

/**
 * Component to track app lifecycle events (app_open, session_start, session_end)
 */
export const AnalyticsWrapper: React.FC<AnalyticsWrapperProps> = ({ children }) => {
  useEffect(() => {
    const analytics = getAnalyticsInstance();
    if (analytics) {
      // Track app open
      logEvent(analytics, 'app_open');
      
      // Track session start
      logEvent(analytics, 'session_start');
      
      console.log('✅ Analytics: App opened and session started');
      
      // Track when user leaves (for session tracking)
      const handleBeforeUnload = () => {
        logEvent(analytics, 'session_end');
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);

  return <>{children}</>;
};
