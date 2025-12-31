/**
 * Billing Banners Component
 * 
 * Shows trial and payment status banners on all pages
 */

import { useBilling } from "../hooks/useBilling";

export default function BillingBanners() {
  const billing = useBilling();
  if (!billing) return null;

  const { paymentsEnabled } = billing;

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Payments paused banner */}
      {!paymentsEnabled && (
        <div className="rounded-2xl border border-red-500/30 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          ⛔ Payments are temporarily paused. You can still create an account and use the free tier.
        </div>
      )}
    </div>
  );
}
