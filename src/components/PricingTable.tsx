import { useState } from 'react';
import { Check, X, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';
import { PRICING } from '../config/pricing';
import { goToCheckout, goToLifetimeCheckout } from '../lib/stripe-client';

interface PricingTableProps {
  showAnnualDefault?: boolean;
}

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  name: string;
  price: { monthly: number; annual: number };
  icon: React.ElementType;
  color: string;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
}

export default function PricingTable({ showAnnualDefault = false }: PricingTableProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>(showAnnualDefault ? 'annual' : 'monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: 'pro' | 'lifetime') => {
    setLoading(tier);
    
    try {
      if (tier === 'lifetime') {
        goToLifetimeCheckout();
      } else {
        goToCheckout('pro', billingPeriod);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(null);
    }
  };

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      icon: Sparkles,
      color: 'gray',
      description: 'Ad-supported • Perfect for beginners',
      features: [
        { text: '3 active projects', included: true },
        { text: '3 saved patterns', included: true },
        { text: 'Basic row counters', included: true },
        { text: 'Community access', included: true },
        { text: 'Browse marketplace', included: true },
        { text: 'Project timer', included: false },
        { text: 'Crochet glossary', included: false },
        { text: 'Voice control', included: false },
        { text: 'Cloud storage', included: false },
      ],
    },
    pro: {
      name: PRICING.proMonthly.label,
      price: { 
        monthly: PRICING.proMonthly.amount, 
        annual: PRICING.proAnnual.amount 
      },
      icon: Zap,
      color: 'indigo',
      description: '30-Day Money-Back Guarantee',
      popular: true,
      features: [
        { text: '100 active projects', included: true },
        { text: '50 saved patterns', included: true },
        { text: '2GB cloud storage', included: true },
        { text: 'Project timer & pricing', included: true },
        { text: 'Crochet glossary', included: true },
        { text: 'Voice-controlled counters', included: true },
        { text: 'Progress photos', included: true },
        { text: 'Community features', included: true },
        { text: 'Sell items', included: false },
      ],
    },
    lifetime: {
      name: PRICING.lifetime.label,
      price: { 
        monthly: PRICING.lifetime.amount, 
        annual: PRICING.lifetime.amount 
      },
      icon: Crown,
      color: 'purple',
      description: 'One-time payment, forever',
      isLifetime: true,
      bestValue: true,
      spotsLeft: 500,
      features: [
        { text: 'Everything in Pro, forever', included: true },
        { text: 'All future features', included: true },
        { text: 'Founding member badge', included: true },
        { text: '1GB cloud storage', included: true, highlight: true },
        { text: '0% commission marketplace', included: true, highlight: true },
        { text: 'Referral rewards program', included: true },
      ],
    },
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
              billingPeriod === 'annual'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Annual
            <span className="ml-2 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto px-4">
        <PlanCard
          plan={plans.free}
          billingPeriod={billingPeriod}
          ctaText="Join for Free"
          ctaHref="/signup"
        />

        <PlanCard
          plan={plans.pro}
          billingPeriod={billingPeriod}
          ctaText={loading === 'pro' ? 'Loading...' : 'Join Pro Now'}
          onCtaClick={() => handleCheckout('pro')}
          popular={true}
          loading={loading === 'pro'}
        />

        <PlanCard
          plan={plans.lifetime}
          billingPeriod="monthly"
          ctaText={loading === 'lifetime' ? 'Loading...' : 'Buy Lifetime Access'}
          onCtaClick={() => handleCheckout('lifetime')}
          loading={loading === 'lifetime'}
          isLifetime={true}
          showBonusBadge={true}
        />
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  billingPeriod: 'monthly' | 'annual';
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  popular?: boolean;
  loading?: boolean;
  isLifetime?: boolean;
  showBonusBadge?: boolean;
}

function PlanCard({ plan, billingPeriod, ctaText, ctaHref, onCtaClick, popular, loading, isLifetime, showBonusBadge }: PlanCardProps) {
  const Icon = plan.icon;
  const price = isLifetime ? plan.price.monthly : (billingPeriod === 'monthly' ? plan.price.monthly : plan.price.annual);
  const subText = isLifetime 
    ? "one-time (Founders)" 
    : (billingPeriod === 'monthly' ? "per month" : "per year (billed annually)");

  const buttonClasses = `block w-full text-center px-6 py-3 rounded-full font-bold transition-all mb-6 ${
    popular
      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-500/20'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 transition-all duration-300 border border-slate-100 dark:border-slate-800 ${popular ? 'ring-2 ring-purple-600 dark:ring-purple-400 scale-105 z-10' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="inline-flex p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 mb-6 transition-colors">
        <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 transition-colors">{plan.name}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed transition-colors">{plan.description}</p>

      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-slate-900 dark:text-white transition-colors">
            ${price}
          </span>
          <div className="flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest transition-colors">
              {subText}
            </span>
            {isLifetime && showBonusBadge && (
              <span className="mt-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800 transition-colors">
                Referral Bonus: $10 Amazon Reward
              </span>
            )}
          </div>
        </div>
      </div>

      {onCtaClick ? (
        <button
          onClick={onCtaClick}
          disabled={loading}
          className={buttonClasses}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            ctaText
          )}
        </button>
      ) : (
        <a
          href={ctaHref || '/signup'}
          className={buttonClasses}
        >
          {ctaText}
        </a>
      )}

      <ul className="space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className={`h-5 w-5 ${feature.highlight ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'} flex-shrink-0 transition-colors`} />
            ) : (
              <X className="h-5 w-5 text-slate-300 dark:text-slate-700 flex-shrink-0 transition-colors" />
            )}
            <span className={`text-sm leading-tight transition-colors ${feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'} ${feature.highlight ? 'font-black text-purple-700 dark:text-purple-400' : 'font-medium'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
