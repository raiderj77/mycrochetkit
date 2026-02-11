import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, Mic, Volume2, VolumeX, Hand } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';
import { ShareButtons } from '../components/ShareButtons';

export function BlogPostVoiceCounter() {
  return (
    <>
      <SEOHead
        title="Free Voice-Activated Row Counter for Crochet (No App Download) | MyCrochetKit"
        description="Count crochet rows with your voice — say 'next' to count. Free, works offline, no download required. Keep your hands on your hook, not your phone."
        canonicalUrl="https://mycrochetkit.com/blog/free-voice-activated-row-counter-crochet"
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
              title="Free Voice-Activated Row Counter for Crochet"
              description="Count rows by voice - just say 'next'. Free, works offline."
              variant="popup"
            />
          </div>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 text-sm text-[#2C1810]/60 mb-4">
              <span className="px-3 py-1 bg-[#E86A58]/10 text-[#E86A58] rounded-full font-medium">
                Tools
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Feb 11, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                5 min read
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6 leading-tight">
              Free Voice-Activated Row Counter for Crochet
            </h1>

            <p className="text-xl text-[#2C1810]/70 leading-relaxed">
              Stop putting down your hook to tap your phone. Just say "next" and keep crocheting. 
              Here's how to use MyCrochetKit's free voice counter.
            </p>
          </header>

          {/* Quick Try Button */}
          <div className="not-prose mb-12 p-6 bg-[#E86A58] rounded-3xl text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Try It Right Now</h2>
            <p className="text-white/80 mb-4">No signup. No download. Works in your browser.</p>
            <Link
              to="/quick-counter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E86A58] font-semibold rounded-xl hover:bg-white/90 transition-colors"
            >
              <Mic className="w-5 h-5" />
              Open Voice Counter
            </Link>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-[#2C1810]/80 leading-relaxed"
            >
              <h2 className="text-2xl font-bold text-[#2C1810]">Why Voice Counting?</h2>

              <p>
                Every crocheter knows the frustration: you're in the zone, your tension is perfect, 
                you're making great progress... then you need to tap your phone to count a row.
              </p>

              <p>
                You put down your hook. Pick up your phone. Unlock it. Find the app. Tap the button. 
                Put down the phone. Pick up your hook. Try to remember where you were.
              </p>

              <div className="not-prose p-6 bg-[#B8A9C9]/10 rounded-2xl my-8">
                <div className="flex items-center gap-4">
                  <Hand className="w-12 h-12 text-[#B8A9C9]" />
                  <div>
                    <p className="font-semibold text-[#2C1810]">The problem with tap-to-count:</p>
                    <p className="text-[#2C1810]/70">You lose your rhythm, your tension changes, and it takes longer to get back in the flow.</p>
                  </div>
                </div>
              </div>

              <p>
                Voice counting solves this. Your phone listens. You say "next" when you finish a row. 
                Your hands never leave your work.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">How It Works</h2>

              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#E86A58] text-white flex items-center justify-center font-bold flex-shrink-0">1</span>
                  <div>
                    <p className="font-semibold text-[#2C1810]">Open the counter</p>
                    <p className="text-[#2C1810]/70">Go to <Link to="/quick-counter" className="text-[#E86A58] hover:underline">mycrochetkit.com/quick-counter</Link> or tap the mic button on any project.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#E86A58] text-white flex items-center justify-center font-bold flex-shrink-0">2</span>
                  <div>
                    <p className="font-semibold text-[#2C1810]">Tap the microphone</p>
                    <p className="text-[#2C1810]/70">Your browser will ask for microphone permission. Allow it once, and you're set.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#E86A58] text-white flex items-center justify-center font-bold flex-shrink-0">3</span>
                  <div>
                    <p className="font-semibold text-[#2C1810]">Start crocheting</p>
                    <p className="text-[#2C1810]/70">When you finish a row, just say "next." The counter updates automatically.</p>
                  </div>
                </li>
              </ol>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Voice Commands</h2>

              <div className="not-prose overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2C1810]/10">
                      <th className="text-left py-3 px-4 font-semibold text-[#2C1810]">Say This</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#2C1810]">What Happens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C1810]/5">
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#E86A58]">"next"</td>
                      <td className="py-3 px-4 text-[#2C1810]/70">+1 row (or your custom increment)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#E86A58]">"back"</td>
                      <td className="py-3 px-4 text-[#2C1810]/70">-1 row (undo a mistake)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#E86A58]">"reset"</td>
                      <td className="py-3 px-4 text-[#2C1810]/70">Back to zero</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#E86A58]">"stop"</td>
                      <td className="py-3 px-4 text-[#2C1810]/70">Stop listening</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#E86A58]">"add 5"</td>
                      <td className="py-3 px-4 text-[#2C1810]/70">+5 rows</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#E86A58]">"set 47"</td>
                      <td className="py-3 px-4 text-[#2C1810]/70">Jump to row 47</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4">
                Alternatives also work: "up" instead of "next", "down" instead of "back", "undo" for mistakes.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Does It Work Offline?</h2>

              <p>
                <strong>Yes!</strong> The voice recognition uses your device's built-in speech-to-text. 
                It doesn't send audio to any server. This means:
              </p>

              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-1" />
                  <span>Works in airplane mode</span>
                </li>
                <li className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-1" />
                  <span>Works without WiFi</span>
                </li>
                <li className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-[#7FBFA0] flex-shrink-0 mt-1" />
                  <span>Your audio stays private</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Which Browsers Support It?</h2>

              <div className="not-prose grid grid-cols-2 gap-4 my-8">
                <div className="p-4 bg-white rounded-xl border border-[#7FBFA0]/30">
                  <p className="font-semibold text-[#2C1810] mb-2 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#7FBFA0]" />
                    Supported
                  </p>
                  <ul className="text-sm text-[#2C1810]/70 space-y-1">
                    <li>Chrome (desktop & mobile)</li>
                    <li>Edge (desktop & mobile)</li>
                    <li>Safari (iOS 14.5+)</li>
                    <li>Samsung Internet</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E86A58]/20">
                  <p className="font-semibold text-[#2C1810] mb-2 flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-[#E86A58]/50" />
                    Limited Support
                  </p>
                  <ul className="text-sm text-[#2C1810]/70 space-y-1">
                    <li>Firefox (desktop only)</li>
                    <li>Older iOS versions</li>
                  </ul>
                </div>
              </div>

              <p>
                If your browser doesn't support voice, you can still use the tap buttons — they work everywhere.
              </p>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Tips for Best Results</h2>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1 font-bold">1.</span>
                  <span><strong>Speak clearly but casually.</strong> You don't need to shout. A normal speaking voice works fine.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1 font-bold">2.</span>
                  <span><strong>Reduce background noise.</strong> TV in the background? The counter might hear words that sound like commands.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1 font-bold">3.</span>
                  <span><strong>Keep your phone close.</strong> 2-4 feet away is ideal. Don't bury it under yarn!</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E86A58] mt-1 font-bold">4.</span>
                  <span><strong>Check the "last heard" display.</strong> If it's mishearing you, you'll know immediately.</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-[#2C1810] mt-12">Frequently Asked Questions</h2>

              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-bold text-[#2C1810]">Is it really free?</h3>
                  <p>Yes. The voice counter is completely free with no limits. No account required.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810]">Do you record my voice?</h3>
                  <p>No. All speech recognition happens on your device. We never receive any audio.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810]">Does it drain my battery?</h3>
                  <p>Slightly more than a screen-off app, but less than you'd expect. The speech API is optimized.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810]">Can I use it while watching TV?</h3>
                  <p>Yes, but be aware it might pick up words from the TV. Pausing during dialogue-heavy scenes helps.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810]">What if I say "next" in conversation?</h3>
                  <p>It will count. You can say "back" to undo, or tap "stop listening" when you need to chat.</p>
                </div>
              </div>

              {/* CTA Box */}
              <div className="not-prose mt-12 p-8 bg-white rounded-3xl border border-[#2C1810]/10 text-center">
                <Mic className="w-12 h-12 mx-auto mb-4 text-[#E86A58]" />
                <h3 className="text-2xl font-bold text-[#2C1810] mb-3">
                  Ready to try it?
                </h3>
                <p className="text-[#2C1810]/70 mb-6">
                  No download. No signup. Just open and start counting.
                </p>
                <Link
                  to="/quick-counter"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-semibold rounded-xl transition-colors"
                >
                  Open Voice Counter <ArrowRight className="w-5 h-5" />
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
                title="Free Voice-Activated Row Counter"
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
                  <p className="font-medium text-[#2C1810]">How to Never Lose Your Row Count</p>
                  <p className="text-sm text-[#2C1810]/60 mt-1">5 methods compared</p>
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
