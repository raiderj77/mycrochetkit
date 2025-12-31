import { ArrowRight, Star, Gift, Layout, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export default function Welcome() {
  const { user } = useAuthStore();
  const isNewUser = !user;

  useEffect(() => {
    // Check if the user just arrived from a successful checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      // Confetti logic could go here
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Success Branding */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            PAYMENT SUCCESSFUL
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-white dark:to-slate-400 bg-clip-text text-transparent">
            Welcome to the <br />
            <span className="text-purple-600 dark:text-purple-400">Founders Circle.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            You're now a Lifetime Pro member of My Crochet Kit. You've locked in everything we ever build, forever.
          </p>
        </div>

        {/* Steps for Guest vs Auth */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-purple-600 dark:hover:border-purple-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gift className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Refer friends, get paid</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
              For every 3 friends who join using your link, we'll send you a <span className="text-emerald-600 dark:text-emerald-400 font-bold">$10 Amazon Gift Card</span>.
            </p>
            <Link to="/referrals" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
              Get your referral link
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-emerald-600 dark:hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layout className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Start your first project</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
              Jump into the dashboard to start tracking with voice-activated counters and cloud sync.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Guest Action Card */}
        {isNewUser && (
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-8 md:p-12 text-center animate-pulse-subtle transition-colors">
            <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Final Step: Claim Your Account</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              Since you're a new member, you need to create your login details to access your Lifetime Pro features. 
              <strong> Use the same email you used for payment!</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup?tier=lifetime" 
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-full hover:opacity-90 transition-all shadow-xl"
              >
                Create My Account 🚀
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-10 py-4 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {!isNewUser && (
          <div className="text-center">
             <Link 
                to="/dashboard" 
                className="px-12 py-5 bg-purple-600 text-white font-black text-xl rounded-full hover:bg-purple-700 transition-all shadow-xl hover:shadow-purple-500/20"
              >
                Launch App 🧶
              </Link>
          </div>
        )}

        <div className="mt-20 flex flex-col items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-colors">
          <p className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-white">Verified Secure by Stripe</p>
          <div className="flex gap-4">
             <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
             <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
             <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
             <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
             <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
