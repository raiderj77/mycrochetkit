/**
 * Update Prompt Component
 * 
 * Notifies users when a new version is available
 */

import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: unknown) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error);
    },
  });
  
  const handleUpdate = () => {
    updateServiceWorker(true);
  };
  
  const handleClose = () => {
    setNeedRefresh(false);
  };
  
  if (!needRefresh) return null;
  
  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-96">
      <div className="card relative border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-600 p-2 text-white">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Update Available
            </h3>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              A new version of the app is ready. Refresh to update.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleUpdate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Update Now
              </button>
              <button
                onClick={handleClose}
                className="btn-outline text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
