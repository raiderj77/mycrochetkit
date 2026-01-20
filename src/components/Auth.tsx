import { signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export function Auth({ user, setUser }: AuthProps) {
  
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-full">
        <img 
          src={user.photoURL || ''} 
          alt="" 
          className="w-7 h-7 rounded-full"
        />
        <span className="text-white text-sm max-w-[70px] truncate hidden sm:inline">
          {user.displayName?.split(' ')[0]}
        </span>
        <button 
          onClick={handleSignOut}
          className="px-3 py-1 bg-white/20 rounded-full text-white text-xs hover:bg-white/30 transition-colors"
        >
          Out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-800 hover:scale-105 transition-transform active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5c3.3 6.5 10 11 17.8 11z"/>
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.7-.4-3.9z"/>
      </svg>
      Sign In
    </button>
  );
}
