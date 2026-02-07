import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export const BlogPostTrueCost = () => {
  return (
    <>
      <SEOHead
        title="The Real Cost of a Handmade Crochet Blanket (The Math Will Hurt) | MyCrochetKit"
        description="Someone asked me to make them a blanket. I did the math. Here's why handmade crochet items cost what they cost — and why most of us only make things for people we love."
        canonicalUrl="https://mycrochetkit.com/blog/real-cost-handmade-crochet-blanket"
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

        <nav className="max-w-3xl mx-auto px-6 pt-6 text-sm text-[#2C1810]/50">
          <Link to="/" className="hover:text-[#E86A58]">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link to="/blog" className="hover:text-[#E86A58]">
            Blog
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#2C1810]/70">The Real Cost of a Handmade Blanket</span>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 text-sm text-[#E86A58] mb-4">
            <span className="px-3 py-1 bg-[#E86A58]/10 rounded-full font-medium">Crochet Life</span>
            <span className="flex items-center gap-1 text-[#2C1810]/50">
              <Calendar className="w-4 h-4" /> Feb 5, 2026
            </span>
            <span className="flex items-center gap-1 text-[#2C1810]/50">
              <Clock className="w-4 h-4" /> 5 min read
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4 leading-tight">
            The Real Cost of a Handmade Crochet Blanket
          </h1>
          <p className="text-lg text-[#2C1810]/70 mb-6 leading-relaxed">
            Someone at work asked me to make them a blanket. I did the math. Now I need to talk
            about it.
          </p>

          <div className="flex items-center gap-3 py-4 border-t border-b border-[#2C1810]/10 mb-8">
            <div className="w-11 h-11 rounded-full bg-[#E86A58]/10 flex items-center justify-center">
              <span className="text-lg">🧶</span>
            </div>
            <div>
              <p className="font-semibold text-[#2C1810] text-sm">Jason</p>
              <p className="text-xs text-[#2C1810]/50">
                Crocheter & developer · Founder of MyCrochetKit
              </p>
            </div>
          </div>

          <div className="prose-custom space-y-6 text-[#2C1810] leading-relaxed">
            <p>
              A coworker found out I crochet. Cool. Then came the question I should have seen coming
              from a mile away.
            </p>

            <p>"Could you make me a blanket? I'll pay you for it."</p>

            <p>
              Nice of them to offer to pay, right? Most people don't even do that. So I said sure,
              let me figure out what it would cost.
            </p>

            <p>
              And then I actually did the math. Not the "yeah just buy the material and whatever my
              time isn't worth a shit" math. The real math.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              The Math Nobody Wants to See
            </h2>

            <p>
              Medium sized throw blanket for a grand-baby (first grand-baby). Nothing fancy. Single
              color, basic stitch.
            </p>

            {/* Math Box */}
            <div className="bg-[#F5E6D3] rounded-2xl p-6 my-8">
              <h3 className="font-bold text-[#2C1810] mb-4">
                The Real Cost of a Basic Throw Blanket
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[#D4C4B0] border-dashed">
                  <span className="text-[#5C574F]">Yarn (medium weight, decent quality)</span>
                  <span className="font-semibold">$70</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D4C4B0] border-dashed">
                  <span className="text-[#5C574F]">Time (50 hours at minimum wage)</span>
                  <span className="font-semibold">$725</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-[#2C1810] mt-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-[#E86A58]">$795</span>
                </div>
              </div>
            </div>

            <p>Mind you I just started crocheting. Let's say 50 hours. HA.</p>

            <p>
              If I paid myself minimum wage that's $725 in labor. I live in Cali, Central Coast to
              be exact. Plus the $70 in yarn. That's $795 for a basic blanket.
            </p>

            {/* Reaction Box */}
            <div className="bg-[#FFF0EB] border-l-4 border-[#E86A58] rounded-r-xl p-5 my-8">
              <p className="mb-2">
                <strong>What they expected:</strong> $50
              </p>
              <p className="mb-0">
                <strong>What it actually costs:</strong> $795
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">I'm Not Mad at Them</h2>

            <p>Not upset or anything but I declined because make it make sense.</p>

            <p>
              She genuinely didn't know. Most people don't. They see blankets at Target for $30 and
              think that's what things cost. They don't know that machine made and handmade aren't
              even in the same universe.
            </p>

            {/* Comparison Visual */}
            <div className="bg-[#FFF8EE] rounded-2xl p-6 my-8 border border-[#2C1810]/5">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#E8EDE5] border-2 border-[#7A8B6F] flex items-center justify-center mb-3">
                    <span className="text-2xl">🏭</span>
                  </div>
                  <p className="font-semibold text-[#5C574F] mb-1">Machine-Made</p>
                  <p className="text-sm text-[#5C574F]">Time: Minutes</p>
                  <p className="text-sm text-[#5C574F]">Cost: $30</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0EB] border-2 border-[#E86A58] flex items-center justify-center mb-3">
                    <span className="text-2xl">🧶</span>
                  </div>
                  <p className="font-semibold text-[#E86A58] mb-1">Handmade</p>
                  <p className="text-sm text-[#5C574F]">Time: 50+ hours</p>
                  <p className="text-sm font-semibold text-[#E86A58]">Cost: $795</p>
                </div>
              </div>
              <p className="text-center text-sm text-[#5C574F] mt-4 italic">
                These are not the same product. They shouldn't cost the same.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              This Is Why I Only Crochet for People I Actually Like
            </h2>

            <p>
              But it made me realize why I only crochet for people I actually like and care about
              (thank goodness there are not a lot of them). And even then sometimes I have to think
              about it.
            </p>

            <p>
              When I make something for someone I love, I'm not thinking about the hourly rate. I'm
              thinking about them using it, loving it, maybe passing it down someday. That's worth
              the fifty hours.
            </p>

            <p>
              But for a coworker I barely know? Someone who might shove it in a closet after a year?
              That's a hard sell.
            </p>

            {/* Who Gets Handmade */}
            <div className="bg-[#FFF8EE] rounded-2xl p-6 my-8 border border-[#2C1810]/5">
              <p className="text-center font-bold text-[#2C1810] mb-6">The Handmade Test</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#7A8B6F]/20 border-2 border-[#7A8B6F] flex items-center justify-center mb-2">
                    <span className="text-xl">❤️</span>
                  </div>
                  <p className="text-xs font-semibold text-[#7A8B6F]">INNER CIRCLE</p>
                  <p className="text-xs text-[#5C574F] mt-1">Worth every hour</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#F5E6D3] border-2 border-[#D4C4B0] flex items-center justify-center mb-2">
                    <span className="text-xl">🤔</span>
                  </div>
                  <p className="text-xs font-semibold text-[#5C574F]">MAYBE</p>
                  <p className="text-xs text-[#5C574F] mt-1">If they pay full price</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0EB] border-2 border-[#E86A58] flex items-center justify-center mb-2">
                    <span className="text-xl">🙅</span>
                  </div>
                  <p className="text-xs font-semibold text-[#E86A58]">NOPE</p>
                  <p className="text-xs text-[#5C574F] mt-1">"I'll give you $40"</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              What Do You Say When People Ask?
            </h2>

            <p>
              I'm genuinely curious. Do you just say you're too busy? Do you explain the cost? Do
              you make exceptions?
            </p>

            <p>
              Because I know I'm not the only one who's done this math and had that moment where you
              realize why we only crochet for the people who matter.
            </p>
          </div>

          {/* Share Prompt */}
          <div className="bg-[#E8EDE5] rounded-2xl p-6 text-center my-10">
            <h3 className="font-bold text-[#2C1810] mb-2">
              Share This With Someone Who Doesn't Get It
            </h3>
            <p className="text-[#5C574F] text-sm mb-0">
              We've all got that friend who thinks handmade should cost $30. Send them this.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-[#2C1810]/10">
            <ShareButtons
              url="/blog/real-cost-handmade-crochet-blanket"
              title="The Real Cost of a Handmade Crochet Blanket"
              description="Someone asked me to make them a blanket. I did the math. It didn't go well."
            />
          </div>

          <footer className="mt-8 pt-6 border-t border-[#2C1810]/10 text-sm text-[#2C1810]/50">
            <p>
              Written by <strong className="text-[#2C1810]/70">Jason</strong>, founder of{' '}
              <Link to="/" className="text-[#E86A58] hover:underline">
                MyCrochetKit
              </Link>
              . I crochet. I code. I do too much math sometimes.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Crochet Life', 'Pricing', 'Handmade', 'Rant'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#F5E6D3] rounded-full text-xs text-[#2C1810]/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </div>
    </>
  );
};
