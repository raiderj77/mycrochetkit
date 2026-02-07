import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export const BlogPostRowCounting = () => {
  return (
    <>
      <SEOHead
        title="How to Never Lose Your Row Count Again (5 Methods Compared) | MyCrochetKit"
        description="Tired of losing your row count mid-project? Compare 5 row tracking methods — from physical counters to voice-activated apps — and find what actually works for your crochet workflow."
        canonicalUrl="https://mycrochetkit.com/blog/how-to-never-lose-row-count-crochet"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'How to Never Lose Your Row Count Again: 5 Methods Compared',
          description:
            'Compare 5 row tracking methods for crochet — from tally marks to voice-activated counters — and find what actually works for your workflow.',
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
          datePublished: '2026-02-03',
          dateModified: '2026-02-03',
          mainEntityOfPage: 'https://mycrochetkit.com/blog/how-to-never-lose-row-count-crochet',
          articleSection: 'Crochet Tips',
          keywords: [
            'row counting crochet',
            'crochet row counter',
            'how to count rows crochet',
            'voice activated crochet counter',
            'crochet tips beginners',
          ],
        }}
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        {/* Header */}
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

        {/* Breadcrumbs */}
        <nav
          className="max-w-3xl mx-auto px-6 pt-6 text-sm text-[#2C1810]/70"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-[#E86A58]">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link to="/blog" className="hover:text-[#E86A58]">
            Blog
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#2C1810]/70">How to Never Lose Your Row Count</span>
        </nav>

        {/* Article */}
        <article className="max-w-3xl mx-auto px-6 py-8">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#E86A58] mb-4">
            <span className="px-3 py-1 bg-[#E86A58]/10 rounded-full font-medium">Crochet Tips</span>
            <span className="flex items-center gap-1 text-[#2C1810]/70">
              <Calendar className="w-4 h-4" /> Feb 3, 2026
            </span>
            <span className="flex items-center gap-1 text-[#2C1810]/70">
              <Clock className="w-4 h-4" /> 7 min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-4 leading-tight">
            How to Never Lose Your Row Count Again
          </h1>
          <p className="text-lg text-[#2C1810]/70 mb-6 leading-relaxed">
            I've tried every method — tally marks, clicker counters, phone apps, stitch markers, and
            eventually building my own tool. Here's what actually works and what doesn't.
          </p>

          {/* Author */}
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

          {/* Key Answer Box — AEO/LLM target */}
          <div className="bg-[#E8EDE5] border-l-4 border-[#7A8B6F] rounded-r-xl p-5 mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8B6F] mb-2">
              The short answer
            </p>
            <p className="text-[#2C1810] leading-relaxed">
              The most reliable way to track your row count while crocheting is to use a
              voice-activated digital counter. It lets you say "next row" without putting down your
              hook, works offline, and eliminates the two biggest causes of miscounts: interruptions
              and forgetting to click.
            </p>
          </div>

          {/* --- BODY CONTENT --- */}
          <div className="prose-custom space-y-6 text-[#2C1810] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Why Losing Count Is So Common
            </h2>

            <p>
              If you've ever stared at your work muttering "was that 47 or 48?" — you're not alone.
              Losing your row count is one of the most universal frustrations in crochet, and it's
              not because you're doing something wrong. It's because every traditional counting
              method requires you to break your flow.
            </p>
            <p>
              Your phone screen locks, and when you unlock it you can't remember if you already
              tapped the counter. Your physical clicker falls between the couch cushions. Your tally
              marks start blurring together after row 60. You're watching a show while crocheting
              and suddenly three rows have passed uncounted.
            </p>
            <p>
              The core problem isn't discipline — it's that counting methods haven't kept up with
              how people actually crochet. Most of us crochet while doing something else: watching
              TV, riding the bus, sitting in waiting rooms, chatting with friends. Any method that
              demands you stop, pick up a device, tap a screen, and put it back down is fighting
              your natural workflow instead of fitting into it.
            </p>

            {/* Image 1: Frustration Cycle */}
            <figure className="my-8 -mx-2 md:-mx-6">
              <div className="bg-[#FFF8EE] rounded-2xl p-6 md:p-8 border border-[#2C1810]/5">
                <p className="text-center text-lg font-bold text-[#E86A58] mb-6">
                  The Row Count Frustration Cycle
                </p>
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                  {[
                    {
                      emoji: '🧶',
                      label: 'Crocheting',
                      sub: 'Row 47',
                      color: 'bg-[#E8EDE5] border-[#7A8B6F]',
                    },
                    { emoji: '→', label: '', sub: '', color: '' },
                    {
                      emoji: '📱',
                      label: 'Interrupted',
                      sub: 'Phone locks',
                      color: 'bg-[#FFF0EB] border-[#E86A58]',
                    },
                    { emoji: '→', label: '', sub: '', color: '' },
                    {
                      emoji: '❓',
                      label: 'Confused',
                      sub: '47 or 48?',
                      color: 'bg-[#FFF0EB] border-[#E86A58] border-dashed',
                    },
                    { emoji: '→', label: '', sub: '', color: '' },
                    {
                      emoji: '😩',
                      label: 'Recount',
                      sub: 'Manually',
                      color: 'bg-[#E8EDE5]/50 border-[#7A8B6F]/50',
                    },
                  ].map((step, i) =>
                    step.emoji === '→' ? (
                      <span key={i} className="text-[#2C1810]/65 text-xl hidden md:block">
                        →
                      </span>
                    ) : (
                      <div key={i} className={`flex flex-col items-center w-20 md:w-24`}>
                        <div
                          className={`w-16 h-16 md:w-18 md:h-18 rounded-full ${step.color} border-2 flex flex-col items-center justify-center mb-2`}
                        >
                          <span className="text-xl">{step.emoji}</span>
                          {step.sub && (
                            <span className="text-[8px] font-semibold text-[#2C1810]/60 mt-0.5">
                              {step.sub}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-[#2C1810]/70">
                          {step.label}
                        </span>
                      </div>
                    )
                  )}
                </div>
                <p className="text-center text-sm text-[#2C1810]/70 mt-4 italic">
                  Every method that requires stopping your hands creates this loop.
                </p>
              </div>
            </figure>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              5 Row Counting Methods Compared
            </h2>

            <p>
              I've genuinely tried all of these across different projects — a temperature blanket,
              amigurumi, and a cardigan. Here's how each method held up in real use, not just in
              theory.
            </p>

            <h3 className="text-xl font-bold text-[#2C1810] mt-8 mb-3">
              1. Pen and Paper Tally Marks
            </h3>
            <p>
              The classic. A piece of paper next to your project with tally marks grouped in fives.
              It costs nothing and requires no technology. But after row 50, tally marks become a
              wall of lines that's surprisingly hard to count quickly. The paper gets lost, stained
              with coffee, or accidentally thrown away. And you still have to put your hook down to
              make each mark.
            </p>

            <h3 className="text-xl font-bold text-[#2C1810] mt-8 mb-3">
              2. Physical Clicker Counter
            </h3>
            <p>
              Those little handheld tally counters (or the ones that slide onto your needle) are
              popular for good reason — they're tactile and satisfying. The problem is they only go
              up. Made a mistake? You can't decrement a mechanical clicker. They also get lost,
              accidentally clicked in your bag, and don't save progress across sessions. For quick
              projects they work fine. For a blanket that takes months, they're unreliable.
            </p>

            <h3 className="text-xl font-bold text-[#2C1810] mt-8 mb-3">
              3. Stitch Markers Every N Rows
            </h3>
            <p>
              Placing a stitch marker every 10 or 20 rows gives you visual checkpoints in your
              actual fabric. This is genuinely useful for verification — you can count markers
              instead of rows. But it doesn't tell you which row you're on between markers, and it
              doesn't help when you pick up a project after a week away. Think of markers as a
              backup system rather than a primary counter.
            </p>

            <h3 className="text-xl font-bold text-[#2C1810] mt-8 mb-3">
              4. Phone App (Tap Counter)
            </h3>
            <p>
              Digital counter apps solve the "paper gets lost" problem and add features like
              multiple project support and notes. But they introduce a new problem: the
              tap-and-switch workflow. You finish a row, put your hook in your lap, pick up your
              phone, unlock it, find the app, tap the button, put the phone down, pick your hook
              back up. Multiply that by 200 rows and you've spent a surprising amount of your
              project just handling your phone.
            </p>

            <h3 className="text-xl font-bold text-[#2C1810] mt-8 mb-3">
              5. Voice-Activated Counter
            </h3>
            <p>
              This approach uses your phone's microphone to listen for spoken commands. Say "next"
              at the end of a row and the count goes up. Say "back" if you miscounted. Say "pause"
              during a conversation and "resume" when you're ready. Your hands never leave your
              hook. The counter stays on screen, and if it works offline, you're covered even
              without signal.
            </p>
            <p>
              This is the method I use now — and it's why I built{' '}
              <Link to="/" className="text-[#E86A58] font-semibold hover:underline">
                MyCrochetKit
              </Link>{' '}
              when I couldn't find one that worked the way I wanted.
            </p>

            {/* Comparison Table */}
            <div className="my-8 -mx-2 md:-mx-6 overflow-x-auto">
              <div className="bg-white rounded-2xl border border-[#2C1810]/10 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5E6D3]">
                      <th className="text-left px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Method
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Hands-Free
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Reliable
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Multi-Project
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-[#2C1810]/70 text-xs uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        method: 'Tally Marks',
                        handsFree: ['No', 'red'],
                        reliable: ['Fair', 'yellow'],
                        multi: ['No', 'red'],
                        cost: ['Free', 'green'],
                      },
                      {
                        method: 'Clicker Counter',
                        handsFree: ['No', 'red'],
                        reliable: ['Fair', 'yellow'],
                        multi: ['No', 'red'],
                        cost: ['~$5', 'green'],
                      },
                      {
                        method: 'Stitch Markers',
                        handsFree: ['Partial', 'yellow'],
                        reliable: ['Good', 'green'],
                        multi: ['No', 'red'],
                        cost: ['~$5', 'green'],
                      },
                      {
                        method: 'Phone App (Tap)',
                        handsFree: ['No', 'red'],
                        reliable: ['Good', 'green'],
                        multi: ['Yes', 'green'],
                        cost: ['Free–$5/mo', 'yellow'],
                      },
                      {
                        method: 'Voice Counter',
                        handsFree: ['Yes', 'green'],
                        reliable: ['Great', 'green'],
                        multi: ['Yes', 'green'],
                        cost: ['Free', 'green'],
                      },
                    ].map((row, i) => {
                      const colorMap: Record<string, string> = {
                        red: 'text-[#E86A58]',
                        yellow: 'text-[#B8860B]',
                        green: 'text-[#7A8B6F]',
                      };
                      const isLast = i === 4;
                      return (
                        <tr key={i} className={isLast ? 'bg-[#E8EDE5]/40' : 'hover:bg-[#FFF8EE]'}>
                          <td className="px-4 py-3 font-semibold text-[#2C1810]">{row.method}</td>
                          <td
                            className={`px-4 py-3 text-center font-semibold ${colorMap[row.handsFree[1]]}`}
                          >
                            {row.handsFree[0]}
                          </td>
                          <td
                            className={`px-4 py-3 text-center font-semibold ${colorMap[row.reliable[1]]}`}
                          >
                            {row.reliable[0]}
                          </td>
                          <td
                            className={`px-4 py-3 text-center font-semibold ${colorMap[row.multi[1]]}`}
                          >
                            {row.multi[0]}
                          </td>
                          <td
                            className={`px-4 py-3 text-center font-semibold ${colorMap[row.cost[1]]}`}
                          >
                            {row.cost[0]}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-center text-xs text-[#2C1810]/65 mt-3 italic">
                Voice counters are the only method that keeps your hands on your hook the entire
                time.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              How Voice-Activated Row Counting Works
            </h2>

            <p>
              Voice-activated counters use your device's built-in speech recognition to listen for
              simple trigger words. There's no wake word, no "Hey Siri" — the app is always
              listening (while you have it open) for specific commands.
            </p>
            <p>
              Here's the basic flow: you open your project, start crocheting, and when you finish a
              row, you say "next." The count goes up. If you realize you miscounted, say "back" and
              it decrements. Need to answer the door or have a conversation? Say "pause" and the
              listening stops. Say "resume" when you're ready to continue.
            </p>
            <p>
              The key difference from tap-based apps is that you never break your rhythm. Your hands
              stay on your hook and yarn. Your eyes stay on your work. The counter just... keeps up
              with you.
            </p>

            {/* Voice Commands Visual */}
            <figure className="my-8 -mx-2 md:-mx-6">
              <div className="bg-[#FFF8EE] rounded-2xl p-6 md:p-8 border border-[#2C1810]/5">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#E8EDE5] border-2 border-[#7A8B6F] flex items-center justify-center">
                    <span className="text-3xl">🎤</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      cmd: '"Next"',
                      action: 'Row 47 → 48',
                      color: 'border-[#7A8B6F] bg-[#7A8B6F]/10',
                    },
                    {
                      cmd: '"Back"',
                      action: 'Row 48 → 47',
                      color: 'border-[#E86A58] bg-[#E86A58]/10',
                    },
                    {
                      cmd: '"Pause"',
                      action: 'Stop listening',
                      color: 'border-[#B8860B] bg-[#B8860B]/10',
                    },
                    {
                      cmd: '"Resume"',
                      action: 'Start listening',
                      color: 'border-[#7A8B6F] bg-[#7A8B6F]/10',
                    },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-xl border-2 ${item.color} p-4 text-center`}>
                      <p className="font-bold text-[#2C1810] text-lg">{item.cmd}</p>
                      <p className="text-xs text-[#2C1810]/60 mt-1">{item.action}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-[#2C1810]/70 mt-4 italic">
                  Four commands. Hands never leave your hook.
                </p>
              </div>
            </figure>

            {/* Callout */}
            <div className="bg-[#FFF8EE] border border-[#2C1810]/10 rounded-xl p-5 my-6">
              <p className="font-bold text-[#2C1810] mb-2">Does it pick up random words?</p>
              <p className="text-[#2C1810]/70 text-[15px]">
                This is the most common concern. Modern speech recognition is context-aware enough
                that normal conversation rarely triggers a false count. Commands like "next" and
                "back" are short, distinct words. Most voice counter apps also show your current
                count on screen so you can catch any accidental increments immediately. Some apps
                let you customize your trigger words if you find conflicts.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              Tips for Accurate Row Counting (Any Method)
            </h2>

            <p>
              Regardless of which counting method you prefer, a few habits make miscounts much less
              likely.
            </p>

            <p>
              <strong>Count at the same point in every row.</strong> Whether you count after the
              turning chain or after the last stitch, be consistent. Inconsistency is where "off by
              one" errors sneak in. If you're using a voice counter, say "next" at the same moment
              every row — right after your turning chain works well because it's a natural pause
              point.
            </p>
            <p>
              <strong>Use stitch markers as verification checkpoints.</strong> Even if you're using
              a digital counter, placing a marker every 10 or 20 rows gives you physical reference
              points in your fabric. If your counter says row 45 but you only count 3 markers (at
              rows 10, 20, 30), you know something's off.
            </p>
            <p>
              <strong>Write notes when you stop mid-project.</strong> "Stopped at row 73, just
              finished the decrease section" takes five seconds and saves twenty minutes of
              reorienting when you pick the project back up three days later. Most counter apps have
              a notes field — use it.
            </p>
            <p>
              <strong>Don't count after frogging — mark your restart point.</strong> If you've
              ripped back several rows, count the rows in your fabric from a stitch marker, then
              update your counter. Trying to subtract in your head while frustrated is how errors
              compound.
            </p>

            <h2 className="text-2xl font-bold text-[#2C1810] mt-10 mb-4">
              When Voice Counting Makes the Biggest Difference
            </h2>

            <p>
              Voice-activated counting isn't better for every situation. For a quick dishcloth with
              30 rows, a tally sheet works fine. Where voice counting genuinely changes the
              experience is on longer, more complex projects.
            </p>
            <p>
              <strong>Blankets and afghans</strong> with 200+ rows where losing count means
              physically recounting stitches in fabric. <strong>Garments with shaping</strong> where
              you need to track increase/decrease rows precisely.{' '}
              <strong>Colorwork or multi-section projects</strong> where you're already juggling
              multiple yarns and don't want another thing to manage. And any project you{' '}
              <strong>crochet while multitasking</strong> — watching TV, commuting, or socializing —
              where picking up your phone every row isn't realistic.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8EDE5] rounded-2xl p-8 text-center my-10">
            <h3 className="text-xl font-bold text-[#2C1810] mb-2">Try Voice-Activated Counting</h3>
            <p className="text-[#2C1810]/70 mb-5">
              MyCrochetKit is free. No account required. Open a project, start crocheting, and say
              "next."
            </p>
            <Link
              to="/"
              className="inline-block bg-[#E86A58] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#D35A4A] transition-colors"
            >
              Start Free →
            </Link>
          </div>

          {/* FAQ — AEO/LLM extraction target */}
          <section className="border-t-2 border-[#2C1810]/10 pt-8 mt-10">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Frequently Asked Questions</h2>

            {[
              {
                q: 'What is the best way to keep track of rows in crochet?',
                a: 'The best method depends on your workflow. Voice-activated digital counters let you track rows hands-free by saying commands like "next row" without putting down your hook. Physical clicker counters are simple but require stopping to click. Tally marks work but are easy to lose. Stitch markers placed every 10 rows help verify your count visually. For long or complex projects, most crocheters find a combination of a digital counter plus periodic stitch markers to be the most reliable approach.',
              },
              {
                q: 'How do voice-activated row counters work for crochet?',
                a: 'Voice-activated row counters use your device\'s microphone to listen for spoken commands while you crochet. When you finish a row, you say a trigger word like "next" and the counter increments automatically. You can say "back" to correct mistakes and "pause" or "resume" to control listening. Your hands never leave your hook and yarn, which eliminates the interruption cycle that causes most miscounts.',
              },
              {
                q: 'Why do I keep losing count when crocheting?',
                a: "Losing count is extremely common and happens because most counting methods require you to break your crochet flow. Interruptions from daily life break concentration, phone screens lock and you forget the last number, physical counters get misplaced, and the repetitive nature of crochet makes it easy to zone out. The solution is a counting method that doesn't require you to stop — either voice commands or periodic stitch markers in your fabric.",
              },
              {
                q: 'Do voice row counters pick up random words by accident?',
                a: 'False triggers are uncommon with modern speech recognition. Commands like "next" and "back" are short, distinct words that rarely appear in normal conversation in isolation. Most voice counter apps display the current count on screen so you can catch any accidental increments immediately. Some apps also let you customize trigger words to avoid conflicts with words you use frequently.',
              },
              {
                q: 'Can I use a voice row counter offline?',
                a: "Some voice counter apps work offline, including MyCrochetKit, which uses your device's built-in speech recognition rather than cloud processing. This means you can count rows at yarn stores with poor signal, on airplanes, or anywhere without Wi-Fi.",
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
              url="/blog/how-to-never-lose-row-count-crochet"
              title="How to Never Lose Your Row Count Again (5 Methods Compared)"
              description="Compare 5 row tracking methods for crochet — from tally marks to voice-activated counters. Find what actually works."
            />
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-[#2C1810]/10 text-sm text-[#2C1810]/70">
            <p>
              Written by <strong className="text-[#2C1810]/70">Jason</strong>, founder of{' '}
              <Link to="/" className="text-[#E86A58] hover:underline">
                MyCrochetKit
              </Link>
              . Crocheter first, developer second.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Crochet Tips', 'Row Counting', 'Voice Commands', 'Beginner Friendly'].map(
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
