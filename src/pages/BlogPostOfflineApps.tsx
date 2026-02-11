import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, Wifi, WifiOff, Check, X, Smartphone } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export function BlogPostOfflineApps() {
  return (
    <>
      <SEOHead
        title="Best Crochet Apps That Work Offline in 2026 (Tested) | MyCrochetKit"
        description="Looking for crochet apps that work without internet? We tested 7 popular apps at yarn stores and craft circles. Here's which ones actually work offline."
        canonicalUrl="https://mycrochetkit.com/blog/best-crochet-apps-offline"
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
              title="Best Crochet Apps That Work Offline"
              description="Tested 7 crochet apps for offline use. Here's which ones actually work."
              variant="popup"
            />
          </div>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 text-sm text-[#2C1810]/60 mb-4">
              <span className="px-3 py-1 bg-[#7FBFA0]/15 text-[#2D7A4F] rounded-full font-medium">
                App Reviews
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Feb 11, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                8 min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6 leading-tight">
              Best Crochet Apps That Work Offline in 2026 (Tested)
            </h1>

            <p className="text-xl text-[#2C1810]/70 leading-relaxed">
              You're at a yarn store. No WiFi. Your pattern is on Ravelry. You can't load it. 
              Sound familiar? I tested 7 crochet apps to find which ones actually work without internet.
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 text-[#2C1810]/80"
            >
              {/* Quick Answer Box */}
              <div className="not-prose p-6 bg-[#7FBFA0]/10 border border-[#7FBFA0]/20 rounded-2xl">
                <h2 className="font-bold text-[#2C1810] mb-3 flex items-center gap-2">
                  <WifiOff className="w-5 h-5 text-[#7FBFA0]" />
                  Quick Answer
                </h2>
                <p className="text-[#2C1810]/70 mb-4">
                  <strong>Best offline crochet app:</strong> MyCrochetKit — works completely offline with voice counting, 
                  pattern tracking, and local data storage. No internet required after initial load.
                </p>
                <Link
                  to="/quick-counter"
                  className="inline-flex items-center gap-2 text-[#7FBFA0] font-medium hover:underline"
                >
                  Try it free (no signup) <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Why Offline Matters for Crocheters</h2>
              
              <p>
                If you've ever been at a yarn store trying to check your stash, at a craft circle without WiFi, 
                or on a long flight with a project, you know the pain. Most crochet apps assume you're always connected.
              </p>

              <p>Here's where offline mode actually matters:</p>

              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1">•</span>
                  <span><strong>Yarn stores</strong> — Check your stash before buying duplicates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1">•</span>
                  <span><strong>Craft circles</strong> — Many community centers have spotty WiFi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1">•</span>
                  <span><strong>Travel</strong> — Planes, trains, cabins without service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1">•</span>
                  <span><strong>Outdoors</strong> — Crocheting in the park or at the beach</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1">•</span>
                  <span><strong>Data limits</strong> — Not everyone has unlimited data</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">How I Tested</h2>

              <p>
                I put my phone in airplane mode and tested each app for 30 minutes. I tried:
              </p>

              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Opening the app cold (not already loaded)</li>
                <li>Viewing saved patterns/projects</li>
                <li>Using the row counter</li>
                <li>Adding notes</li>
                <li>Searching the pattern database</li>
              </ol>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">The Results</h2>

              {/* Comparison Table */}
              <div className="not-prose overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2C1810]/10">
                      <th className="text-left py-3 px-4 font-semibold text-[#2C1810]">App</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#2C1810]">Opens Offline</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#2C1810]">View Projects</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#2C1810]">Row Counter</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#2C1810]">Voice Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C1810]/5">
                    <tr className="bg-[#7FBFA0]/5">
                      <td className="py-3 px-4 font-medium text-[#2C1810]">MyCrochetKit</td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#2C1810]">Ravelry</td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#2C1810]">Ribblr</td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#2C1810]">Stash2Go</td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#2C1810]">Row Counter App</td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#2C1810]">Knit & Crochet Counter</td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><Check className="w-5 h-5 text-[#7FBFA0] mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#2C1810]">LoveCrafts</td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                      <td className="py-3 px-4 text-center"><X className="w-5 h-5 text-[#E86A58]/50 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">App-by-App Breakdown</h2>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">1. MyCrochetKit — Best Overall Offline</h3>
              
              <p>
                MyCrochetKit is built offline-first. Every feature works without internet:
              </p>

              <ul className="space-y-2">
                <li>✅ Voice-activated row counting (uses browser speech API)</li>
                <li>✅ All projects and patterns stored locally</li>
                <li>✅ PDF patterns work offline after import</li>
                <li>✅ Syncs automatically when you're back online</li>
                <li>✅ No account required for basic features</li>
              </ul>

              <p>
                The voice counter is the standout feature. Say "next" to count rows without touching your phone. 
                It works offline because it uses your device's built-in speech recognition.
              </p>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">2. Ravelry — No Offline Support</h3>

              <p>
                Ravelry doesn't work offline at all. In airplane mode, you get a blank screen. 
                Even patterns you've viewed before won't load. This is frustrating because Ravelry has 
                the best pattern database — you just can't access it without WiFi.
              </p>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">3. Stash2Go — Partial Offline</h3>

              <p>
                Stash2Go is a third-party Ravelry client that caches your data. It works offline 
                for viewing your stash and queue, but:
              </p>

              <ul className="space-y-2">
                <li>❌ No row counter</li>
                <li>❌ Pattern PDFs don't cache</li>
                <li>❌ iOS only</li>
                <li>❌ Depends on Ravelry account</li>
              </ul>

              <h3 className="text-xl font-bold text-[#2C1810] mt-8">4. Generic Row Counter Apps — Basic Offline</h3>

              <p>
                Apps like "Row Counter" and "Knit & Crochet Counter" work offline for counting, 
                but they're just counters. No pattern storage, no voice control, no project management.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">My Recommendation</h2>

              <p>
                Use <strong>MyCrochetKit + Ravelry together</strong>:
              </p>

              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Find patterns on Ravelry (when you have WiFi)</li>
                <li>Download the PDF</li>
                <li>Import into MyCrochetKit</li>
                <li>Crochet anywhere — online or offline</li>
              </ol>

              <p>
                This gives you the best of both worlds: Ravelry's massive database for discovery, 
                and MyCrochetKit's offline-first tracking for actually making things.
              </p>

              {/* CTA Box */}
              <div className="not-prose mt-12 p-8 bg-white rounded-3xl border border-[#2C1810]/10 text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-4 text-[#E86A58]" />
                <h3 className="text-2xl font-bold text-[#2C1810] mb-3">
                  Try the Voice Counter Now
                </h3>
                <p className="text-[#2C1810]/70 mb-6">
                  No signup required. Works offline. Just say "next" to count.
                </p>
                <Link
                  to="/quick-counter"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-semibold rounded-xl transition-colors"
                >
                  Try Free Voice Counter <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </motion.div>
          </div>

          {/* Author / Related */}
          <footer className="mt-16 pt-8 border-t border-[#2C1810]/10">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
              <div>
                <p className="text-sm text-[#2C1810]/60 mb-2">Written by</p>
                <p className="font-medium text-[#2C1810]">The MyCrochetKit Team</p>
              </div>
              <ShareButtons
                title="Best Crochet Apps That Work Offline"
                variant="inline"
              />
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-[#2C1810] mb-4">Related Articles</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/blog/how-to-never-lose-row-count-crochet"
                  className="p-4 bg-white rounded-xl border border-[#2C1810]/5 hover:border-[#E86A58]/20 transition-colors"
                >
                  <p className="font-medium text-[#2C1810]">How to Never Lose Your Row Count Again</p>
                  <p className="text-sm text-[#2C1810]/60 mt-1">5 methods compared</p>
                </Link>
                <Link
                  to="/vs/ravelry"
                  className="p-4 bg-white rounded-xl border border-[#2C1810]/5 hover:border-[#E86A58]/20 transition-colors"
                >
                  <p className="font-medium text-[#2C1810]">MyCrochetKit vs Ravelry</p>
                  <p className="text-sm text-[#2C1810]/60 mt-1">Complete comparison</p>
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
