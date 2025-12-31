import { useState } from 'react';
import { DollarSign, Link as LinkIcon, ShoppingCart, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useProjectStore } from '../stores/projectStore';
import UpgradePrompt from './UpgradePrompt';

interface SellerControlsProps {
  projectId: string;
  initialForSale?: boolean;
  initialPrice?: number;
  initialLink?: string;
}

export default function SellerControls({ 
  projectId, 
  initialForSale = false,
  initialPrice,
  initialLink
}: SellerControlsProps) {
  const { canSellItems } = useSubscriptionStore();
  const { updateProject } = useProjectStore();
  
  const [isForSale, setIsForSale] = useState(initialForSale);
  const [price, setPrice] = useState(initialPrice || 0);
  const [paymentLink, setPaymentLink] = useState(initialLink || '');
  const [isSaving, setIsSaving] = useState(false);

  // Gate: Premium only
  if (!canSellItems()) {
    return <UpgradePrompt feature="marketplace" currentTier="pro" />;
  }

  const handleToggleSale = async () => {
    const newForSale = !isForSale;
    setIsForSale(newForSale);

    setIsSaving(true);
    try {
      await updateProject(projectId, {
        isForSale: newForSale,
        price: newForSale ? price : undefined,
        paymentLink: newForSale ? paymentLink : undefined,
      });
    } catch (error) {
      console.error('Error updating listing:', error);
    }
    setIsSaving(false);
  };

  const handleSaveDetails = async () => {
    if (!price || !paymentLink.trim()) {
      alert('Please enter both price and payment link');
      return;
    }

    setIsSaving(true);
    try {
      await updateProject(projectId, {
        price,
        paymentLink,
      });
      alert('Listing updated!');
    } catch (error) {
      console.error('Error saving details:', error);
      alert('Error saving. Please try again.');
    }
    setIsSaving(false);
  };

  return (
    <div className="card p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 font-display">Sell Your Item</h3>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isForSale}
            onChange={handleToggleSale}
            disabled={isSaving}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
          <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-neutral-300">
            {isForSale ? 'Listed' : 'Private'}
          </span>
        </label>
      </div>

      {isForSale && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Keep 100% of your sales.</strong> Simply provide your payment link (from Stripe, PayPal, etc.) and we'll show it to potential buyers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                Asking Price (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full pl-9 rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                Payment Link
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="url"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-9 rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveDetails}
            disabled={isSaving || !price || !paymentLink.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Update Listing'}
          </button>
        </div>
      )}
    </div>
  );
}
