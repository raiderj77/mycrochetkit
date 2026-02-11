import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-23B576BHEZ';

export const initGA = () => {
  // Only initialize GA in production, and handle Firebase subdomain
  if (typeof window === 'undefined') return;
  
  const isFirebaseSubdomain = window.location.hostname.endsWith('.web.app');
  
  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: {
      anonymizeIp: true,
      // Allow cookies on Firebase subdomain
      cookieDomain: isFirebaseSubdomain ? window.location.hostname : 'auto',
      cookieFlags: 'SameSite=None;Secure',
    },
  });
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

// Key events we want to track
export const events = {
  // User events
  signUp: () => trackEvent('User', 'Sign Up', 'Google Auth'),
  signOut: () => trackEvent('User', 'Sign Out'),

  // Project events
  createProject: () => trackEvent('Project', 'Create Project'),
  deleteProject: () => trackEvent('Project', 'Delete Project'),

  // Counter events
  voiceCounterStart: () => trackEvent('Counter', 'Voice Counter Start'),
  voiceCounterNext: () => trackEvent('Counter', 'Voice Command - Next'),
  voiceCounterBack: () => trackEvent('Counter', 'Voice Command - Back'),

  // Navigation
  visitRoadmap: () => trackEvent('Navigation', 'Visit Roadmap'),
  visitCommunity: () => trackEvent('Navigation', 'Visit Community', 'Reddit'),
};
