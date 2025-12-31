
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Try to load .env from the root of the functions dir or the project root
// Adjust relative paths as needed
dotenv.config({ path: path.join(__dirname, '../../.env') }); 

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('❌ Error: STRIPE_SECRET_KEY not found in environment variables.');
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/seed-stripe.ts');
  process.exit(1);
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16', // Use the version matching your package.json or latest
});

const PRODUCTS = [
  {
    name: 'My Crochet Kit Pro',
    description: 'Pro plan for serious crafters',
    metadata: { tier: 'pro' },
    features: ['50 projects', 'Unlimited counters', 'Project timer'],
    prices: [
      { unit_amount: 999, currency: 'usd', interval: 'month' as const, interval_count: 1, lookup_key: 'pro_monthly' },
      { unit_amount: 9600, currency: 'usd', interval: 'year' as const, interval_count: 1, lookup_key: 'pro_annual' },
    ],
  },
  {
    name: 'My Crochet Kit Premium Pro',
    description: 'Premium plan for sellers & power users',
    metadata: { tier: 'premium' },
    features: ['Unlimited everything', '0% commission marketplace', 'Verified Seller badge'],
    prices: [
      { unit_amount: 1299, currency: 'usd', interval: 'month' as const, interval_count: 1, lookup_key: 'premium_monthly' },
      { unit_amount: 12500, currency: 'usd', interval: 'year' as const, interval_count: 1, lookup_key: 'premium_annual' },
    ],
  },
];

async function seed() {
  console.log('🌱 Seeding Stripe Products...');
  
  const envOutput: string[] = [];

  for (const p of PRODUCTS) {
    console.log(`\nChecking product: ${p.name}...`);
    
    // 1. Check if product exists (idempotency by metadata)
    const existing = await stripe.products.search({
      query: `metadata['tier']:'${p.metadata.tier}' AND active:'true'`,
      limit: 1,
    });

    let product;

    if (existing.data.length > 0) {
      product = existing.data[0];
      console.log(`✅ Found existing product: ${product.id}`);
    } else {
      console.log(`✨ Creating new product: ${p.name}`);
      product = await stripe.products.create({
        name: p.name,
        description: p.description,
        metadata: p.metadata,
      });
      console.log(`   -> Created: ${product.id}`);
    }

    // 2. Sync Prices
    for (const pr of p.prices) {
      const intervalKey = pr.interval === 'month' ? 'MONTHLY' : 'ANNUAL';
      const envKey = `STRIPE_PRICE_ID_${p.metadata.tier.toUpperCase()}_${intervalKey}`;

      // Check if price exists for this product with this lookup_key
      // (Lookup keys allow us to find the exact price object easily)
      let price;
      
      try {
        // Try to retrieve by lookup_key first (if we set it previously)
        // Note: listPrices doesn't support lookup_key filtering directly in all versions, 
        // but we can search or iterated.
        // Better approach for idempotency: search by product + unit_amount + interval
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          limit: 100,
        });

        price = prices.data.find(
            x => x.unit_amount === pr.unit_amount && 
                 x.currency === pr.currency && 
                 x.recurring?.interval === pr.interval
        );

        if (price) {
             console.log(`   ✅ Found existing price (${pr.interval}): ${price.id}`);
        } else {
            console.log(`   ✨ Creating new price (${pr.interval}): $${pr.unit_amount/100}`);
            price = await stripe.prices.create({
                product: product.id,
                unit_amount: pr.unit_amount,
                currency: pr.currency,
                recurring: {
                    interval: pr.interval,
                    interval_count: pr.interval_count
                },
                metadata: {
                    tier: p.metadata.tier
                }
            });
            console.log(`      -> Created: ${price.id}`);
        }
        
        envOutput.push(`${envKey}=${price.id}`);

      } catch (err: any) {
        console.error(`Error syncing price for ${p.name}:`, err.message);
      }
    }
  }

  console.log('\n\n✅ Seeding Complete!\n');
  console.log('=== COPY THESE TO YOUR .env FILE ===');
  console.log(envOutput.join('\n'));
  console.log('====================================');
}

seed().catch(err => {
    console.error('From Seed Script:', err);
    process.exit(1);
});
