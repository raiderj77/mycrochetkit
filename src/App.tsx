import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdatePrompt } from './components/UpdatePrompt';
import { routes } from './routes';
import { useInitializeStores } from './hooks/useInitializeStores';
import { usePageTracking } from './hooks/useAnalytics';
import ContentProtection from './components/ContentProtection';
import { CookieBanner } from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';

function AppRouter() {
  const element = useRoutes(routes);
  
  // Track all page views automatically
  usePageTracking();
  
  // Initialize all stores on app startup
  useInitializeStores();
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-4xl" role="status" aria-live="polite">
                🧶
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
            </div>
          </div>
        }
      >
        {element}
      </Suspense>
      
      {/* PWA Prompts */}
      <InstallPrompt />
      <UpdatePrompt />
      
      {/* Content Protection (Only active on app pages via internal check) */}
      <ContentProtection />
      
      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
