import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X, Mic, Wifi, WifiOff, Shield, Zap, Clock, Database } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

const comparisonData = [
  {
    feature: 'Voice-activated row counting',
    mycrochetkit: true,
    ravelry: false,
    note: 'Say "next" to count — keep hands on your hook',
  },
  {
    feature: 'Works offline',
    mycrochetkit: true,
    ravelry: false,
    note: 'Use at yarn stores, craft circles, anywhere',
  },
  {
    feature: 'PDF pattern parsing',
    mycrochetkit: true,
    ravelry: false,
    note: 'Turn any pattern into trackable steps',
  },
  {
    feature: 'Pattern discovery database',
    mycrochetkit: false,
    ravelry: true,
    note: 'Ravelry has 500K+ patterns',
  },
  {
    feature: 'Community forums',
    mycrochetkit: false,
    ravelry: true,
    note: 'Ravelry has 9M+ members',
  },
  {
    feature: 'Yarn stash tracking',
    mycrochetkit: false,
    ravelry: true,
    note: 'Coming soon to MyCrochetKit',
  },
  {
    feature: 'Project tracking',
    mycrochetkit: true,
    ravelry: true,
    note: 'Both track your WIPs',
  },
  {
    feature: 'Mobile-first design',
    mycrochetkit: true,
    ravelry: false,
    note: 'MyCrochetKit built for phones',
  },
  {
    feature: 'Fast page loads',
    mycrochetkit: true,
    ravelry: false,
    note: 'MyCrochetKit: <1s, Ravelry: 3-5s',
  },
  {
    feature: 'Data stays on your device',
    mycrochetkit: true,
    ravelry: false,
    note: 'Privacy-first architecture',
  },
  {
    feature: 'No account required',
    mycrochetkit: true,
    ravelry: false,
    note: 'Use voice counter without signing up',
  },
  {
    feature: 'Export your data anytime',
    mycrochetkit: true,
    ravelry: false,
    note: 'No lock-in, ever',
  },
];

