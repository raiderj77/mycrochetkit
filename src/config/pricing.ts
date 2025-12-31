export const PRICING = {
  proMonthly: {
    id: 'pro_monthly',
    label: 'Pro Monthly',
    amount: 9.99,
    interval: 'month' as const,
    type: 'subscription' as const,
    cta: 'Join Pro Now',
    priceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY,
  },
  proAnnual: {
    id: 'pro_annual',
    label: 'Pro Annual',
    amount: 79.0, // Shows $79/yr (user request)
    interval: 'year' as const,
    type: 'subscription' as const,
    cta: 'Join Pro Now',
    priceId: import.meta.env.VITE_STRIPE_PRICE_YEARLY,
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    amount: 79.99,
    interval: 'one-time' as const,
    type: 'one_time' as const, // User requested 'payment' mode, but standardizing naming
    cta: 'Get Lifetime',
    priceId: import.meta.env.VITE_STRIPE_PRICE_LIFETIME,
  },
} as const;

export type PricingTier = keyof typeof PRICING;
