import { useEffect } from 'react';
import { useSubscriptionStore } from '../stores/subscriptionStore';

export function useContentProtection() {
  const { tier } = useSubscriptionStore();
  const isPaidUser = tier === 'pro' || tier === 'lifetime';

  useEffect(() => {
    let devToolsOpen = false;

    // === PAID USER EXEMPTIONS ===
    // Pro/Premium users get:
    // - Text selection allowed
    // - DevTools allowed
    // - Less intrusive warnings
    // - Can copy small amounts

    // 1. DISABLE RIGHT-CLICK (All users)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (!isPaidUser) {
        showProtectionWarning('Right-click is disabled to protect exclusive content');
      }
      return false;
    };

    // 2. DISABLE KEYBOARD SHORTCUTS (Aggressive for Free only)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Screenshot shortcuts
      const isScreenshot = 
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) ||
        (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && e.key === 'PrintScreen');

      // DevTools shortcuts (EXEMPT paid users)
      const isDevTools =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i'));

      // Save/Print shortcuts
      const isSaveOrPrint =
        ((e.ctrlKey || e.metaKey) && e.key === 's') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'p');

      // Only block screenshots for all users
      if (isScreenshot) {
        e.preventDefault();
        e.stopPropagation();
        showProtectionWarning('Screenshots are disabled to protect content');
        return false;
      }

      // DevTools & Save/Print: Only block for FREE users
      if (!isPaidUser && (isDevTools || isSaveOrPrint)) {
        e.preventDefault();
        e.stopPropagation();
        showProtectionWarning('This action is disabled. Upgrade to Pro for full access.');
        return false;
      }
    };

    // 3. DETECT DEVTOOLS (FREE USERS ONLY)
    const detectDevTools = () => {
      if (isPaidUser) return; // Skip for paid users

      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div>
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">🔒 Protected Content</h1>
                <p style="font-size: 1.2rem;">Developer tools detected. Please close DevTools to continue.</p>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 2rem;">Upgrade to Pro ($9.99/mo) to remove restrictions!</p>
              </div>
            </div>
          `;
        }
      } else {
        if (devToolsOpen) {
          devToolsOpen = false;
          window.location.reload();
        }
      }
    };

    // 4. MONITOR CLIPBOARD (Relaxed for paid users)
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      const limit = isPaidUser ? 500 : 50; // Paid users can copy more
      
      if (selection && selection.length > limit) {
        e.preventDefault();
        if (!isPaidUser) {
          showProtectionWarning('Copying large text blocks is disabled. Upgrade to Pro for more flexibility.');
        }
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (!isPaidUser) {
        e.preventDefault();
        showProtectionWarning('Cut operation is disabled');
      }
    };

    // 5. DETECT SCREENSHOT ATTEMPTS (All users, less intrusive for paid)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Only blur for free users
        if (!isPaidUser) {
          document.body.classList.add('screenshot-blur');
          setTimeout(() => {
            document.body.classList.remove('screenshot-blur');
          }, 100);
        }
        
        // Log for analytics (all users)
        console.warn('⚠️ Potential screenshot attempt detected');
      }
    };

    // 6. DETECT SCREEN RECORDING (All users)
    const detectScreenRecording = () => {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
        (navigator.mediaDevices as any).getDisplayMedia = function() {
          showProtectionWarning('Screen recording detected. This content is protected.');
          console.warn('⚠️ Screen recording attempt detected');
          return Promise.reject(new Error('Screen recording is disabled for this app'));
        };
      }
    };

    // 7. WATERMARK CANVAS IMAGES (All users)
    const watermarkCanvasImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.dataset.watermarked) {
          img.dataset.watermarked = 'true';
          img.setAttribute('data-copyright', '© My Crochet Kit - Unauthorized use prohibited');
        }
      });
    };

    // 8. DISABLE DRAG & DROP (All users)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 9. MONITOR DOM FOR SCREENSHOT EXTENSIONS (FREE USERS ONLY)
    const observeDOM = () => {
      if (isPaidUser) {
        return { disconnect: () => {} }; // No-op for paid users
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                if (node.id?.includes('screenshot') || 
                    node.className?.includes('screenshot')) {
                  console.warn('⚠️ Screenshot extension detected');
                  node.remove();
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return observer;
    };

    // Helper: Show protection warning
    const showProtectionWarning = (message: string) => {
      const toast = document.createElement('div');
      toast.className = 'protection-toast';
      toast.textContent = `🔒 ${message}`;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(220, 38, 38, 0.95);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    };

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // INITIALIZE PROTECTIONS
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // DevTools detection (FREE users only)
    const devToolsInterval = isPaidUser ? null : setInterval(detectDevTools, 1000);
    
    // Watermark images
    watermarkCanvasImages();
    const imageInterval = setInterval(watermarkCanvasImages, 2000);
    
    // Screen recording detection (all users)
    detectScreenRecording();
    
    // DOM observer (FREE users only)
    const domObserver = observeDOM();

    // CLEANUP
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (devToolsInterval) clearInterval(devToolsInterval);
      clearInterval(imageInterval);
      domObserver.disconnect();
      style.remove();
    };
  }, [tier, isPaidUser]);
}

// Component version
export default function ContentProtection() {
  useContentProtection();
  return null;
}
