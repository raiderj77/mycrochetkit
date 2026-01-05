/**
 * Marketing Layout - Global wrapper for landing and auth pages
 * 
 * Provides consistent header with theme toggle across public marketing routes
 */

import { Outlet, NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";
import { AuthButton } from '@/components/AuthButton';

export default function MarketingLayout() {
  const { pathname } = useLocation();

  return (
    <div className="app-shell transition-colors duration-500 min-h-screen flex flex-col">
      <header className="site-header border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg">
            <span aria-hidden="true">🧶</span> My Crochet Kit
          </NavLink>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/blog" className={({ isActive }) => isActive ? "text-primary-600 font-medium" : "text-neutral-600 hover:text-primary-600 transition-colors"}>
              Blog
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => isActive ? "text-primary-600 font-medium" : "text-neutral-600 hover:text-primary-600 transition-colors"}>
              Pricing
            </NavLink>
            <NavLink to="/login" className="text-neutral-600 hover:text-primary-600 transition-colors font-medium">
              Sign In
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NavLink 
              to="/signup" 
              className="hidden sm:block bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors"
            >
              Start Free
            </NavLink>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white dark:bg-slate-950 transition-colors duration-500">
        <Outlet />
      </main>

      {!pathname.startsWith('/blog') && <Footer />}
    </div>
  );
}
