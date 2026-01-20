import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import { Auth } from './components/Auth';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="animate-pulse text-white/70 text-lg">Loading...</div>
      </div>
    );
  }

  // Logged in view
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <header className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧶</span>
            <span className="font-bold text-lg text-white">MyCrochetKit</span>
          </div>
          <Auth user={user} setUser={setUser} />
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user.displayName?.split(' ')[0]}! 👋
              </h2>
              <p className="text-white/60">Ready to continue your project?</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 max-w-sm mx-auto">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold text-white mb-2">Voice Counter</h3>
              <p className="text-white/60 text-sm mb-6">
                Hands-free row counting with voice commands
              </p>
              <a 
                href="/counter" 
                className="inline-block px-6 py-3 bg-[#4ade80] text-[#1a1a2e] font-semibold rounded-full transition-transform hover:scale-105 active:scale-95"
              >
                Open Counter
              </a>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#4ade80]">✓</div>
                <div className="text-xs text-white/50">Offline Ready</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#4ade80]">☁️</div>
                <div className="text-xs text-white/50">Auto-Synced</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#4ade80]">🎤</div>
                <div className="text-xs text-white/50">Voice</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Landing page for logged out users
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧶</span>
          <span className="font-bold text-lg text-white">MyCrochetKit</span>
        </div>
        <Auth user={user} setUser={setUser} />
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-8 pb-16 max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Stop losing count.
        </h1>
        <p className="text-xl text-white/70 mb-8 leading-relaxed">
          Voice-activated counters. Bulletproof project tracking. 
          <span className="text-[#4ade80]"> Your data, actually safe.</span>
        </p>
        
        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <Auth user={user} setUser={setUser} />
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50">
          <span className="flex items-center gap-1">✓ No credit card</span>
          <span className="flex items-center gap-1">✓ Works offline</span>
          <span className="flex items-center gap-1">✓ Free to start</span>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="px-4 py-12 bg-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Sound familiar?</h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">😤</span>
              <p className="text-white/80">
                You're on row 47. Your phone locks. You tap to unlock. Wait — <span className="text-[#fbbf24]">was it 47 or 48?</span>
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">😤</span>
              <p className="text-white/80">
                You're at the yarn store. No signal. Can't check your project. <span className="text-[#fbbf24]">Buy duplicates anyway.</span>
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">😤</span>
              <p className="text-white/80">
                Your app updates overnight. Your entire project history: <span className="text-[#fbbf24]">gone.</span>
              </p>
            </div>
          </div>
          
          <p className="text-center text-white/60 mt-8 text-lg">
            You shouldn't need five apps and a spreadsheet to enjoy crocheting.
          </p>
        </div>
      </section>

      {/* Voice Counter Feature */}
      <section className="px-4 py-16 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4ade80]/20 rounded-full mb-4">
            <span className="text-3xl">🎤</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">"Next row." Just say it.</h2>
          <p className="text-white/70 text-lg">
            Keep your hands on your hook. Our voice recognition counts your rows while you crochet. 
            No stopping. No tapping. No losing your place.
          </p>
        </div>
        
        {/* Feature checklist */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[#4ade80]">✓</span>
            <span className="text-white/80">Works offline — even in airplane mode</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4ade80]">✓</span>
            <span className="text-white/80">Simple commands: "next", "back", "reset"</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4ade80]">✓</span>
            <span className="text-white/80">Multiple counters per project</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4ade80]">✓</span>
            <span className="text-white/80">Auto-syncs when you're back online</span>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-12 bg-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Built by crocheters who've been burned too.</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-white mb-2">Offline-first</h3>
              <p className="text-white/60 text-sm">Your data lives on your device first. Works without internet.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-white mb-2">Your data is yours</h3>
              <p className="text-white/60 text-sm">No lock-in. Export anytime. We don't sell your info.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-semibold text-white mb-2">Generous free tier</h3>
              <p className="text-white/60 text-sm">3 projects free forever. Pro unlocks unlimited.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to never lose count again?</h2>
        <p className="text-white/60 mb-8">Join crocheters who've made the switch.</p>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <Auth user={user} setUser={setUser} />
          <p className="text-white/40 text-xs mt-4">Start free. Upgrade when you need more.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/10">
        <p className="text-white/30 text-sm">Made with 💚 for crocheters</p>
        <p className="text-white/20 text-xs mt-2">© 2025 MyCrochetKit</p>
      </footer>
    </div>
  );
}

export default App;
