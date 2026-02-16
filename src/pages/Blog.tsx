import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

export const Blog = () => {
  const posts = [
    {
      slug: 'how-much-yarn-do-i-need',
      title: 'How Much Yarn Do I Need? The Complete Yardage Guide',
      excerpt: 'Calculate exactly how much yarn you need for any project. Yardage charts for blankets, scarves, sweaters, hats, and amigurumi by yarn weight.',
      date: '2026-02-14',
      readTime: '10 min read',
      category: 'Crochet Guides',
    },
    {
      slug: 'crochet-blanket-size-chart',
      title: 'Crochet Blanket Size Chart: Dimensions and Starting Chains',
      excerpt: 'Every standard blanket size from baby to king with starting chain counts, row estimates, and yarn requirements by weight.',
      date: '2026-02-14',
      readTime: '9 min read',
      category: 'Crochet Guides',
    },
    {
      slug: 'crochet-gauge-calculator-guide',
      title: 'Crochet Gauge Calculator: Measure Your Swatch Right',
      excerpt: 'Why gauge matters, how to make a proper swatch, and what to do when your numbers do not match the pattern.',
      date: '2026-02-14',
      readTime: '8 min read',
      category: 'Crochet Techniques',
    },
    {
      slug: 'crochet-hook-size-conversion-chart',
      title: 'Crochet Hook Size Conversion: US, UK, Metric, Japanese',
      excerpt: 'Convert hook sizes between all four major systems. Includes steel hooks, recommended yarn pairings, and common size confusion fixes.',
      date: '2026-02-14',
      readTime: '7 min read',
      category: 'Crochet Reference',
    },
    {
      slug: 'yarn-weight-chart-guide',
      title: 'Yarn Weight Chart: Thickness, Substitution, and WPI Guide',
      excerpt: 'Understand yarn weight categories from lace to jumbo. CYC numbering, wraps per inch method, and how to substitute yarns safely.',
      date: '2026-02-14',
      readTime: '9 min read',
      category: 'Crochet Reference',
    },
    {
      slug: 'crochet-abbreviations-glossary',
      title: 'Crochet Abbreviations: Every US and UK Term Decoded',
      excerpt: 'Complete glossary of crochet abbreviations with US and UK conversions. Never mix up dc and tr again.',
      date: '2026-02-14',
      readTime: '8 min read',
      category: 'Crochet Reference',
    },
    {
      slug: 'free-crochet-stitch-counter',
      title: 'Free Crochet Stitch Counter: Digital vs Physical Compared',
      excerpt: 'Compare row counter options from clickers to voice-activated apps. Find the best hands-free counting method for your workflow.',
      date: '2026-02-13',
      readTime: '7 min read',
      category: 'Crochet Tools',
    },
    {
      slug: 'crochet-project-cost-calculator',
      title: 'How Much to Charge for Crochet: The True Cost Calculator',
      excerpt: 'The real cost of handmade crochet items including materials, labor, and overhead. Pricing formula for selling at craft fairs and online.',
      date: '2026-02-13',
      readTime: '8 min read',
      category: 'Crochet Business',
    },
    {
      slug: 'crochet-increase-decrease-calculator',
      title: 'How to Evenly Space Increases and Decreases in Crochet',
      excerpt: 'The math behind evenly spaced increases and decreases. Formula, examples, and a free calculator for shaping hats and amigurumi.',
      date: '2026-02-13',
      readTime: '7 min read',
      category: 'Crochet Techniques',
    },
    {
      slug: 'crochet-stripe-pattern-generator',
      title: 'Crochet Stripe Pattern Generator: Random and Temperature',
      excerpt: 'Generate stripe patterns for blankets. Random, weighted, gradient, and temperature blanket color mapping tools.',
      date: '2026-02-13',
      readTime: '7 min read',
      category: 'Crochet Design',
    },
    {
      slug: 'planned-pooling-crochet-guide',
      title: 'How Planned Pooling Works: Color Pooling Calculator Guide',
      excerpt: 'Learn the math and technique behind planned color pooling in crochet for argyle and plaid effects with variegated yarn.',
      date: '2026-02-12',
      readTime: '6 min read',
      category: 'Crochet Techniques',
    },
    {
      slug: 'spinning-wheel-ratio-calculator',
      title: 'Spinning Wheel Ratio Calculator: Drive Ratios and TPI',
      excerpt: 'Calculate spinning wheel drive ratios, twists per inch, and plying ratios for handspinners.',
      date: '2026-02-12',
      readTime: '6 min read',
      category: 'Fiber Arts',
    },
    {
      slug: 'cross-stitch-fabric-calculator',
      title: 'Cross Stitch Fabric Calculator: Size Your Design for Any Count',
      excerpt: 'Calculate cross stitch dimensions across fabric counts. Convert between Aida, evenweave, and linen.',
      date: '2026-02-12',
      readTime: '6 min read',
      category: 'Cross Stitch',
    },
    {
      slug: 'weaving-sett-calculator-guide',
      title: 'Weaving Sett Calculator: WPI to EPI Conversion Guide',
      excerpt: 'Calculate optimal sett for weaving projects. Convert wraps per inch to ends per inch for balanced weaves.',
      date: '2026-02-12',
      readTime: '6 min read',
      category: 'Weaving',
    },
    {
      slug: 'embroidery-thread-conversion-chart',
      title: 'DMC to Anchor Thread Conversion Chart',
      excerpt: 'Convert embroidery thread colors between DMC, Anchor, Cosmo, and Sulky brands instantly.',
      date: '2026-02-12',
      readTime: '6 min read',
      category: 'Embroidery',
    },
    {
      slug: 'free-voice-activated-row-counter-crochet',
      title: 'Free Voice-Activated Row Counter for Crochet (No App Download)',
      excerpt:
        'Count crochet rows with your voice — say "next" to count. Free, works offline, no download required. Keep your hands on your hook.',
      date: '2026-02-11',
      readTime: '5 min read',
      category: 'Tools',
    },
    {
      slug: 'why-i-left-ravelry',
      title: 'Why I Left Ravelry (And What I Use Now)',
      excerpt:
        'After 8 years on Ravelry, I finally made the switch. Here\'s what pushed me away, what I miss, and the tools I use instead.',
      date: '2026-02-11',
      readTime: '6 min read',
      category: 'Personal Story',
    },
    {
      slug: 'best-crochet-apps-offline',
      title: 'Best Crochet Apps That Work Offline in 2026 (Tested)',
      excerpt:
        'Looking for crochet apps that work without internet? We tested 7 popular apps at yarn stores and craft circles.',
      date: '2026-02-11',
      readTime: '8 min read',
      category: 'App Reviews',
    },
    {
      slug: 'c2c-crochet-patterns-complete-guide',
      title: 'C2C Crochet Patterns: The Complete Corner-to-Corner Guide',
      excerpt:
        'Learn corner-to-corner crochet from scratch. How C2C works, reading color graphs, managing yarn, and using a free pattern generator.',
      date: '2026-02-07',
      readTime: '10 min read',
      category: 'Crochet Techniques',
    },
    {
      slug: 'real-cost-handmade-crochet-blanket',
      title: 'The Real Cost of a Handmade Crochet Blanket (The Math Will Hurt)',
      excerpt:
        'Someone asked me to make them a blanket. I did the math. Here is why most of us only crochet for people we actually love.',
      date: '2026-02-05',
      readTime: '5 min read',
      category: 'Crochet Life',
    },
    {
      slug: 'how-to-never-lose-row-count-crochet',
      title: 'How to Never Lose Your Row Count Again (5 Methods Compared)',
      excerpt:
        'Compare 5 row tracking methods — from tally marks to voice-activated apps — and find what actually works for your crochet workflow.',
      date: '2026-02-03',
      readTime: '7 min read',
      category: 'Crochet Tips',
    },
    {
      slug: 'crochet-trends-2026',
      title: "Crochet Trends 2026: What I'm Actually Seeing (and Making)",
      excerpt:
        "From the granny square evolution to crochet on high-fashion runways, here's what's actually trending in crochet right now.",
      date: '2026-02-01',
      readTime: '8 min read',
      category: 'Crochet Trends',
    },
  ];

  return (
    <>
      <SEOHead
        title="Crochet Blog: Patterns, Tips, Trends & Tutorials | MyCrochetKit"
        description="Explore crochet patterns, techniques, trending projects, and expert tips. From beginner tutorials to advanced colorwork, your complete crochet resource."
        canonicalUrl="https://mycrochetkit.com/blog"
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">MyCrochetKit</span>
            </Link>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">Crochet Blog</h1>
            <p className="text-xl text-[#2C1810]/70">
              Patterns, tips, trends, and inspiration for crocheters of all skill levels
            </p>
          </div>
        </section>

        <section className="px-6 py-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={'/blog/' + post.slug}
                className="group bg-white rounded-3xl p-8 shadow-sm border border-[#2C1810]/5 hover:shadow-md hover:border-[#E86A58]/20 transition-all"
              >
                <div className="flex items-center gap-2 text-sm text-[#E86A58] mb-3">
                  <span className="px-3 py-1 bg-[#E86A58]/10 rounded-full font-medium">
                    {post.category}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#2C1810] mb-3 group-hover:text-[#E86A58] transition-colors">
                  {post.title}
                </h2>

                <p className="text-[#2C1810]/70 mb-4 leading-relaxed">{post.excerpt}</p>

                <div className="flex items-center gap-4 text-sm text-[#2C1810]/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <div className="mt-4 text-[#E86A58] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
