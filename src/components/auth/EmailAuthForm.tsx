import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../../firebase';
import { Mail, Lock, Loader2 } from 'lucide-react';

interface EmailAuthFormProps {
  onSuccess: (user: User) => void;
}

function mapError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function EmailAuthForm({ onSuccess }: EmailAuthFormProps) {
  const [mode, setMode] = useState<'signIn' | 'createAccount'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'createAccount') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {
          displayName: email.split('@')[0],
        });
        onSuccess(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(result.user);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(mapError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      {error && (
        <div className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C1810]/30" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C1810]/30" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : mode === 'createAccount' ? (
          'Create Account'
        ) : (
          'Sign In'
        )}
      </button>

      <p className="text-center text-sm text-[#2C1810]/60">
        {mode === 'signIn' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('createAccount');
                setError(null);
              }}
              className="text-[#E86A58] font-medium hover:underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('signIn');
                setError(null);
              }}
              className="text-[#E86A58] font-medium hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}
