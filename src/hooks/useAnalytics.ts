import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { getAnalyticsInstance } from '../config/firebase';

/**
 * Hook to track page views automatically on route change
 * @param pageTitle Optional custom page title
 */
export function usePageTracking(pageTitle?: string) {
  const location = useLocation();

  useEffect(() => {
    const analytics = getAnalyticsInstance();
    if (!analytics) return;

    const title = pageTitle || document.title;
    
    logEvent(analytics, 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: location.pathname
    });
    
    // Also log user engagement for retention tracking
    logEvent(analytics, 'user_engagement', {
      engagement_time_msec: 1000 // Initial engagement bump
    });
  }, [location, pageTitle]);
}

/**
 * Utility function to log custom events from anywhere
 * @param eventName Name of the event
 * @param params Optional event parameters
 */
export function logTrackEvent(eventName: string, params?: Record<string, unknown>) {
  const analytics = getAnalyticsInstance();
  if (!analytics) {
    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics Debug] ${eventName}`, params);
    }
    return;
  }

  logEvent(analytics, eventName, params);
}

/**
 * Hook for component-level event tracking
 */
export function useEventTracking() {
  return {
    trackEvent: logTrackEvent
  };
}
