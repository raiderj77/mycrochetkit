/**
 * ScrollToTop Component
 * Scrolls to top of page on route change
 * Critical for good UX when navigating between pages
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window (for public pages)
    window.scrollTo(0, 0);
    
    // Scroll main content area (for app layout)
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
