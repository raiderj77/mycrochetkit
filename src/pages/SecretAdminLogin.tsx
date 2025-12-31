import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function SecretAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const ADMIN_EMAILS = ['support@mycrochetkit.com']; // Sync with Admin.tsx

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        navigate('/manage-kit-77'); // Secret Dashboard Route
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!ADMIN_EMAILS.includes(email)) {
        throw new Error('Unauthorized access attempt.');
      }
      await useAuthStore.getState().signIn(email, password);
      navigate('/manage-kit-77');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Login failed');
      // If it's an unauthorized attempt, we might want to log it or just stay quiet
      console.warn('Admin login attempt failed:', email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
             <ShieldCheck className="h-8 w-8 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Access</h1>
          <p className="mt-2 text-slate-500 text-sm font-medium uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Admin ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@system.admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black tracking-widest uppercase transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Initiate Session
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600 font-bold uppercase tracking-widest">
           Secure Transaction Node • MCK-v2.0
        </p>
      </div>
    </div>
  );
}
