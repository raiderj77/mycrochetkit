import { goToLifetimeCheckout } from '../lib/stripe-client';

interface HeroProps {
  foundersOpen: boolean;
}

export default function Hero({ foundersOpen }: HeroProps) {
  const handleLifetimeCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    goToLifetimeCheckout();
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-20 lg:py-32 transition-colors">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 dark:bg-yellow-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm mb-6 border border-purple-100 dark:border-purple-800 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Founders Circle is Now Open 🧶
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 transition-colors">
              Never Lose Your <span className="text-purple-600 dark:text-purple-400">Place</span> Again
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 transition-colors">
              The only row counter that listens to your voice. Import patterns, track multiple projects, and join 10,000+ crocheters.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={handleLifetimeCheckout}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/20 transform hover:-translate-y-1 transition-all active:scale-95"
              >
                Claim Lifetime Access 🚀
              </button>
              <div className="flex flex-col">
                <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg text-purple-700 dark:text-purple-300 text-sm font-bold flex items-center justify-center gap-2 border border-purple-100 dark:border-purple-800 transition-colors">
                  🎁 BONUS: Free $10 Amazon Gift Card for Every 3 Referrals!
                </div>
                {foundersOpen && (
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400 text-center mt-2 transition-colors">
                    🚀 Founders Launch Pricing: $79.99 (One-time)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative z-10 bg-slate-900 dark:bg-slate-800 rounded-3xl p-4 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-all duration-500 border-8 border-slate-800 dark:border-slate-700">
              <div className="bg-slate-950 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    LISTENING...
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Project</div>
                    <div className="text-white text-xl font-bold">Rainbow Chevron Blanket</div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Current Row</div>
                      <div className="text-6xl font-black text-white italic">
                        42<span className="text-slate-700 not-italic ml-2">/ 120</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">−</div>
                      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">+</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <p className="text-slate-400 text-sm">
                      Try saying: <span className="text-purple-400 font-bold">"Next row"</span> or <span className="text-purple-400 font-bold">"Undo last"</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-purple-600/10 rounded-3xl -z-10 transform lg:rotate-6"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
