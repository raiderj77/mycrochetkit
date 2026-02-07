import { signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { events } from '../analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AuthProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export function Auth({ user, setUser }: AuthProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      events.signUp();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowDropdown(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-2 py-1.5 rounded-full bg-white border border-[#2C1810]/10 hover:border-[#2C1810]/20 transition-all shadow-sm"
          whileTap={{ scale: 0.98 }}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full ring-2 ring-[#E86A58]/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E86A58] to-[#B8A9C9] flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.displayName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <span className="text-[#2C1810] text-sm font-medium hidden sm:inline pr-1">
            {user.displayName?.split(' ')[0]}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#2C1810]/50 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#2C1810]/10 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-[#2C1810]/5">
                <p className="text-[#2C1810] text-sm font-medium truncate">{user.displayName}</p>
                <p className="text-[#2C1810]/50 text-xs truncate">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 flex items-center gap-3 text-[#2C1810]/70 hover:bg-[#E86A58]/5 hover:text-[#E86A58] transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleSignIn}
      className="btn-primary flex items-center gap-3"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
    </motion.button>
  );
}
