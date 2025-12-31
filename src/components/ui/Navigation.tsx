import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  BookOpen, 
  Settings,
  Trophy,
  Calculator,
  Users,
  LogOut,
  LogIn,
  Book,
  ShoppingCart,
  Map,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import ThemeToggle from '../ThemeToggle';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/patterns', icon: BookOpen, label: 'Patterns' },
  { to: '/calculator', icon: Calculator, label: 'Calculator' },
  { to: '/finished', icon: Trophy, label: 'Finished' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
  { to: '/glossary', icon: Book, label: 'Glossary' },
  { to: '/blog', icon: BookOpen, label: 'Blog' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

// Desktop Navigation
export function DesktopNav() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === 'true';
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav 
      className={`hidden md:flex flex-col border-r border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 transition-transform active:scale-95"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <button
        onClick={() => navigate('/')}
        className={`flex h-16 items-center border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all cursor-pointer overflow-hidden ${
          isCollapsed ? 'justify-center px-0' : 'gap-3 px-6'
        }`}
      >
        <span className="text-2xl" aria-hidden="true">🧶</span>
        {!isCollapsed && <h1 className="text-lg font-bold truncate">My Crochet Kit</h1>}
      </button>
      
      <div className="flex-1 space-y-1 p-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <div key={item.to} className="relative group">
            <NavLink
              to={item.to}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) =>
                `flex items-center rounded-lg font-medium transition-all ${
                  isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-50'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`
              }
            >
              <item.icon className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : ''}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && hoveredItem === item.to && (
                <div className="absolute left-full ml-2 z-[60] px-2 py-1 bg-neutral-900 text-white text-xs rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-left-1">
                  {item.label}
                </div>
              )}
            </NavLink>
          </div>
        ))}
        
        <div className={`pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center justify-between ${isCollapsed ? 'px-0' : 'px-4 py-2'}`}>
            {!isCollapsed && <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Theme</span>}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className={`border-t border-neutral-200 dark:border-neutral-700 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {user ? (
          <div className={`flex items-center justify-between rounded-lg bg-neutral-50 dark:bg-neutral-900 p-2 ${isCollapsed ? 'flex-col gap-4' : ''}`}>
            <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {user.displayName?.[0] || 'U'}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className={`text-neutral-500 hover:text-red-600 transition-colors ${isCollapsed ? 'p-1' : ''}`}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={`flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 transition-colors ${
              isCollapsed ? 'p-3' : 'px-4 py-2'
            }`}
            title="Sign In"
          >
            <LogIn className="h-4 w-4" />
            {!isCollapsed && <span>Sign In</span>}
          </NavLink>
        )}
      </div>
    </nav>
  );
}

// Mobile Navigation
export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 md:hidden overflow-x-auto">
      <div className="flex justify-between p-2 min-w-max">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg p-2 min-w-[64px] text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="flex flex-col items-center justify-center min-w-[64px] p-2">
          <ThemeToggle />
          <span className="text-[10px] font-medium text-neutral-500 mt-1">Theme</span>
        </div>
      </div>
    </nav>
  );
}
