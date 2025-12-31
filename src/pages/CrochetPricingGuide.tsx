/**
 * How to Price Crochet Items Guide
 * SEO-optimized page for crochet pricing
 */

import { useState } from 'react';
import { DollarSign, Clock, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import { goToCheckout } from '../lib/stripe-client';

import { Helmet } from 'react-helmet-async';

export default function CrochetPricingGuide() {
  const [hours, setHours] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [materialCost, setMaterialsCost] = useState(25);
  const [profitMargin, setProfitMargin] = useState(20);

  const laborCost = hours * hourlyRate;
  const subtotal = laborCost + materialCost;
  const profit = subtotal * (profitMargin / 100);
  const totalPrice = subtotal + profit;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Crochet Pricing Calculator & Fair Formula | My Crochet Kit</title>
        <meta name="description" content="Calculate the perfect price for your crochet items using our professional formula. Stop underselling your work with our interactive labor and materials calculator." />
        <meta property="og:title" content="Crochet Pricing Calculator & Fair Formula | My Crochet Kit" />
        <meta property="og:description" content="Stop guessing! Use the professional formula to calculate fair prices for your crochet creations." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
            <DollarSign className="h-4 w-4" />
            Free Pricing Calculator
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            How to Price Your Crochet Items
          </h1>
          <p className="mx-auto max-w-2xl text-xl opacity-90">
            Stop underselling your handmade work. Use the proven formula to calculate fair prices for your crochet creations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* The Formula Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            The Crochet Pricing Formula
          </h2>
          
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg dark:bg-neutral-800">
            <div className="mb-8 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 p-6 text-center dark:from-green-900/30 dark:to-emerald-900/30">
              <p className="text-2xl font-black text-green-800 dark:text-green-200">
                (Materials + Labor) × Profit Margin = Your Price
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm text-white">1</span>
                  Materials Cost
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Add up yarn, stuffing, eyes, buttons, and any other supplies used. Include shipping costs if you ordered online.
                </p>
              </div>
              
              <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm text-white">2</span>
                  Labor Cost
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Hours worked × your hourly rate. Start at $15-20/hr minimum. Your time has value!
                </p>
              </div>
              
              <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                <h3 className="mb-2 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm text-white">3</span>
                  Profit Margin
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Add 10-30% profit to cover business expenses, taxes, and actually make money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Calculator */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            <Calculator className="mb-2 inline h-8 w-8" /> Try the Calculator
          </h2>
          
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg dark:bg-neutral-800">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="mr-1 inline h-4 w-4" />
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Recommended: $15-25/hr</p>
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Materials Cost ($)
                  </label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialsCost(Number(e.target.value))}
                    min={0}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:bg-neutral-700"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Recommended: 15-25%</p>
                </div>
              </div>
              
              {/* Results */}
              <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20">
                <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  Price Breakdown
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Labor ({hours}h × ${hourlyRate})</span>
                    <span className="font-medium">${laborCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Materials</span>
                    <span className="font-medium">${materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2 dark:border-neutral-700">
                    <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Profit ({profitMargin}%)</span>
                    <span className="font-medium text-green-600">+${profit.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 rounded-lg bg-green-600 p-4 text-center text-white">
                  <p className="text-sm opacity-90">Recommended Price</p>
                  <p className="text-4xl font-black">${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Common Pricing Mistakes */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Common Pricing Mistakes to Avoid
          </h2>
          
          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
              <h3 className="mb-2 text-lg font-bold text-red-800 dark:text-red-200">❌ Undervaluing Your Time</h3>
              <p className="text-red-700 dark:text-red-300">
                "It only took me 20 hours" - that's $300+ worth of skilled labor at minimum wage! 
                Your expertise, creativity, and time are valuable.
              </p>
            </div>
            
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
              <h3 className="mb-2 text-lg font-bold text-red-800 dark:text-red-200">❌ Comparing to Mass-Produced</h3>
              <p className="text-red-700 dark:text-red-300">
                Your handmade item is NOT comparable to factory-made goods. Customers buying handmade 
                understand they're paying for quality, uniqueness, and artistry.
              </p>
            </div>
            
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
              <h3 className="mb-2 text-lg font-bold text-red-800 dark:text-red-200">❌ Forgetting Hidden Costs</h3>
              <p className="text-red-700 dark:text-red-300">
                Shipping supplies, marketplace fees (Etsy takes 6.5%!), electricity, hooks, 
                needles, pattern purchases - all these add up.
              </p>
            </div>
            
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
              <h3 className="mb-2 text-lg font-bold text-red-800 dark:text-red-200">❌ Racing to the Bottom</h3>
              <p className="text-red-700 dark:text-red-300">
                Don't undercut other sellers to get sales. You'll burn out, devalue the craft, 
                and still barely break even after all your hard work.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Examples */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Real-World Pricing Examples
          </h2>
          
          <div className="mx-auto max-w-4xl overflow-x-auto">
            <table className="w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <thead className="bg-neutral-100 dark:bg-neutral-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Materials</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fair Price Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                <tr>
                  <td className="px-4 py-3 font-medium">Amigurumi (small)</td>
                  <td className="px-4 py-3">3-5 hours</td>
                  <td className="px-4 py-3">$5-10</td>
                  <td className="px-4 py-3 font-bold text-green-600">$50-100</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Baby Blanket</td>
                  <td className="px-4 py-3">15-25 hours</td>
                  <td className="px-4 py-3">$30-60</td>
                  <td className="px-4 py-3 font-bold text-green-600">$275-500</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Adult Sweater</td>
                  <td className="px-4 py-3">40-60 hours</td>
                  <td className="px-4 py-3">$50-150</td>
                  <td className="px-4 py-3 font-bold text-green-600">$650-1200+</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Simple Scarf</td>
                  <td className="px-4 py-3">4-6 hours</td>
                  <td className="px-4 py-3">$15-30</td>
                  <td className="px-4 py-3 font-bold text-green-600">$75-140</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Beanie Hat</td>
                  <td className="px-4 py-3">2-4 hours</td>
                  <td className="px-4 py-3">$8-15</td>
                  <td className="px-4 py-3 font-bold text-green-600">$40-80</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-center text-sm text-neutral-500">
              *Based on $15/hr rate with 20% profit margin. Your prices may vary based on skill, location, and market.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Frequently Asked Questions
          </h2>
          
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                How much should I charge per hour for crochet?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                At minimum, charge $15-20 per hour - that's barely above minimum wage for skilled work. 
                Experienced crocheters often charge $20-35/hour. Remember: this is skilled craftsmanship, 
                not unskilled labor. Your years of practice have value!
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                What if customers say my prices are too high?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Those aren't your customers. People who value handmade work understand fair pricing. 
                Politely explain your pricing (time + materials + skill), but don't lower your prices 
                to match factory-made goods. Quality buyers exist - find them.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Should I charge more for custom orders?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Yes! Custom work typically costs 20-50% more than standard items. Custom orders require 
                extra communication, planning, potential pattern modifications, and the inability to 
                work on other projects. Your flexibility has value.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Where can I sell crochet items without high fees?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Etsy charges 6.5% transaction fees plus listing fees. <strong>My Crochet Kit Lifetime</strong> includes 
                a 0% commission marketplace - you keep 100% of your sales. Just $79.99 one-time for lifetime access, no matter 
                how much you sell.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            <Sparkles className="mr-2 inline h-6 w-6" />
            Track Time & Calculate Prices Automatically
          </h2>
          <p className="mb-6 opacity-90">
            My Crochet Kit includes a built-in project timer that tracks your hours and calculates 
            fair prices automatically. Never undersell your work again.
          </p>
          <button
            onClick={() => goToCheckout('pro')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-green-600 transition-colors hover:bg-neutral-100"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
