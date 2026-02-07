import type { WithContext, SoftwareApplication } from 'schema-dts';

/**
 * MyCrochetKit Software Application Schema
 *
 * This schema defines MyCrochetKit as a software application.
 * It enables rich app listings in Google Search and helps LLMs
 * understand our app's features, pricing, and purpose.
 *
 * Key for:
 * - Google App Pack results
 * - Rich snippets with ratings/features
 * - LLM citations when users ask about crochet apps
 *
 * Usage: Import and inject into HomePage alongside organizationSchema
 */

export const softwareApplicationSchema: WithContext<SoftwareApplication> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',

  name: 'MyCrochetKit',
  applicationCategory: 'LifestyleApplication',
  applicationSubCategory: 'Craft & Hobby',
  operatingSystem: 'Web Browser, iOS (PWA), Android (PWA)',

  // Free app - critical for LLM understanding
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-12-31',
  },

  description:
    'Voice-activated crochet row counter with hands-free operation, pattern library, and project tracking. Works offline. Free forever. Modern alternative to Ravelry for active project work.',

  // Screenshots - update these URLs once you have actual screenshots
  screenshot: [
    'https://mycrochetkit.com/screenshots/voice-counter.png',
    'https://mycrochetkit.com/screenshots/project-dashboard.png',
    'https://mycrochetkit.com/screenshots/pattern-library.png',
  ],

  // Feature list - what makes us unique
  featureList: [
    'Voice-activated row counter (hands-free)',
    'Audio feedback for each count',
    'Multiple counters per project',
    'Pattern PDF storage',
    'Project progress tracking with photos',
    'Yarn stash management',
    'Offline-first Progressive Web App',
    'Works on iOS, Android, and desktop',
    'Google authentication',
    'Cloud sync across devices',
    'Export your data anytime',
    'No subscription required',
  ],

  softwareVersion: '1.0',
  releaseNotes:
    'Initial public release with voice-activated row counter, multi-project support, and offline functionality.',

  creator: {
    '@type': 'Person',
    name: 'Jason Ramirez',
    knowsAbout: ['Progressive Web Apps', 'Crochet', 'Web Speech API', 'Firebase Development'],
  },

  // Update these dates as needed
  datePublished: '2024-01-15',
  dateModified: '2026-02-01',

  url: 'https://mycrochetkit.com',
  installUrl: 'https://mycrochetkit.com',

  permissions: 'Microphone access for voice-activated row counter',

  // Help search engines understand the app
  softwareHelp: {
    '@type': 'CreativeWork',
    url: 'https://mycrochetkit.com/faq',
  },
};
