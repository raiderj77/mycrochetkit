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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧶</span>
          <span className="font-bold text-lg text-white">MyCrochetKit</span>
        </div>
        <Auth user={user} setUser={setUser} />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 py-12">
        {user ? (
          <div className="text-center animate-[fadeIn_0.3s_ease-out]">
            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user.displayName?.split(' ')[0]}! 👋
              </h2>
              <p className="text-white/60">Ready to continue your project?</p>
            </div>

            {/* Quick Action Card */}
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

            {/* Stats Preview */}
            <div className="mt-8 flex gap-4 justify-center">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#4ade80]">∞</div>
                <div className="text-xs text-white/50">Counters</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#4ade80]">☁️</div>
                <div className="text-xs text-white/50">Auto-Saved</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#4ade80]">🎤</div>
                <div className="text-xs text-white/50">Voice</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-md mx-auto animate-[fadeIn_0.3s_ease-out]">
            {/* Hero */}
            <div className="text-5xl mb-6">🧶</div>
            <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight">
              Never Lose Your
              <span className="bg-gradient-to-r from-[#4ade80] to-emerald-400 bg-clip-text text-transparent"> Place </span>
              Again
            </h1>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Voice-activated row counter for crocheters. 
              Hands-free counting that actually works.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xl mb-1">🎤</div>
                <div className="text-xs text-white/70">Voice Control</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xl mb-1">☁️</div>
                <div className="text-xs text-white/70">Cloud Sync</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-xl mb-1">📱</div>
                <div className="text-xs text-white/70">Mobile First</div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-white/70 text-sm mb-4">Sign in to get started</p>
              <div className="flex justify-center">
                <Auth user={user} setUser={setUser} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/30 text-sm">
        Made with 💚 for crocheters
      </footer>
    </div>
  );
}

export default App;
