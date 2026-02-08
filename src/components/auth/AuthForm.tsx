import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../../firebase';
import { EmailAuthForm } from './EmailAuthForm';
import { PhoneAuthForm } from './PhoneAuthForm';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  onSuccess: (user: User) => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSuccess(result.user);
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Google Sign-In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E86A58] to-[#D35A4A] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#fff"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fff"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#fff"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-[#2C1810]/10" />
        <span className="text-[#2C1810]/40 text-sm">or</span>
        <div className="flex-1 h-px bg-[#2C1810]/10" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#2C1810]/5 rounded-xl mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'email'
              ? 'bg-white text-[#2C1810] shadow-sm'
              : 'text-[#2C1810]/50 hover:text-[#2C1810]/70'
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('phone')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'phone'
              ? 'bg-white text-[#2C1810] shadow-sm'
              : 'text-[#2C1810]/50 hover:text-[#2C1810]/70'
          }`}
        >
          Phone
        </button>
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {activeTab === 'email' ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
          >
            <EmailAuthForm onSuccess={onSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            <PhoneAuthForm onSuccess={onSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
