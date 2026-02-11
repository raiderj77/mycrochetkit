import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-23B576BHEZ';

export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // Fix for Firebase hosting subdomain cookie issues
  const isFirebase = window.location.hostname.endsWith('.web.app') || 
                     window.location.hostname.endsWith('.firebaseapp.com');
  
  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: {
      anonymizeIp: true,
      cookieDomain: isFirebase ? 'auto' : window.location.hostname,
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
  
  // New tool events
  useStitchGlossary: () => trackEvent('Tools', 'Stitch Glossary', 'View'),
  useYarnCalculator: () => trackEvent('Tools', 'Yarn Calculator', 'Calculate'),
  useHookConverter: () => trackEvent('Tools', 'Hook Converter', 'Convert'),
  
  // Blog engagement
  readBlogPost: (title: string) => trackEvent('Blog', 'Read Post', title),
  
  // Referral tracking
  referralSignup: (code: string) => trackEvent('Referral', 'Signup', code),
};
