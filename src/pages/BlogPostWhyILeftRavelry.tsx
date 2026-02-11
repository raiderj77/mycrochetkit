import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, AlertTriangle, Heart, Zap } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export function BlogPostWhyILeftRavelry() {
  return (
    <>
      <SEOHead
        title="Why I Left Ravelry (And What I Use Now) | MyCrochetKit Blog"
        description="After 8 years on Ravelry, I finally made the switch. Here's what pushed me away, what I miss, and the tools I use instead for tracking my crochet projects."
        canonicalUrl="https://mycrochetkit.com/blog/why-i-left-ravelry"
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-[#2C1810]/70 hover:text-[#2C1810] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Blog</span>
            </Link>
            <ShareButtons
              title="Why I Left Ravelry"
              description="After 8 years on Ravelry, I made the switch. Here's my story."
              variant="popup"
            />
          </div>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 text-sm text-[#2C1810]/60 mb-4">
              <span className="px-3 py-1 bg-[#E86A58]/10 text-[#E86A58] rounded-full font-medium">
                Personal Story
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Feb 11, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                6 min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6 leading-tight">
              Why I Left Ravelry<br />
              <span className="text-[#E86A58]">(And What I Use Now)</span>
            </h1>

            <p className="text-xl text-[#2C1810]/70 leading-relaxed">
              I joined Ravelry in 2018. For years, it was my crochet home base. 
              Then things changed. Here's my honest experience — the good, the bad, and what I switched to.
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-[#2C1810]/80 leading-relaxed"
            >
              <h2 className="text-2xl font-bold text-[#2C1810] mt-8">What I Loved About Ravelry</h2>

              <p>
                Let me be clear: Ravelry did a lot right. For years, it was the only game in town, and for good reason:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#E86A58] flex-shrink-0 mt-1" />
                  <span><strong>The pattern database.</strong> Half a million patterns, searchable by every criteria imaginable. Nothing else comes close.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#E86A58] flex-shrink-0 mt-1" />
                  <span><strong>Project pages.</strong> Seeing 500 people who made the same sweater, with their notes and modifications? Invaluable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#E86A58] flex-shrink-0 mt-1" />
                  <span><strong>The community.</strong> Tight-knit groups, helpful forums, genuine connections.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#E86A58] flex-shrink-0 mt-1" />
                  <span><strong>Yarn database.</strong> Looking up colorways, reading reviews, tracking your stash.</span>
                </li>
              </ul>

              <p>
                I'm not here to trash Ravelry. It served me well for years. But things changed.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">What Pushed Me Away</h2>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">The 2019 Redesign Disaster</h3>

              <p>
                You probably remember this. Ravelry launched a major redesign, and people started reporting 
                headaches, migraines, even seizures. The high contrast, the animations, the overall visual intensity — 
                it was genuinely hurting people.
              </p>

              <div className="not-prose p-5 bg-[#E86A58]/5 border-l-4 border-[#E86A58] rounded-r-xl my-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#E86A58] flex-shrink-0 mt-0.5" />
                  <p className="text-[#2C1810]/70 text-sm">
                    To be fair, Ravelry eventually added a "classic" mode. But the initial response felt dismissive, 
                    and many in the community felt unheard. That left a lasting impression.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">It's Just... Slow</h3>

              <p>
                Every. Single. Page. Takes forever. I'd click on a pattern, wait 3-4 seconds, 
                click on a project, wait again. In 2026, with modern web tech, there's no excuse 
                for pages that take multiple seconds to load.
              </p>

              <p>
                When I'm actively crocheting, I don't want to wait. I want to tap, see my count, and get back to my hook.
              </p>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">No Offline Mode</h3>

              <p>
                This is the killer for me. I crochet everywhere — at yarn stores, at my local craft circle, 
                on planes. Ravelry requires internet for everything. No WiFi? No access to your patterns, 
                your projects, anything.
              </p>

              <p>
                I've been caught at a yarn store, trying to check if I already have a colorway, 
                and just... couldn't. Because the store's WiFi was down.
              </p>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">The Social Network Fatigue</h3>

              <p>
                Somewhere along the way, Ravelry became less of a tool and more of a social network. 
                Forums, groups, drama, discourse. I just want to track my projects and count my rows. 
                I don't need another feed.
              </p>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">Data Lock-In</h3>

              <p>
                Try exporting your data from Ravelry. Go ahead, I'll wait. It's not easy. 
                Years of project history, notes, patterns — all locked in their system. 
                That dependency makes me uncomfortable.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">What I Use Now</h2>

              <p>
                I didn't replace Ravelry with one app. I use a combination:
              </p>

              <div className="not-prose space-y-4 my-8">
                <div className="p-6 bg-white rounded-2xl border border-[#2C1810]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E86A58] flex items-center justify-center">
                      <span className="text-lg">🧶</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2C1810]">MyCrochetKit</h4>
                      <p className="text-sm text-[#2C1810]/60">For active projects</p>
                    </div>
                  </div>
                  <p className="text-[#2C1810]/70 text-sm">
                    Voice-activated row counting, offline mode, PDF pattern import. 
                    This is what I use while actually crocheting. Fast, focused, no distractions.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#2C1810]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B8A9C9] flex items-center justify-center">
                      <span className="text-lg">📚</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2C1810]">Ravelry (Limited Use)</h4>
                      <p className="text-sm text-[#2C1810]/60">For pattern discovery only</p>
                    </div>
                  </div>
                  <p className="text-[#2C1810]/70 text-sm">
                    I still browse Ravelry for finding patterns. The database is unmatched. 
                    But I download the PDF and do all my actual tracking elsewhere.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#2C1810]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7FBFA0] flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2C1810]">Notes App</h4>
                      <p className="text-sm text-[#2C1810]/60">For yarn stash</p>
                    </div>
                  </div>
                  <p className="text-[#2C1810]/70 text-sm">
                    Simple spreadsheet of what yarn I have. Brand, colorway, yardage, where I bought it. 
                    Works offline, syncs across devices, no drama.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">What I Miss</h2>

              <p>
                I won't pretend it's all better. Here's what I genuinely miss:
              </p>

              <ul className="space-y-2">
                <li>• Seeing other people's project pages for patterns I'm making</li>
                <li>• The comprehensive yarn database</li>
                <li>• Some of the niche groups and communities</li>
                <li>• Pattern designer pages with all their work in one place</li>
              </ul>

              <p>
                But honestly? The tradeoff is worth it. I crochet more and stress less.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">My Advice</h2>

              <p>
                You don't have to go all-or-nothing. Here's what I'd suggest:
              </p>

              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li><strong>Keep your Ravelry account</strong> for pattern discovery</li>
                <li><strong>Download PDFs</strong> of patterns you buy</li>
                <li><strong>Use a dedicated app</strong> for tracking while you work</li>
                <li><strong>Back up your data</strong> somewhere you control</li>
              </ol>

              <p>
                The goal isn't to "defeat" Ravelry. It's to build a workflow that actually works for you.
              </p>

              {/* CTA Box */}
              <div className="not-prose mt-12 p-8 bg-white rounded-3xl border border-[#2C1810]/10 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-[#E86A58]" />
                <h3 className="text-2xl font-bold text-[#2C1810] mb-3">
                  Ready to try something different?
                </h3>
                <p className="text-[#2C1810]/70 mb-6">
                  MyCrochetKit is free, works offline, and has voice counting. No account required to try it.
                </p>
                <Link
                  to="/quick-counter"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-semibold rounded-xl transition-colors"
                >
                  Try Voice Counter Free <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Final Thoughts</h2>

              <p>
                Ravelry was a revolution when it launched. It brought the fiber arts community together 
                in a way nothing else had. I'm grateful for that.
              </p>

              <p>
                But tools evolve. Our needs change. And in 2026, I need something faster, 
                something that works offline, something focused on the craft rather than the community.
              </p>

              <p>
                If you're feeling the same friction I felt, know that there are alternatives. 
                You don't have to just accept a subpar experience because "that's how it's always been."
              </p>

              <p className="text-[#2C1810] font-medium">
                Happy hooking. 🧶
              </p>

            </motion.div>
          </div>

          {/* Author / Related */}
          <footer className="mt-16 pt-8 border-t border-[#2C1810]/10">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
              <div>
                <p className="text-sm text-[#2C1810]/60 mb-2">Written by</p>
                <p className="font-medium text-[#2C1810]">A Frustrated Crocheter</p>
              </div>
              <ShareButtons
                title="Why I Left Ravelry"
                variant="inline"
              />
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-[#2C1810] mb-4">Related Articles</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/vs/ravelry"
                  className="p-4 bg-white rounded-xl border border-[#2C1810]/5 hover:border-[#E86A58]/20 transition-colors"
                >
                  <p className="font-medium text-[#2C1810]">MyCrochetKit vs Ravelry</p>
                  <p className="text-sm text-[#2C1810]/60 mt-1">Feature comparison</p>
                </Link>
                <Link
                  to="/blog/best-crochet-apps-offline"
                  className="p-4 bg-white rounded-xl border border-[#2C1810]/5 hover:border-[#E86A58]/20 transition-colors"
                >
                  <p className="font-medium text-[#2C1810]">Best Crochet Apps That Work Offline</p>
                  <p className="text-sm text-[#2C1810]/60 mt-1">7 apps tested</p>
                </Link>
              </div>
            </div>
          </footer>
        </article>

        <footer className="border-t border-[#2C1810]/5 bg-white mt-12">
          <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl">🧶</span>
              <span className="font-semibold text-[#2C1810]">MyCrochetKit</span>
            </Link>
            <div className="flex gap-6">
              <Link to="/tools" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm">Free Tools</Link>
              <Link to="/blog" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm">Blog</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
