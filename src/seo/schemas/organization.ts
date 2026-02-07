import type { WithContext, Organization } from 'schema-dts';

/**
 * MyCrochetKit Organization Schema
 *
 * This schema defines MyCrochetKit as an organization for search engines.
 * It helps Google and other search engines understand who we are and
 * display rich results like knowledge panels.
 *
 * Usage: Import and inject into HomePage via SEOHead component
 */

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MyCrochetKit',
  alternateName: 'My Crochet Kit',
  url: 'https://mycrochetkit.com',

  logo: {
    '@type': 'ImageObject',
    url: 'https://mycrochetkit.com/logo-512.png',
    width: '512',
    height: '512',
  },

  description:
    'Free voice-activated crochet row counter and project tracking app. Modern alternative to Ravelry built for mobile crocheters.',

  foundingDate: '2024',

  founder: {
    '@type': 'Person',
    name: 'Jason Ramirez',
    jobTitle: 'Founder & Developer',
    sameAs: ['https://github.com/raiderj77'],
  },

  sameAs: [
    'https://www.reddit.com/user/MyCrochetKit',
    'https://www.instagram.com/mycrochetkit',
    'https://www.pinterest.com/mycrochetkit',
  ],

  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@mycrochetkit.com',
    availableLanguage: 'English',
  },

  knowsAbout: [
    'Crochet',
    'Progressive Web Apps',
    'Voice-Activated Applications',
    'Fiber Arts',
    'Crafting Tools',
  ],
};
