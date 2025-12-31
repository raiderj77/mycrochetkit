/**
 * Footer Component
 * Legal links and company info for public pages
 */

import { Link, useLocation } from 'react-router-dom';
import { goToLifetimeCheckout } from '../lib/stripe-client';

export default function Footer() {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();
  
  // Hide footer on blog post sub-paths to avoid double footer with static blog posts,
  // but keep it on the main /blog listing page.
  if (pathname.startsWith('/blog/') || pathname.endsWith('.html')) {
    return null;
  }
  
  return (
    <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-50">
              My Crochet Kit
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The PWA for crocheters who are tired of losing count.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900 dark:text-neutral-50">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Blog
                </Link>
              </li>
              <li className="pt-2">
                <button 
                  onClick={goToLifetimeCheckout}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-all shadow-lg w-full text-center"
                >
                  Claim Lifetime Access 🚀
                </button>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900 dark:text-neutral-50">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/billing" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Billing Terms
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources - SEO Pages */}
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900 dark:text-neutral-50">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/crochet-abbreviations" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Abbreviations Chart
                </Link>
              </li>
              <li>
                <Link to="/crochet-pricing-guide" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Pricing Guide
                </Link>
              </li>
              <li>
                <Link to="/yarn-weight-chart" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Yarn Weight Chart
                </Link>
              </li>
              <li>
                <Link to="/hook-size-chart" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400">
                  Hook Size Chart
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900 dark:text-neutral-50">Contact</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link to="/support" className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 font-bold">
                  Technical Support
                </Link>
              </li>
              <li>support@mycrochetkit.com</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          <p>&copy; {currentYear} My Crochet Kit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
