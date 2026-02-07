import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export const ShareButtons = (props: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const fullUrl = 'https://mycrochetkit.com' + props.url;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const redditUrl =
    'https://www.reddit.com/submit?url=' +
    encodeURIComponent(fullUrl) +
    '&title=' +
    encodeURIComponent(props.title);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[#2C1810]">Share this article:</h3>

      <div className="flex flex-wrap gap-3">
        <a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#FF4500] text-white rounded-xl font-medium hover:bg-[#FF4500]/90 transition-colors"
        >
          Share on Reddit
        </a>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-[#2C1810]/5 text-[#2C1810] rounded-xl font-medium hover:bg-[#2C1810]/10 transition-colors"
        >
          {copied && <Check className="w-5 h-5 text-[#E86A58]" />}
          {copied && <span>Copied!</span>}
          {!copied && <Share2 className="w-5 h-5" />}
          {!copied && <span>Copy Link</span>}
        </button>
      </div>

      <div className="mt-2 p-4 bg-[#FF4500]/5 border border-[#FF4500]/20 rounded-xl">
        <p className="text-sm text-[#2C1810]/70">
          Sharing on Reddit? Post to r/crochet or r/crochetpatterns!
        </p>
      </div>
    </div>
  );
};
