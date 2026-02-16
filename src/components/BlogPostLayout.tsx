import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from './ShareButtons';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPostLayoutProps {
  title: string;
  description: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  keywords: string[];
  breadcrumbTitle: string;
  faqs: FAQItem[];
  toolUrl: string;
  toolName: string;
  children: React.ReactNode;
}

export const BlogPostLayout = ({
  title,
  description,
  slug,
  date,
  readTime,
  category,
  keywords,
  breadcrumbTitle,
  faqs,
  toolUrl,
  toolName,
  children,
}: BlogPostLayoutProps) => {
  const canonicalUrl = `https://mycrochetkit.com/blog/${slug}`;

  const faqSchema = faqs.length > 0 ? {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : undefined;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        author: {
          '@type': 'Person',
          name: 'Jason',
          description: 'Crocheter and developer. Founder of MyCrochetKit.',
          url: 'https://mycrochetkit.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'MyCrochetKit',
          url: 'https://mycrochetkit.com',
        },
        datePublished: date,
        dateModified: date,
        mainEntityOfPage: canonicalUrl,
        articleSection: category,
        keywords,
      },
      ...(faqSchema ? [faqSchema] : []),
    ],
  };

  return (
    <>
      <SEOHead
        title={`${title} | MyCrochetKit`}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={articleSchema}
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-3xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">MyCrochetKit</span>
            </Link>
            <Link
              to="/blog"
              className="text-[#E86A58] font-medium flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Blog
            </Link>
          </div>
        </header>

        <nav className="max-w-3xl mx-auto px-6 pt-6 text-sm text-[#2C1810]/70" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#E86A58]">Home</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link to="/blog" className="hover:text-[#E86A58]">Blog</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-[#2C1810]/70">{breadcrumbTitle}</span>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-[#E86A58]/10 text-[#E86A58] text-sm font-medium rounded-full mb-4">
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4 leading-tight">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C1810]/60 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>
            <ShareButtons url={canonicalUrl} title={title} />
          </div>

          <div className="prose-custom text-[#2C1810]/85 text-lg leading-relaxed space-y-6">
            {children}
          </div>

          {/* CTA Box */}
          <div className="my-12 p-8 bg-gradient-to-br from-[#E86A58]/10 to-[#B8A9C9]/10 rounded-2xl border border-[#E86A58]/20 text-center">
            <p className="text-2xl font-bold text-[#2C1810] mb-2">Try the {toolName}</p>
            <p className="text-[#2C1810]/70 mb-6">Free, instant, no signup required.</p>
            <a
              href={toolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-semibold rounded-xl transition-colors"
            >
              Open {toolName} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className="my-12">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-[#2C1810]/5">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-2">{faq.question}</h3>
                    <p className="text-[#2C1810]/75">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-[#2C1810]/10 text-center">
            <Link
              to="/blog"
              className="text-[#E86A58] font-semibold hover:underline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </article>
      </div>
    </>
  );
};
