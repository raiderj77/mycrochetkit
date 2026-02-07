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
import { Mic, Zap, Cloud, Heart, ArrowRight, Sparkles, WifiOff } from 'lucide-react';

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
            <p className="text-[#2C1810]/50 text-lg">Loading your projects...</p>
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
              <Auth user={user} setUser={setUser} />
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
              <p className="text-[#2C1810]/50 text-lg">Ready to keep counting?</p>
            </motion.div>

            <QuickLinks />
            <ProjectsList user={user} />
          </main>

          {/* Footer */}
          <footer className="max-w-5xl mx-auto px-6 py-12 text-center">
            <p className="text-[#2C1810]/30 text-sm mb-2">
              Made with <span className="text-[#E86A58]">♥</span> for crocheters
            </p>
            <Link
              to="/roadmap"
              className="text-[#2C1810]/40 hover:text-[#E86A58] text-sm transition-colors inline-flex items-center gap-1"
            >
              Feature Roadmap <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-[#2C1810]/20 mx-3">·</span>
            <a
              href="https://www.reddit.com/r/crochetkitapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2C1810]/40 hover:text-[#E86A58] text-sm transition-colors inline-flex items-center gap-1"
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
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E86A58]/10 text-[#E86A58] text-xs font-medium border border-[#E86A58]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E86A58] animate-pulse"></span>
              Beta
            </span>
            <Auth user={user} setUser={setUser} />
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32 relative">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="badge badge-success mb-8 mx-auto w-fit"
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
              className="display-font text-5xl md:text-7xl lg:text-8xl text-[#2C1810] mb-6 leading-[1.1]"
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
              className="text-xl md:text-2xl text-[#2C1810]/60 mb-12 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Voice-activated counters. Bulletproof project tracking.
              <span className="text-[#E86A58] font-medium"> Your data, actually safe.</span>
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Auth user={user} setUser={setUser} />
            </motion.div>

            {/* Trust badges */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 text-sm text-[#2C1810]/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#B8A9C9]" /> No credit card
              </span>
              <span className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#7FBFA0]" /> Works offline
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#E86A58]" /> Currently in beta
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
          </div>
        </section>

        {/* Voice Feature Section */}
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
                  <Mic className="w-4 h-4 text-[#E86A58]" />
                  <span className="text-[#2C1810]/70">Voice Control</span>
                </div>

                <h2 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-6 leading-tight">
                  <span className="text-[#E86A58]">"Next."</span>
                  <br />
                  Just say it.
                </h2>

                <p className="text-[#2C1810]/60 text-lg mb-8">
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

                  <p className="text-[#2C1810]/50 text-sm mb-2">Row Counter</p>
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

                  <p className="text-[#2C1810]/30 text-sm mt-4">Heard: "next"</p>
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
                  title: 'Generous free tier',
                  desc: '3 projects free forever. No bait-and-switch. No surprise paywalls.',
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
                  <p className="text-[#2C1810]/50 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 bg-[#FFF8F0]">
          <motion.div
            className="max-w-lg mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-font text-3xl md:text-4xl text-[#2C1810] mb-4">
              Ready to never lose count?
            </h2>
            <p className="text-[#2C1810]/50 text-lg mb-10">
              Join crocheters who've made the switch.
            </p>

            <div className="feature-card p-10">
              <Auth user={user} setUser={setUser} />
              <p className="text-[#2C1810]/30 text-sm mt-8">
                Start free. Upgrade when you need more.
              </p>
            </div>
          </motion.div>
        </section>

        <FAQ />
        {/* Footer */}
        <footer className="border-t border-[#2C1810]/5 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center">
                <span className="text-sm">🧶</span>
              </div>
              <span className="text-[#2C1810]/40 text-sm">MyCrochetKit</span>
            </div>
            <a
              href="https://www.reddit.com/r/crochetkitapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2C1810]/40 hover:text-[#E86A58] text-sm transition-colors inline-flex items-center gap-1"
            >
              Join Community <ArrowRight className="w-3 h-3" />
            </a>
            <Link
              to="/roadmap"
              className="text-[#2C1810]/40 hover:text-[#E86A58] text-sm transition-colors inline-flex items-center gap-1"
            >
              Feature Roadmap <ArrowRight className="w-3 h-3" />
            </Link>
            <p className="text-[#2C1810]/30 text-xs">© 2026 MyCrochetKit</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
