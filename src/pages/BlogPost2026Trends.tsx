import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export const BlogPost2026Trends = () => {
  return (
    <>
      <SEOHead
        title="Top Crochet Trends 2026: What's Hot in the Crochet Community | MyCrochetKit"
        description="Discover the hottest crochet trends of 2026: granny square revival, wearable art, sustainable yarn choices, and viral TikTok patterns. Plus what crocheters are actually making right now."
        canonicalUrl="https://mycrochetkit.com/blog/crochet-trends-2026"
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

        <article className="max-w-4xl mx-auto px-6 py-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[#E86A58] hover:text-[#D35A4A] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4 text-sm text-[#2C1810]/60 mb-6">
            <time dateTime="2026-02-01">February 1, 2026</time>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Trending
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
            Top Crochet Trends 2026: What's Hot in the Crochet Community
          </h1>

          <p className="text-xl text-[#2C1810]/70 mb-12 leading-relaxed">
            From granny square glow-ups to sustainable yarn choices, here's what crocheters are
            actually making (and loving) in 2026.
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#2C1810] mb-4">
                1. The Granny Square Renaissance
              </h2>
              <p className="text-[#2C1810]/70 mb-4">
                Granny squares are having their biggest moment since the 1970s. But 2026's granny
                squares aren't your grandmother's granny squares—they're bolder, bigger, and more
                experimental than ever.
              </p>
              <p className="text-[#2C1810]/70 mb-4">
                <strong>What's trending:</strong> Giant granny square blankets, granny square
                wearables, modern color combos, and mixed motif designs combining granny squares
                with other patterns for unique textures.
              </p>
              <p className="text-[#2C1810]/70">
                <em>Why it's popular:</em> Granny squares are beginner-friendly, portable, and offer
                instant gratification. Each square is a mini-project that comes together into
                something bigger.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#2C1810] mb-4">
                2. Wearable Art: Crochet Fashion Goes Mainstream
              </h2>
              <p className="text-[#2C1810]/70 mb-4">
                Crochet clothing has moved from "festival wear" to "everyday fashion." High-fashion
                runways featured crochet in 2025, and the trend exploded into mainstream retailers
                and indie makers in 2026.
              </p>
              <p className="text-[#2C1810]/70 mb-4">
                <strong>Hot wearable trends:</strong> Oversized cardigans, crochet crop tops, market
                bags and totes, bucket hats, and sweater vests bringing preppy-meets-handmade
                aesthetics.
              </p>
              <p className="text-[#2C1810]/70">
                <em>Why it matters:</em> Crochet fashion is visible. When someone wears a handmade
                crochet piece, it starts conversations and inspires others to learn the craft.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#2C1810] mb-4">
                3. Sustainable Yarn Choices Take Center Stage
              </h2>
              <p className="text-[#2C1810]/70 mb-4">
                Crocheters are increasingly conscious about yarn choices, driving demand for
                eco-friendly and ethically-sourced materials.
              </p>
              <p className="text-[#2C1810]/70 mb-4">
                <strong>Trending sustainable options:</strong> Recycled cotton from textile waste,
                bamboo yarn that's silky and antibacterial, hemp blends for durability,
                locally-sourced wool supporting local farms, and "scrap-ghan" blankets using
                leftover yarn.
              </p>
              <p className="text-[#2C1810]/70">
                <em>The shift:</em> More crocheters are asking "where did this yarn come from?"
                before purchasing. Transparency in yarn production is becoming a selling point.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-[#2C1810] mb-4">
                4. Digital Tools Transform the Crochet Experience
              </h2>
              <p className="text-[#2C1810]/70 mb-4">
                Technology is finally catching up to crocheters' needs, with apps and tools designed
                specifically for the craft.
              </p>
              <p className="text-[#2C1810]/70 mb-4">
                <strong>Tech tools crocheters love:</strong> Voice-activated row counters for
                hands-free tracking (like MyCrochetKit!), pattern annotation apps, yarn weight
                calculators, project management tools for tracking multiple WIPs, and AR tools to
                visualize colors.
              </p>
              <p className="text-[#2C1810]/70">
                <em>Game changer:</em> Voice-activated counting means you never have to stop mid-row
                to tap your phone with yarn-covered hands. Technology that actually understands the
                craft makes a huge difference.
              </p>
            </section>

            <section className="mb-12 bg-[#E86A58]/10 rounded-3xl p-8 border border-[#E86A58]/20">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#E86A58]" />
                Track Your Trendy Projects with MyCrochetKit
              </h2>
              <p className="text-[#2C1810]/70 mb-4">
                Whether you're making granny square cardigans or sustainable yarn projects,
                MyCrochetKit helps you track every project with voice-activated row counting and
                hands-free workflow.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] text-white rounded-2xl font-semibold hover:bg-[#D35A4A] transition-colors"
              >
                Try Free <Heart className="w-4 h-4" />
              </Link>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-[#2C1810] mb-4">The Bottom Line</h2>
              <p className="text-[#2C1810]/70 mb-4">
                2026's crochet trends reflect a community that's more creative, conscious, and
                connected than ever. From sustainable yarn choices to high-fashion wearables,
                crocheters are pushing boundaries while honoring traditional techniques.
              </p>
              <p className="text-[#2C1810]/70">
                The most important trend? Crocheters supporting crocheters. Whether you're sharing
                patterns, teaching techniques, or simply cheering each other on, the crochet
                community continues to be one of the most welcoming creative spaces online.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-12 border-t border-[#2C1810]/10">
            <ShareButtons
              url="/blog/crochet-trends-2026"
              title="Top Crochet Trends 2026: What's Hot in the Crochet Community"
              description="From granny square revivals to sustainable yarn, discover what crocheters are making in 2026."
            />
          </div>
        </article>
      </div>
    </>
  );
};
