import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import { setupOnlineSyncListener } from './services/patternSync';
import { Auth } from './components/Auth';
import { ProjectsList } from './components/ProjectsList';
import { QuickLinks } from './components/QuickLinks';
import { FAQ } from './components/FAQ';
import { trackPageView } from './analytics';
import { SEOHead } from './seo/components/SEOHead';
import { organizationSchema } from './seo/schemas/organization';
import { softwareApplicationSchema } from './seo/schemas/software-application';
import { Mic, ArrowRight, Sparkles, WifiOff, Mail, Play, FileText, Loader2 } from 'lucide-react';
import { addToWaitlist, getWaitlistCount } from './services/waitlistService';

function FoundersEmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'exists' | 'error'>('idle');
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    getWaitlistCount().then(count => {
      if (count > 0) setWaitlistCount(count);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    
    setStatus('loading');
    const result = await addToWaitlist(email, 'founders');
    
    if (result.success) {
      setStatus(result.isNew ? 'success' : 'exists');
      if (result.isNew && waitlistCount !== null) {
        setWaitlistCount(waitlistCount + 1);
      }
    } else {
      setStatus('error');
    }
  };

  const spotsRemaining = waitlistCount !== null ? Math.max(0, 500 - waitlistCount) : 500;
  const spotsUrgency = spotsRemaining < 100 ? 'text-red-500' : spotsRemaining < 250 ? 'text-[#E86A58]' : 'text-[#E86A58]';

  if (status === 'success') {
    return (
      <div className="px-4 py-3 bg-[#7FBFA0]/10 text-[#7FBFA0] rounded-xl text-sm font-medium">
        🎉 You&apos;re on the list! We&apos;ll email you when founders pricing goes live.
      </div>
    );
  }

  if (status === 'exists') {
    return (
      <div className="px-4 py-3 bg-[#B8A9C9]/10 text-[#6B5B7A] rounded-xl text-sm font-medium">
        You&apos;re already on the list! We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {spotsRemaining > 0 && (
        <div className={`${spotsUrgency} text-sm font-medium text-center`}>
          {spotsRemaining} of 500 spots remaining
          {spotsRemaining < 100 && ' — almost gone!'}
        </div>
      )}
      {spotsRemaining === 0 && (
        <div className="text-[#2C1810]/60 text-sm font-medium text-center">
          Founders spots filled! Join waitlist for next batch.
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          className="flex-1 px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto px-5 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
        </button>
        {status === 'error' && (
          <p className="text-red-500 text-xs mt-1 sm:mt-0 sm:ml-2 self-center">Something went wrong. Try again?</p>
        )}
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Pattern sync when coming back online
  useEffect(() => {
    if (!user) return;
    const cleanup = setupOnlineSyncListener(user.uid, (result) => {
      console.log('Pattern sync:', result);
    });
    return cleanup;
  }, [user]);

  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  if (loading) {
    return (
      <>
        <SEOHead
          title="MyCrochetKit - Voice-Activated Crochet Row Counter | Beta"
          description="Stop losing count! Voice-activated row counter for crochet. Currently in beta testing."
          canonicalUrl="https://mycrochetkit.com"
          schema={[organizationSchema, softwareApplicationSchema]}
        />
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#E86A58] to-[#B8A9C9] flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl">🧶</span>
            </motion.div>
            <p className="text-[#2C1810]/70 text-lg">Loading your projects...</p>
          </motion.div>
        </div>
      </>
    );
  }

  // Logged in dashboard
  if (user) {
    return (
      <>
        <SEOHead
          title="MyCrochetKit - Voice-Activated Crochet Row Counter | Beta"
          description="Stop losing count! Voice-activated row counter for crochet. Currently in beta testing."
          canonicalUrl="https://mycrochetkit.com"
          schema={[organizationSchema, softwareApplicationSchema]}
        />
        <div className="dashboard-background min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
            <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-xl">🧶</span>
                </div>
                <span className="font-semibold text-[#2C1810] text-lg tracking-tight">
                  MyCrochetKit
                </span>
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E86A58]/10 text-[#E86A58] text-xs font-medium border border-[#E86A58]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E86A58] animate-pulse"></span>
                Beta
              </span>
              <Auth user={user} setUser={setUser} variant="compact" />
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-6 py-12">
            {/* Welcome */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-3">
                Welcome back, {user.displayName?.split(' ')[0]}
                <motion.span
                  className="inline-block ml-3"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-[#2C1810]/70 text-lg">Ready to keep counting?</p>
            </motion.div>

            <QuickLinks />
            <ProjectsList user={user} />
          </main>

          {/* Footer */}
          <footer className="max-w-5xl mx-auto px-6 py-12 text-center">
            <p className="text-[#2C1810]/75 text-sm mb-2">
              Made with <span className="text-[#E86A58]">♥</span> for crocheters
            </p>
            <Link
              to="/roadmap"
              className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm transition-colors inline-flex items-center gap-1"
            >
              Feature Roadmap <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[#2C1810]/65 mx-3">·</span>
            <a
              href="https://www.reddit.com/r/crochetkitapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm transition-colors inline-flex items-center gap-1"
            >
              Join Community <ArrowRight className="w-3 h-3" />
            </a>
          </footer>
        </div>
      </>
    );
  }

  // Landing page with image background
  return (
    <>
      <SEOHead
        title="MyCrochetKit - Voice-Activated Crochet Row Counter | Beta"
        description="Stop losing count! Voice-activated row counter for crochet. Currently in beta testing."
        canonicalUrl="https://mycrochetkit.com"
        schema={[organizationSchema, softwareApplicationSchema]}
      />
      <div className="hero-background min-h-screen relative">
        {/* Floating yarn decorations */}
        <div className="floating-yarn" aria-hidden="true" />
        <div className="floating-yarn" aria-hidden="true" />
        <div className="floating-yarn" aria-hidden="true" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/60 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg tracking-tight">
                MyCrochetKit
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tools" className="text-[#2C1810]/70 hover:text-[#E86A58] text-sm font-medium transition-colors">
                Free Tools
              </Link>
              <Link to="/blog" className="text-[#2C1810]/70 hover:text-[#E86A58] text-sm font-medium transition-colors">
                Blog
              </Link>
              <Link to="/quick-counter" className="text-[#2C1810]/70 hover:text-[#E86A58] text-sm font-medium transition-colors">
                Quick Counter
              </Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E86A58]/10 text-[#E86A58] text-xs font-medium border border-[#E86A58]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E86A58] animate-pulse"></span>
                Beta
              </span>
            </nav>
            <Auth user={user} setUser={setUser} variant="compact" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-20 pb-8 relative" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="badge badge-success mb-4 mx-auto w-fit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <WifiOff className="w-4 h-4" />
              <span>Works offline</span>
              <Sparkles className="w-4 h-4 text-[#B8A9C9]" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="display-font text-5xl md:text-7xl lg:text-8xl text-[#2C1810] mb-4 leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Stop losing
              <br />
              <span className="gradient-text">count.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-xl md:text-2xl text-[#2C1810]/75 mb-8 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Upload a PDF. We parse it into steps you can actually follow on your phone. Voice-activated counting.
              <span className="text-[#E86A58] font-medium"> Your data, actually safe.</span>
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Auth user={user} setUser={setUser} variant="compact" cta />
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2C1810]/15 text-[#2C1810]/40 font-medium cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[#2C1810]/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[#7FBFA0]">&#10003;</span> No credit card required
              </span>
              <span className="text-[#2C1810]/30">&#183;</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#7FBFA0]">&#10003;</span> Works offline
              </span>
              <span className="text-[#2C1810]/30">&#183;</span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#7FBFA0]">&#10003;</span> Free forever
              </span>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-[#2C1810]/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-[#2C1810]/30 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Pain Points Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              className="display-font text-3xl md:text-4xl text-[#2C1810] text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Sound familiar?
            </motion.h2>

            <div className="space-y-4">
              {[
                {
                  emoji: '😤',
                  text: "You're on row 47. Your phone locks. Wait —",
                  highlight: 'was it 47 or 48?',
                },
                {
                  emoji: '😤',
                  text: 'At the yarn store. No signal.',
                  highlight: 'Buy duplicates anyway.',
                },
                {
                  emoji: '😤',
                  text: 'App updates overnight. Project history:',
                  highlight: 'gone.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="pain-card"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <p className="text-[#2C1810]/70 text-lg">
                    {item.text}{' '}
                    <span className="text-[#E86A58] font-semibold">{item.highlight}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="text-center text-[#2C1810]/60 text-lg mt-10 italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              You shouldn&apos;t need five apps and a spreadsheet to enjoy crocheting.
            </motion.p>
          </div>
        </section>

        {/* Pattern Import Section */}
        <section className="px-6 py-24 bg-[#FFF8F0]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="badge mb-6 w-fit">
                  <FileText className="w-4 h-4 text-[#B8A9C9]" />
                  <span className="text-[#2C1810]/70">Pattern Import</span>
                </div>

                <h2 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-6 leading-tight">
                  Your patterns.
                  <br />
                  <span className="text-[#B8A9C9]">Actually readable.</span>
                </h2>

                <p className="text-[#2C1810]/75 text-lg mb-8">
                  Upload a PDF or paste pattern text — MyCrochetKit parses it into trackable steps.
                  No more zooming and scrolling on your phone. Each round, row, and stitch count is
                  broken out so you can follow along step by step.
                </p>

                <div className="space-y-3">
                  {[
                    'PDF import with automatic step parsing',
                    'Inline abbreviation definitions',
                    'Step-by-step progress tracking',
                    'Works on any pattern format',
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-[#2C1810]/70"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#7FBFA0] text-sm">✓</span>
                      </div>
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Parsed Steps Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="feature-card relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#B8A9C9]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

                  <p className="text-[#2C1810]/50 text-xs font-medium uppercase tracking-wider mb-4">
                    Parsed Pattern
                  </p>

                  <div className="space-y-2.5">
                    {[
                      { step: 'Rnd 1', instruction: '6 sc in magic ring', count: '6' },
                      { step: 'Rnd 2', instruction: 'inc in each st around', count: '12' },
                      { step: 'Rnd 3', instruction: '(sc, inc) x 6', count: '18' },
                      { step: 'Rnd 4', instruction: '(sc 2, inc) x 6', count: '24' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          index === 0
                            ? 'bg-[#B8A9C9]/10 border border-[#B8A9C9]/20'
                            : 'bg-[#2C1810]/[0.03]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-lg ${
                              index === 0
                                ? 'bg-[#B8A9C9]/20 text-[#B8A9C9]'
                                : 'bg-[#2C1810]/[0.06] text-[#2C1810]/50'
                            }`}
                          >
                            {item.step}
                          </span>
                          <span
                            className={`text-sm ${
                              index === 0 ? 'text-[#2C1810]' : 'text-[#2C1810]/70'
                            }`}
                          >
                            {item.instruction}
                          </span>
                        </div>
                        <span
                          className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full ${
                            index === 0
                              ? 'bg-[#7FBFA0]/20 text-[#7FBFA0]'
                              : 'bg-[#2C1810]/[0.06] text-[#2C1810]/40'
                          }`}
                        >
                          ({item.count})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4 flex items-center justify-between text-xs text-[#2C1810]/50">
                    <span>Step 1 of 24</span>
                    <span className="text-[#7FBFA0] font-medium">4%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-[#2C1810]/[0.06] rounded-full overflow-hidden">
                    <div className="h-full w-[4%] bg-[#7FBFA0] rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Voice Feature Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="badge mb-6 w-fit">
                  <Mic className="w-4 h-4 text-[#E86A58]" />
                  <span className="text-[#2C1810]/70">Voice Control</span>
                </div>

                <h2 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-6 leading-tight">
                  <span className="text-[#E86A58]">"Next."</span>
                  <br />
                  Just say it.
                </h2>

                <p className="text-[#2C1810]/75 text-lg mb-8">
                  Keep your hands on your hook. Voice commands count your rows while you crochet. No
                  stopping. No tapping. No losing your place.
                </p>

                <div className="space-y-3">
                  {[
                    'Works offline — even in airplane mode',
                    'Simple commands: "next", "back", "reset"',
                    'Multiple counters per project',
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-[#2C1810]/70"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#7FBFA0]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#7FBFA0] text-sm">✓</span>
                      </div>
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Demo Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="feature-card text-center relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#E86A58]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

                  <p className="text-[#2C1810]/70 text-sm mb-2">Row Counter</p>
                  <div className="display-font text-8xl md:text-9xl text-[#2C1810] mb-6">47</div>

                  {/* Listening indicator */}
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#E86A58]/10 border border-[#E86A58]/20">
                    <div className="sound-wave">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="text-[#E86A58] font-medium text-sm">Listening...</span>
                  </div>

                  <p className="text-[#2C1810]/75 text-sm mt-4">Heard: "next"</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              className="display-font text-3xl md:text-4xl text-[#2C1810] mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Built by crocheters who've been burned too.
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '📱',
                  title: 'Offline-first',
                  desc: 'Your data lives on your device. Works without internet, always.',
                },
                {
                  icon: '🔐',
                  title: 'Your data is yours',
                  desc: "No lock-in. Export anytime. We'll never hold your projects hostage.",
                },
                {
                  icon: '💝',
                  title: 'Free during beta',
                  desc: 'Unlimited projects while we\'re in beta. No bait-and-switch. No surprise paywalls.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="feature-card text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F5E6E0] flex items-center justify-center">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-[#2C1810] font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#2C1810]/70 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders Offer Section */}
        <section className="px-6 py-24 bg-[#FFF8F0]">
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-[#E86A58]/10 text-[#E86A58] text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
                Founders Offer
              </span>
              <h2 className="display-font text-3xl md:text-4xl text-[#2C1810] mb-3">
                Lifetime access. One price.
              </h2>
              <p className="text-[#2C1810]/70">
                Lock in the lowest price we&apos;ll ever offer.
              </p>
            </div>

            <div className="feature-card px-5 py-8 sm:p-8 text-center relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E86A58]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="mb-6">
                <span className="text-[#2C1810]/40 line-through text-lg">$79</span>
                <div className="display-font text-5xl text-[#2C1810] mt-1">
                  $59<span className="text-2xl">.99</span>
                </div>
                <p className="text-[#2C1810]/60 text-sm mt-1">one-time payment</p>
              </div>

              <ul className="text-left space-y-3 mb-8 max-w-xs mx-auto">
                {[
                  'Unlimited projects forever',
                  'Voice counter + all Pro features',
                  'All future updates included',
                  'Priority support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#2C1810]/80 text-sm">
                    <span className="text-[#7FBFA0] flex-shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>

              <FoundersEmailForm />

              <p className="text-[#2C1810]/50 text-xs mt-4">
                Refer a friend and both get 10% off
              </p>
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 bg-white">
          <motion.div
            className="max-w-lg mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-font text-3xl md:text-4xl text-[#2C1810] mb-4">
              Ready to never lose count?
            </h2>
            <p className="text-[#2C1810]/70 text-lg mb-10">
              Join crocheters who&apos;ve made the switch.
            </p>

            <div className="feature-card px-5 py-8 sm:p-10">
              <Auth user={user} setUser={setUser} />
              <p className="text-[#2C1810]/75 text-sm mt-8">
                Free and unlimited during beta.
              </p>
            </div>
          </motion.div>
        </section>

        <FAQ />
        {/* Footer */}
        <footer className="border-t border-[#2C1810]/5 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center">
                    <span className="text-lg">🧶</span>
                  </div>
                  <span className="font-semibold text-[#2C1810]">MyCrochetKit</span>
                </div>
                <p className="text-sm text-[#2C1810]/60">
                  Voice-activated row counter for crocheters. Works offline.
                </p>
              </div>

              {/* Free Tools */}
              <div>
                <h4 className="font-semibold text-[#2C1810] mb-3 text-sm">Free Tools</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/quick-counter" className="text-[#2C1810]/60 hover:text-[#E86A58]">Voice Counter</Link></li>
                  <li><Link to="/stitch-glossary" className="text-[#2C1810]/60 hover:text-[#E86A58]">Stitch Glossary</Link></li>
                  <li><Link to="/yarn-calculator" className="text-[#2C1810]/60 hover:text-[#E86A58]">Yarn Calculator</Link></li>
                  <li><Link to="/hook-converter" className="text-[#2C1810]/60 hover:text-[#E86A58]">Hook Converter</Link></li>
                  <li><Link to="/tools/c2c-generator" className="text-[#2C1810]/60 hover:text-[#E86A58]">C2C Generator</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-[#2C1810] mb-3 text-sm">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/blog" className="text-[#2C1810]/60 hover:text-[#E86A58]">Blog</Link></li>
                  <li><Link to="/vs/ravelry" className="text-[#2C1810]/60 hover:text-[#E86A58]">vs Ravelry</Link></li>
                  <li><Link to="/roadmap" className="text-[#2C1810]/60 hover:text-[#E86A58]">Roadmap</Link></li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h4 className="font-semibold text-[#2C1810] mb-3 text-sm">Community</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="https://www.reddit.com/r/crochetkitapp/" target="_blank" rel="noopener noreferrer" className="text-[#2C1810]/60 hover:text-[#E86A58]">
                      Reddit
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-[#2C1810]/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[#2C1810]/50 text-xs">© 2026 MyCrochetKit. Made with ♥ for crocheters.</p>
              <div className="flex gap-4 text-xs text-[#2C1810]/50">
                <Link to="/tools" className="hover:text-[#E86A58]">All Tools</Link>
                <span>·</span>
                <a href="/llms.txt" className="hover:text-[#E86A58]">llms.txt</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
