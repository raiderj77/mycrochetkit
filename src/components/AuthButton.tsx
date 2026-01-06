import { useAuthStore } from '@/stores/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function AuthButton() {
  const { user } = useAuthStore();
  const logout = useAuthStore.getState().signOut;
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return (
      <div className="flex gap-2 items-center">
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 rounded-lg transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white font-bold text-sm">
          {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate max-w-[120px]">
            {user.displayName || user.email?.split('@')[0] || 'User'}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {user.displayName ? user.email?.split('@')[0] : 'Account'}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-neutral-400 hidden sm:block" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 z-50">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="font-medium text-neutral-900 dark:text-neutral-50">
              {user.displayName || 'User'}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              {user.email}
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                navigate('/settings');
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Account Settings
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
