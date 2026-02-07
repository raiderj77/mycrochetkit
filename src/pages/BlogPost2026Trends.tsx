import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Heart, Sparkles } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export const BlogPost2026Trends = () => {
  return (
    <>
      <SEOHead
        title="Crochet Trends 2026: What I'm Actually Seeing (and Making) | MyCrochetKit"
        description="From the granny square evolution to crochet on high-fashion runways, here's what's actually trending in crochet right now — based on what I'm seeing in the community, not a marketing team's guess."
        canonicalUrl="https://mycrochetkit.com/blog/crochet-trends-2026"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Crochet Trends 2026: What I\'m Actually Seeing (and Making)',
          description:
            'From the granny square evolution to crochet on high-fashion runways, here\'s what\'s actually trending in crochet right now.',
          author: {
            '@type': 'Person',
            name: 'Jason',
            description: 'Crocheter and developer. Founder of MyCrochetKit.',
            url: 'https://mycrochetkit.com/about',
          },
          publisher: {
            '@type': 'Organization',
            name: 'MyCrochetKit',
            url: 'https://mycrochetkit.com',
          },
          datePublished: '2026-02-01',
          dateModified: '2026-02-07',
          mainEntityOfPage: 'https://mycrochetkit.com/blog/crochet-trends-2026',
          articleSection: 'Crochet Trends',
          keywords: [
            'crochet trends 2026',
            'granny square trend',
            'crochet fashion',
            'sustainable yarn',
            'crochet community',
          ],
        }}
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
          <Link to="/" className="hover:text-[#E86A58]">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link to="/blog" className="hover:text-[#E86A58]">
            Blog
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#2C1810]/70">Crochet Trends 2026</span>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 text-sm text-[#E86A58] mb-4">
            <span className="px-3 py-1 bg-[#E86A58]/10 rounded-full font-medium">Crochet Trends</span>
            <span className="flex items-center gap-1 text-[#2C1810]/70">
              <Calendar className="w-4 h-4" /> Feb 1, 2026
            </span>
            <span className="flex items-center gap-1 text-[#2C1810]/70">
              <Clock className="w-4 h-4" /> 8 min read
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4 leading-tight">
            Crochet Trends 2026: What I'm Actually Seeing (and Making)
          </h1>
          <p className="text-lg text-[#2C1810]/70 mb-6 leading-relaxed">
            I've been scrolling through way too much crochet content and paying attention to what
            keeps showing up in my feed, at craft meetups, and in my own project queue. Here's
            what's actually happening right now.
          </p>

          <div className="flex items-center gap-3 py-4 border-t border-b border-[#2C1810]/10 mb-8">
            <div className="w-11 h-11 rounded-full bg-[#E86A58]/10 flex items-center justify-center">
              <span className="text-lg">🧶</span>
            </div>
            <div>
              <p className="font-semibold text-[#2C1810] text-sm">Jason</p>
              <p className="text-xs text-[#2C1810]/70">
                Crocheter & developer · Founder of MyCrochetKit
              </p>
            </div>
          </div>

          <div className="prose-custom space-y-6 text-[#2C1810] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              1. Granny Squares Keep Evolving
            </h2>

            <p>
              If you've been on crochet TikTok or Instagram at any point since 2021, you already
              know granny squares came back hard. But what's interesting is that the trend hasn't
              faded — it's matured. People aren't just making classic granny square blankets
              anymore. They're turning them into cardigans, bags, bucket hats, full-length coats.
            </p>
            <p>
              The color palettes have shifted too. Early revival was all about bright, clashing
              retro colors. Now I'm seeing a lot of earthy tones — mustard, sage, mocha — alongside
              the bold stuff. And mixed motif designs are everywhere, where people combine granny
              squares with other stitch patterns in the same piece.
            </p>
            <p>
              The reason granny squares keep working is simple: each one is a small, portable
              project. You can finish a square on a lunch break and feel like you accomplished
              something. Then eventually all those squares become a blanket or a cardigan. That
              instant gratification loop is hard to beat.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              2. Crochet Fashion Is Legitimately Mainstream Now
            </h2>

            <p>
              This one's been building for years. Prada put crochet raffia bags on the runway in
              2022. By 2023, designers like Victoria Beckham, Jil Sander, and Gabriela Hearst were
              featuring open cobweb crochet weaves. In 2024, it was everywhere — Chloé, Stella
              McCartney, Gucci, Michael Kors, Blumarine. Crochet isn't a novelty on the runway
              anymore. It's just... fashion.
            </p>
            <p>
              What I think matters more is what that did downstream. When high fashion legitimizes
              crochet, it gives everyone else permission to wear it outside of music festivals and
              beach vacations. Now I see crochet cardigans at coffee shops, market bags at the
              grocery store, bucket hats in every color. It's normal.
            </p>
            <p>
              The wearables I'm seeing the most right now: oversized cardigans (always), crop tops,
              sweater vests with that preppy-meets-handmade look, and tote bags that double as
              actual daily-use bags instead of just cute accessories.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              3. People Are Paying Attention to Their Yarn
            </h2>

            <p>
              This is probably the most meaningful shift I've seen. More crocheters are asking
              "where did this yarn come from?" before buying it, and that's changing what companies
              produce and stock.
            </p>
            <p>
              Recycled cotton yarn made from textile waste is getting more accessible and
              affordable. Hemp blends are showing up more for their durability. Locally-sourced wool
              from small farms has a real following, especially among makers who sell finished pieces
              and want to tell the full story of their materials.
            </p>
            <p>
              And "scrap-ghans" — blankets made entirely from leftover yarn — are having a genuine
              moment. It started as a practical way to use up stash, but now people are
              intentionally designing for that scrappy, multicolor look.
            </p>

            {/* Yarn fact check callout */}
            <div className="bg-[#FFF0EB] border-l-4 border-[#E86A58] rounded-r-xl p-5 my-8">
              <p className="font-bold text-[#2C1810] mb-2">
                A note about "bamboo" yarn
              </p>
              <p className="text-[#2C1810]/70 text-[15px]">
                You'll see a lot of yarn marketed as "bamboo" with claims about it being
                antibacterial and eco-friendly. Heads up: most "bamboo" yarn is actually bamboo
                viscose or rayon. The chemical processing involved removes the natural properties of
                the bamboo plant. The FTC has fined major retailers millions of dollars over this —
                including Walmart ($3M) and Kohl's ($2.5M) in 2022 for false labeling. If a yarn
                says "bamboo," check whether it's actually labeled as rayon or viscose made from
                bamboo. It can still be a nice yarn, but the marketing claims don't always hold up.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              4. Crochet Tools Are Finally Getting Better
            </h2>

            <p>
              For the longest time, the "technology" side of crochet was basically a clicker counter
              and a PDF pattern. That's changing. There are actual tools now that are built by people
              who crochet, for people who crochet.
            </p>
            <p>
              Voice-activated row counters let you track rows without putting your hook down — that's{' '}
              <Link to="/" className="text-[#E86A58] font-semibold hover:underline">
                what I built MyCrochetKit for
              </Link>
              , because I got tired of losing my count every time I picked up my phone. Pattern
              organizer apps help you annotate PDFs and keep notes across projects. Yarn weight
              calculators tell you if you have enough yarn to finish. WIP trackers keep everything
              in one place when you're juggling three projects at once (which, let's be honest, is
              most of us).
            </p>
            <p>
              The common thread is that these tools are designed around how crocheters actually work
              — hands busy, often multitasking, picking projects up and putting them down across
              days or weeks. When the tool fits the workflow instead of fighting it, it actually
              gets used.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              5. The Community Keeps Getting Bigger
            </h2>

            <p>
              This isn't a "trend" in the traditional sense, but it's the thing that makes
              everything else on this list possible. The crochet community online is massive now.
              TikTok and Instagram brought in a wave of new crocheters during the pandemic, and a
              lot of them stuck around. YouTube tutorials make it genuinely possible to go from
              never holding a hook to making a wearable garment, all for free.
            </p>
            <p>
              What I appreciate most is how generous the community is. People share patterns,
              troubleshoot each other's projects, and hype up beginners posting their first wonky
              granny square. That energy is what keeps people coming back to the craft.
            </p>
            <p>
              If you're reading this and you're new — welcome. It's a good time to be here.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8EDE5] rounded-2xl p-8 text-center my-10">
            <h3 className="text-xl font-bold text-[#2C1810] mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E86A58]" />
              Track Your Projects with MyCrochetKit
            </h3>
            <p className="text-[#2C1810]/70 mb-5">
              Voice-activated row counting, project notes, works offline. Free, no account
              required.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#E86A58] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#D35A4A] transition-colors"
            >
              Try Free <Heart className="w-4 h-4" />
            </Link>
          </div>

          {/* FAQ */}
          <section className="border-t-2 border-[#2C1810]/10 pt-8 mt-10">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Frequently Asked Questions</h2>

            {[
              {
                q: 'What are the biggest crochet trends in 2026?',
                a: 'The biggest crochet trends in 2026 include the continued evolution of granny square designs (cardigans, bags, mixed motifs), mainstream crochet fashion influenced by designers like Chloé and Stella McCartney, growing demand for sustainable and recycled yarns, better digital tools designed specifically for crocheters, and a thriving online community that keeps bringing new people into the craft.',
              },
              {
                q: 'Are granny squares still popular in 2026?',
                a: 'Yes. Granny squares have been trending since around 2021 and the trend has matured rather than faded. In 2026, crocheters are using granny squares in more ambitious ways — full garments, bags, hats, and mixed-motif designs that combine granny squares with other stitch patterns. Color palettes have also evolved toward earthier tones alongside the classic bold combinations.',
              },
              {
                q: 'Is crochet fashion mainstream?',
                a: 'Crochet fashion is fully mainstream as of 2026. High-fashion designers like Prada, Gucci, Chloé, and Stella McCartney have featured crochet since 2022, and by 2024 it had spread to everyday fashion. Crochet cardigans, crop tops, bucket hats, and tote bags are now common everyday wear, not just festival or beach pieces.',
              },
              {
                q: 'Is bamboo yarn actually antibacterial?',
                a: 'Most yarn marketed as "bamboo" is actually bamboo viscose or rayon, which has been chemically processed to the point where the natural properties of the bamboo plant — including any antibacterial qualities — are removed. The FTC has fined major retailers like Walmart and Kohl\'s millions of dollars for making false "bamboo" and "antibacterial" claims about these products. Check the fiber content label for the actual material.',
              },
              {
                q: 'What sustainable yarn options are available for crochet?',
                a: 'Popular sustainable yarn options in 2026 include recycled cotton made from textile waste, hemp blends for durability, and locally-sourced wool from small farms. Many crocheters also practice sustainability by making "scrap-ghans" — blankets and projects designed to use leftover yarn from other projects.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-[#2C1810]/10 py-5 last:border-b-0">
                <h3 className="font-bold text-[#2C1810] mb-2">{faq.q}</h3>
                <p className="text-[#2C1810]/70 text-[15px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </section>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-[#2C1810]/10">
            <ShareButtons
              url="/blog/crochet-trends-2026"
              title="Crochet Trends 2026: What I'm Actually Seeing (and Making)"
              description="From granny square evolution to crochet on high-fashion runways — what's actually trending in crochet right now."
            />
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-[#2C1810]/10 text-sm text-[#2C1810]/70">
            <p>
              Written by <strong className="text-[#2C1810]/70">Jason</strong>, founder of{' '}
              <Link to="/" className="text-[#E86A58] hover:underline">
                MyCrochetKit
              </Link>
              . I crochet, I code, I scroll through way too much crochet content.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Crochet Trends', 'Granny Squares', 'Crochet Fashion', 'Sustainable Yarn'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#F5E6D3] rounded-full text-xs text-[#2C1810]/60"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};
