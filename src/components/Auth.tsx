import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { events } from '../analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AuthForm } from './auth/AuthForm';
import { AuthModal } from './auth/AuthModal';

interface AuthProps {
  user: User | null;
  setUser: (user: User | null) => void;
  variant?: 'compact' | 'inline';
}

function getDisplayName(user: User): string {
  return user.displayName || user.email?.split('@')[0] || user.phoneNumber || 'User';
}

function getDisplayDetail(user: User): string {
  return user.email || user.phoneNumber || '';
}

export function Auth({ user, setUser, variant = 'inline' }: AuthProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowDropdown(false);
      events.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    events.signUp();
  };

  // Signed-in: profile dropdown
  if (user) {
    const displayName = getDisplayName(user);
    const displayDetail = getDisplayDetail(user);

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
              alt={displayName}
              className="w-8 h-8 rounded-full ring-2 ring-[#E86A58]/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E86A58] to-[#B8A9C9] flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-[#2C1810] text-sm font-medium hidden sm:inline pr-1">
            {displayName.split(' ')[0]}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#2C1810]/70 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
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
                <p className="text-[#2C1810] text-sm font-medium truncate">{displayName}</p>
                {displayDetail && (
                  <p className="text-[#2C1810]/70 text-xs truncate">{displayDetail}</p>
                )}
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

  // Signed-out: compact → button that opens modal
  if (variant === 'compact') {
    return (
      <>
        <motion.button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-white border border-[#2C1810]/10 hover:border-[#E86A58]/30 text-[#2C1810] text-sm font-medium transition-colors shadow-sm"
          whileTap={{ scale: 0.98 }}
        >
          Sign in
        </motion.button>
        <AuthModal open={showModal} onClose={() => setShowModal(false)} setUser={setUser} />
      </>
    );
  }

  // Signed-out: inline → full auth form
  return (
    <div className="w-full max-w-sm">
      <AuthForm onSuccess={handleAuthSuccess} />
    </div>
  );
}