export const VsRavelry = () => {
  const mckWins = comparisonData.filter(c => c.mycrochetkit && !c.ravelry).length;
  const ravWins = comparisonData.filter(c => !c.mycrochetkit && c.ravelry).length;
  const both = comparisonData.filter(c => c.mycrochetkit && c.ravelry).length;

  return (
    <>
      <SEOHead
        title="MyCrochetKit vs Ravelry 2026: Honest Comparison | Which Is Better?"
        description="MyCrochetKit vs Ravelry compared: voice counting, offline mode, speed, privacy. See which crochet app is right for you. Most crocheters use both together."
        canonicalUrl="https://mycrochetkit.com/vs/ravelry"
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
            <ShareButtons
              title="MyCrochetKit vs Ravelry Comparison"
              description="Honest comparison of MyCrochetKit and Ravelry for crocheters"
              hashtags={['crochet', 'ravelry']}
              variant="popup"
            />
          </div>
        </header>

        {/* Hero */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 bg-[#E86A58]/10 text-[#E86A58] text-sm font-medium rounded-full mb-4">
                Updated February 2026
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
                MyCrochetKit vs Ravelry:<br />
                <span className="text-[#E86A58]">Which Should You Use?</span>
              </h1>
              <p className="text-xl text-[#2C1810]/70 mb-8 max-w-2xl mx-auto">
                The honest answer: <strong>Use both together.</strong> Ravelry for pattern discovery. 
                MyCrochetKit while you're actually crocheting.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Answer */}
        <section className="px-6 py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-[#FFF8F0] border-2 border-[#E86A58]/20"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E86A58] flex items-center justify-center mb-4">
                  <span className="text-2xl">🧶</span>
                </div>
                <h2 className="text-2xl font-bold text-[#2C1810] mb-3">Use MyCrochetKit when...</h2>
                <ul className="space-y-3 text-[#2C1810]/70">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You're actively crocheting and need to count rows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You want hands-free voice control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You're at a yarn store or craft circle (offline)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You have a PDF pattern to follow step-by-step</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You want a fast, focused tool without distractions</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-[#FFF8F0] border-2 border-[#B8A9C9]/30"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#B8A9C9] flex items-center justify-center mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-[#2C1810] mb-3">Use Ravelry when...</h2>
                <ul className="space-y-3 text-[#2C1810]/70">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You're searching for your next pattern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You want to see what others made from a pattern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You need yarn substitution suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You want to join community discussions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-0.5" />
                    <span>You need a comprehensive stash/queue system</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-[#2C1810] text-center mb-4"
            >
              Feature-by-Feature Comparison
            </motion.h2>
            <p className="text-center text-[#2C1810]/60 mb-8">
              MyCrochetKit leads in {mckWins} features • Ravelry leads in {ravWins} features • Both have {both}
            </p>

            <div className="bg-white rounded-3xl shadow-sm border border-[#2C1810]/5 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr,80px,80px] md:grid-cols-[1fr,120px,120px] bg-[#FFF8F0] border-b border-[#2C1810]/10">
                <div className="p-4 font-semibold text-[#2C1810]">Feature</div>
                <div className="p-4 text-center font-semibold text-[#E86A58]">MyCrochetKit</div>
                <div className="p-4 text-center font-semibold text-[#B8A9C9]">Ravelry</div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, index) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className={`grid grid-cols-[1fr,80px,80px] md:grid-cols-[1fr,120px,120px] ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FFF8F0]/50'
                  } border-b border-[#2C1810]/5 last:border-b-0`}
                >
                  <div className="p-4">
                    <span className="font-medium text-[#2C1810]">{row.feature}</span>
                    {row.note && (
                      <p className="text-sm text-[#2C1810]/50 mt-1">{row.note}</p>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {row.mycrochetkit ? (
                      <div className="w-8 h-8 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-[#7FBFA0]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#2C1810]/5 flex items-center justify-center">
                        <X className="w-5 h-5 text-[#2C1810]/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {row.ravelry ? (
                      <div className="w-8 h-8 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-[#7FBFA0]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#2C1810]/5 flex items-center justify-center">
                        <X className="w-5 h-5 text-[#2C1810]/30" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Differences */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2C1810] text-center mb-12">
              Key Differences That Matter
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Mic,
                  title: 'Voice Control',
                  description: 'MyCrochetKit lets you count rows by voice. Just say "next" to increment. Ravelry has no voice features.',
                  winner: 'mycrochetkit',
                },
                {
                  icon: WifiOff,
                  title: 'Offline Mode',
                  description: 'MyCrochetKit works without internet. Use it at yarn stores, craft circles, anywhere. Ravelry requires connection.',
                  winner: 'mycrochetkit',
                },
                {
                  icon: Database,
                  title: 'Pattern Database',
                  description: 'Ravelry has 500,000+ patterns and a massive community. MyCrochetKit focuses on using patterns, not discovering them.',
                  winner: 'ravelry',
                },
                {
                  icon: Zap,
                  title: 'Speed & Performance',
                  description: 'MyCrochetKit loads in under 1 second. Ravelry pages often take 3-5 seconds. Modern vs legacy architecture.',
                  winner: 'mycrochetkit',
                },
                {
                  icon: Shield,
                  title: 'Privacy',
                  description: 'MyCrochetKit stores data locally on your device. Ravelry is a social network that tracks your activity.',
                  winner: 'mycrochetkit',
                },
                {
                  icon: Clock,
                  title: 'Time Investment',
                  description: 'Ravelry has a learning curve and rabbit holes. MyCrochetKit is focused — open, count, crochet.',
                  winner: 'mycrochetkit',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl ${
                    item.winner === 'mycrochetkit'
                      ? 'bg-[#E86A58]/5 border border-[#E86A58]/20'
                      : 'bg-[#B8A9C9]/5 border border-[#B8A9C9]/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.winner === 'mycrochetkit' ? 'bg-[#E86A58]/20' : 'bg-[#B8A9C9]/20'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        item.winner === 'mycrochetkit' ? 'text-[#E86A58]' : 'text-[#B8A9C9]'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-[#2C1810]">{item.title}</h3>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.winner === 'mycrochetkit'
                        ? 'bg-[#E86A58]/10 text-[#E86A58]'
                        : 'bg-[#B8A9C9]/10 text-[#B8A9C9]'
                    }`}>
                      {item.winner === 'mycrochetkit' ? 'MyCrochetKit' : 'Ravelry'}
                    </span>
                  </div>
                  <p className="text-[#2C1810]/70 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Ravelry Controversy */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-6">
              A Note on the 2019 Ravelry Redesign
            </h2>
            <div className="prose prose-lg text-[#2C1810]/80">
              <p>
                In 2019, Ravelry launched a redesign that caused accessibility issues for many users. 
                Some experienced migraines, seizures, and other adverse reactions. While Ravelry 
                added a "classic mode," the controversy created lasting frustration in the community.
              </p>
              <p>
                MyCrochetKit was built mobile-first with accessibility in mind. High contrast, 
                clear typography, and no jarring animations. We follow WCAG guidelines because 
                crocheting should be relaxing — so should your crochet app.
              </p>
            </div>
          </div>
        </section>

        {/* Best of Both Worlds */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-6">
              The Best of Both Worlds
            </h2>
            <p className="text-lg text-[#2C1810]/70 mb-8">
              Here's how most crocheters use both tools together:
            </p>
            <div className="space-y-4 text-left">
              {[
                { step: '1', text: 'Find a pattern on Ravelry, buy/download the PDF' },
                { step: '2', text: 'Upload the PDF to MyCrochetKit for step-by-step tracking' },
                { step: '3', text: 'Use voice commands while crocheting — no phone tapping' },
                { step: '4', text: 'Post your finished project back to Ravelry for community feedback' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-4 p-4 bg-[#FFF8F0] rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E86A58] text-white flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <p className="text-[#2C1810]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#2C1810] mb-4">
              Ready to try voice-activated counting?
            </h2>
            <p className="text-[#2C1810]/70 text-lg mb-8">
              No account needed. Works offline. Just say "next" to count.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quick-counter"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E86A58] hover:bg-[#D35A4A] text-white rounded-2xl font-semibold transition-colors"
              >
                Try Voice Counter Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-[#2C1810]/20 text-[#2C1810] rounded-2xl font-semibold hover:border-[#E86A58]/30 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </section>

        <footer className="border-t border-[#2C1810]/5 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[#2C1810]/65 text-sm">© 2026 MyCrochetKit</span>
            <div className="flex gap-6">
              <Link to="/tools" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm">Free Tools</Link>
              <Link to="/blog" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm">Blog</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
