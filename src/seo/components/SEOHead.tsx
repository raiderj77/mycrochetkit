import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOHead Component
 *
 * Manages all meta tags, Open Graph, Twitter Cards, and Schema.org structured data.
 * Uses react-helmet-async for dynamic head management in React apps.
 *
 * Usage:
 * ```tsx
 * import { SEOHead } from '@/seo/components/SEOHead';
 * import { organizationSchema } from '@/seo/schemas/organization';
 *
 * function HomePage() {
 *   return (
 *     <>
 *       <SEOHead
 *         title="MyCrochetKit - Voice Row Counter"
 *         description="Free voice-activated row counter for crochet"
 *         schema={organizationSchema}
 *       />
 *       <main>{/* Your content *\/}</main>
 *     </>
 *   );
 * }
 * ```
 */

interface SEOHeadProps {
  /** Page title - will appear in browser tab and search results */
  title?: string;

  /** Meta description - appears in search results snippets (155-160 chars ideal) */
  description?: string;

  /** Canonical URL - helps prevent duplicate content issues */
  canonicalUrl?: string;

  /** Open Graph image URL - for social media shares (1200x630px recommended) */
  ogImage?: string;

  /** Open Graph type - 'website' for pages, 'article' for blog posts */
  ogType?: 'website' | 'article';

  /** Schema.org structured data - can be single schema or array */
  schema?: object | object[];

  /** Set to true to prevent indexing (for admin pages, etc.) */
  noindex?: boolean;

  /** Additional keywords for this page (optional - Google mostly ignores these) */
  keywords?: string[];

  /** Article-specific metadata */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

/**
 * Default meta values - used when props not provided
 */
const defaults = {
  title: 'MyCrochetKit - Voice-Activated Row Counter & Crochet Companion',
  description:
    "Free crochet app with voice-activated row counter, pattern library, and project tracker. Modern Ravelry alternative for today's crocheters. Works offline!",
  canonicalUrl: 'https://mycrochetkit.com',
  ogImage: 'https://mycrochetkit.com/og-image.jpg',
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = defaults.title,
  description = defaults.description,
  canonicalUrl = defaults.canonicalUrl,
  ogImage = defaults.ogImage,
  ogType = 'website',
  schema,
  noindex = false,
  keywords = [],
  article,
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Keywords (optional - mostly for historical reasons) */}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Robots directives */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MyCrochetKit" />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific Open Graph */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags &&
            article.tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* PWA Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MyCrochetKit" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
        </script>
      )}
    </Helmet>
  );
};

/**
 * Alternative: Pre-configured SEO components for common page types
 *
 * These can save time for standard pages where you only need
 * to pass minimal props.
 */

export const HomePageSEO: React.FC<{ schema?: object | object[] }> = ({ schema }) => (
  <SEOHead
    title="MyCrochetKit - Voice-Activated Crochet Row Counter | Free App"
    description="Stop losing count! Free voice-activated row counter for crochet. Works offline, no subscription. Modern alternative to Ravelry for active projects."
    canonicalUrl="https://mycrochetkit.com"
    ogImage="https://mycrochetkit.com/og-home.jpg"
    keywords={[
      'crochet app',
      'voice row counter',
      'voice activated crochet',
      'crochet tracker',
      'ravelry alternative',
      'free crochet app',
      'crochet counter',
      'hands-free crochet',
    ]}
    schema={schema}
  />
);

export const FAQPageSEO: React.FC<{ schema?: object }> = ({ schema }) => (
  <SEOHead
    title="FAQ - MyCrochetKit Help & Common Questions"
    description="Common questions about MyCrochetKit's voice-activated row counter, features, and how it compares to Ravelry. Get answers about offline mode, pricing, and more."
    canonicalUrl="https://mycrochetkit.com/faq"
    ogImage="https://mycrochetkit.com/og-faq.jpg"
    schema={schema}
  />
);
