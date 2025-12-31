import { DollarSign, Zap, ShoppingCart, Check } from 'lucide-react';
import { goToCheckout } from '../lib/stripe-client';

interface UpgradePromptProps {
  feature: 'timer' | 'glossary' | 'marketplace' | 'unlimited_projects' | 'unlimited_patterns';
  currentTier?: 'free' | 'pro';
}

export default function UpgradePrompt({ feature, currentTier = 'free' }: UpgradePromptProps) {
  const featureDetails = {
    timer: {
      title: 'Project Timer & Pricing Calculator',
      description: 'Track your time and calculate fair prices for your work',
      requiredTier: 'Pro',
      icon: Zap,
    },
    glossary: {
      title: 'Crochet Glossary',
      description: 'Quick reference for 40+ crochet abbreviations',
      requiredTier: 'Pro',
      icon: Check,
    },
    marketplace: {
      title: 'Zero-Commission Marketplace',
      description: 'Sell your finished items with 0% platform fees',
      requiredTier: 'Lifetime',
      icon: ShoppingCart,
    },
    unlimited_projects: {
      title: 'Unlimited Projects',
      description: 'Track as many projects as you want (Free: 3, Pro: 100)',
      requiredTier: currentTier === 'free' ? 'Pro' : 'Lifetime',
      icon: Check,
    },
    unlimited_patterns: {
      title: 'Unlimited Patterns',
      description: 'Store as many patterns as you need (Free: 3, Pro: 50)',
      requiredTier: currentTier === 'free' ? 'Pro' : 'Lifetime',
      icon: Check,
    },
  };

  const details = featureDetails[feature];
  const Icon = details.icon;
  
  // Determine which tier to promote
  const upgradeToLifetime = details.requiredTier === 'Lifetime';
  
  const price = upgradeToLifetime ? '$79.99' : '$9.99';
  const tierName = upgradeToLifetime ? 'Lifetime' : 'Pro';
  const annualPrice = upgradeToLifetime ? 'one-time' : '$79/year';

  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
        <Icon className="h-8 w-8" />
      </div>
      
      <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-50 font-display">
        {details.title}
      </h3>
      <p className="mb-6 text-neutral-600 dark:text-neutral-400">
        {details.description}
      </p>
      
      <div className="mb-8 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-800">
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          Available on {tierName} plan
        </p>
        <div className="mt-2 flex items-baseline justify-center gap-1">
          <span className="text-4xl font-black text-neutral-900 dark:text-neutral-50 font-display">
            {price}
          </span>
          <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
            {upgradeToLifetime ? 'one-time' : '/month'}
          </span>
        </div>
        {!upgradeToLifetime && (
          <p className="mt-1 text-xs font-bold text-green-600 dark:text-green-400">
            or {annualPrice}/year (save 20%)
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={() => goToCheckout(upgradeToLifetime ? 'lifetime' : 'pro')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Upgrade to {tierName}
        </button>
        
        <p className="text-xs text-neutral-500">
          30-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
