import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
  hashtags?: string[];
  variant?: 'inline' | 'popup';
}

export function ShareButtons({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title,
  description = '',
  hashtags = ['crochet', 'MyCrochetKit'],
  variant = 'inline',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const shareText = description || title;
  const hashtagString = hashtags.map((h) => h.replace('#', '')).join(',');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
      } catch {
        // User cancelled or error
        setShowPopup(true);
      }
    } else {
      setShowPopup(true);
    }
  };

  if (variant === 'popup') {
    return (
      <>
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#2C1810]/10 text-[#2C1810]/70 hover:text-[#2C1810] hover:border-[#2C1810]/20 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>

        <AnimatePresence>
          {showPopup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setShowPopup(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl z-50 w-80"
              >
                <h3 className="font-semibold text-[#2C1810] mb-4">Share</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#1DA1F2]/10 transition-colors"
                  >
                    <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                    <span className="text-xs text-[#2C1810]/60">Twitter</span>
                  </a>
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#4267B2]/10 transition-colors"
                  >
                    <Facebook className="w-6 h-6 text-[#4267B2]" />
                    <span className="text-xs text-[#2C1810]/60">Facebook</span>
                  </a>
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#25D366]/10 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    <span className="text-xs text-[#2C1810]/60">WhatsApp</span>
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#2C1810]/5 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-6 h-6 text-[#7FBFA0]" />
                    ) : (
                      <Copy className="w-6 h-6 text-[#2C1810]/60" />
                    )}
                    <span className="text-xs text-[#2C1810]/60">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full py-2 text-sm text-[#2C1810]/60 hover:text-[#2C1810]"
                >
                  Cancel
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline variant
  return (
    <div className="flex items-center gap-2">
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-[#1DA1F2]/10 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-5 h-5 text-[#1DA1F2]" />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-[#4267B2]/10 transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="w-5 h-5 text-[#4267B2]" />
      </a>
      <a
        href={shareLinks.reddit}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-[#FF4500]/10 transition-colors"
        title="Share on Reddit"
      >
        <svg className="w-5 h-5 text-[#FF4500]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      </a>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg hover:bg-[#2C1810]/5 transition-colors"
        title="Copy link"
      >
        {copied ? (
          <Check className="w-5 h-5 text-[#7FBFA0]" />
        ) : (
          <Copy className="w-5 h-5 text-[#2C1810]/60" />
        )}
      </button>
    </div>
  );
}
