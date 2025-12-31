import { Suspense } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { DesktopNav, MobileNav } from '@/components/ui/Navigation';
import { goToLifetimeCheckout } from '@/lib/stripe-client';
import { ChevronRight, Home } from 'lucide-react';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex px-4 py-2 text-neutral-500 text-xs font-medium" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/dashboard" className="hover:text-primary-600 flex items-center gap-1">
            <Home className="h-3 w-3" />
            Dash
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="h-3 w-3 mx-1 text-neutral-400" />
              {last ? (
                <span className="text-neutral-900 dark:text-neutral-100 capitalize">
                  {value.replace(/-/g, ' ')}
                </span>
              ) : (
                <Link to={to} className="hover:text-primary-600 capitalize">
                  {value.replace(/-/g, ' ')}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500 overflow-hidden">
      {/* Desktop Sidebar */}
      <DesktopNav />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-12 border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 flex items-center justify-between px-2 shrink-0 z-20">
          <Breadcrumbs />
          <div className="flex items-center gap-4 px-4">
            {/* Contextual actions could go here */}
          </div>
        </header>

        {/* Global Banner */}
        <div className="bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 py-1.5 text-center font-bold text-[11px] shadow-inner relative z-10 transition-colors shrink-0">
          🎁 Launch Special: Get a $10 Amazon Gift Card for referrals! 
          <button 
            onClick={goToLifetimeCheckout}
            className="ml-2 underline hover:text-yellow-700 font-black uppercase"
          >
            Claim Now &rarr;
          </button>
        </div>

        {/* Dynamic Page Content */}
        <main id="main-content" className="flex-1 overflow-y-auto pb-16 md:pb-0 scroll-smooth">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-4xl" role="status" aria-live="polite">
                    🧶
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
                </div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
