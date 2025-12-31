/**
 * Web Share API Utility
 * Provides native sharing capabilities for the PWA
 */

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export const shareContent = async (options: ShareOptions): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: options.title || 'My Crochet Kit',
        text: options.text || 'Check out my latest crochet project!',
        url: options.url || window.location.href,
      });
      return true;
    } else {
      // Fallback: Copy to clipboard
      const shareUrl = options.url || window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard! (Native sharing not supported on this browser)");
      return false;
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error(`Error sharing: ${err}`);
    }
    return false;
  }
};
