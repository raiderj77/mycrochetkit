/**
 * Yarn Weight Chart Guide
 * SEO-optimized page for yarn weight reference
 */

import { useState } from 'react';
import { Search, Scale, ArrowRight } from 'lucide-react';
import { goToCheckout } from '../lib/stripe-client';

const yarnWeights = [
  {
    number: 0,
    name: 'Lace',
    alternateNames: ['Thread', 'Cobweb', 'Fingering 10-count'],
    wpi: '30-40+',
    hookSizeMM: '1.5-2.25',
    hookSizeUS: 'Steel 6-8, B/1',
    gaugePerInch: '32-42 sts',
    bestFor: ['Doilies', 'Lace shawls', 'Thread crochet', 'Fine lacework'],
    projects: 'Delicate items requiring fine detail',
    yardage: '1,500-2,500 yards/100g',
  },
  {
    number: 1,
    name: 'Super Fine',
    alternateNames: ['Sock', 'Fingering', 'Baby'],
    wpi: '14-18',
    hookSizeMM: '2.25-3.5',
    hookSizeUS: 'B/1 to E/4',
    gaugePerInch: '21-32 sts',
    bestFor: ['Socks', 'Baby items', 'Light shawls', 'Lightweight garments'],
    projects: 'Lightweight projects, detailed colorwork',
    yardage: '350-500 yards/100g',
  },
  {
    number: 2,
    name: 'Fine',
    alternateNames: ['Sport', 'Baby'],
    wpi: '12-14',
    hookSizeMM: '3.5-4.5',
    hookSizeUS: 'E/4 to 7',
    gaugePerInch: '16-20 sts',
    bestFor: ['Light sweaters', 'Baby blankets', 'Socks', 'Lightweight accessories'],
    projects: 'Three-season garments, baby items',
    yardage: '250-350 yards/100g',
  },
  {
    number: 3,
    name: 'Light',
    alternateNames: ['DK', 'Light Worsted'],
    wpi: '11-12',
    hookSizeMM: '4.5-5.5',
    hookSizeUS: '7 to I/9',
    gaugePerInch: '12-17 sts',
    bestFor: ['Sweaters', 'Baby items', 'Accessories', 'Light blankets'],
    projects: 'Versatile weight for most projects',
    yardage: '200-250 yards/100g',
  },
  {
    number: 4,
    name: 'Medium',
    alternateNames: ['Worsted', 'Afghan', 'Aran'],
    wpi: '9-11',
    hookSizeMM: '5.5-6.5',
    hookSizeUS: 'I/9 to K/10.5',
    gaugePerInch: '11-14 sts',
    bestFor: ['Afghans', 'Sweaters', 'Amigurumi', 'Hats', 'Scarves'],
    projects: 'Most popular weight - great for beginners!',
    yardage: '150-200 yards/100g',
  },
  {
    number: 5,
    name: 'Bulky',
    alternateNames: ['Chunky', 'Craft', 'Rug'],
    wpi: '6-8',
    hookSizeMM: '6.5-9',
    hookSizeUS: 'K/10.5 to M/13',
    gaugePerInch: '8-11 sts',
    bestFor: ['Quick blankets', 'Chunky scarves', 'Hats', 'Rugs'],
    projects: 'Fast projects, warm winter accessories',
    yardage: '100-150 yards/100g',
  },
  {
    number: 6,
    name: 'Super Bulky',
    alternateNames: ['Roving', 'Super Chunky'],
    wpi: '4-5',
    hookSizeMM: '9-16',
    hookSizeUS: 'M/13 to Q',
    gaugePerInch: '5-9 sts',
    bestFor: ['Super quick blankets', 'Arm knitting prep', 'Statement scarves'],
    projects: 'Weekend projects, quick gifts',
    yardage: '50-100 yards/100g',
  },
  {
    number: 7,
    name: 'Jumbo',
    alternateNames: ['Roving', 'Extreme', 'Giant'],
    wpi: '1-3',
    hookSizeMM: '16+',
    hookSizeUS: 'Q and larger',
    gaugePerInch: '1-5 sts',
    bestFor: ['Arm crochet', 'Giant blankets', 'Pet beds', 'Floor poufs'],
    projects: 'Super fast statement pieces',
    yardage: '20-50 yards/100g',
  },
];

import { Helmet } from 'react-helmet-async';

export default function YarnWeightChart() {
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWeights = yarnWeights.filter(yarn => {
    const searchLower = searchTerm.toLowerCase();
    return (
      yarn.name.toLowerCase().includes(searchLower) ||
      yarn.alternateNames.some(n => n.toLowerCase().includes(searchLower)) ||
      yarn.bestFor.some(b => b.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Ultimate Yarn Weight Chart & Guide (#0 to #7) | My Crochet Kit</title>
        <meta name="description" content="Discover everything you need to know about yarn weights, from Lace weight to Jumbo. Learn how to identify yarn by WPI and find the perfect hook for any fiber." />
        <meta property="og:title" content="Ultimate Yarn Weight Chart & Guide | My Crochet Kit" />
        <meta property="og:description" content="Complete guide to yarn weights, WPI, and recommended hook sizes for every category." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
            <Scale className="h-4 w-4" />
            Free Reference Guide
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            Yarn Weight Chart & Guide
          </h1>
          <p className="mx-auto max-w-2xl text-xl opacity-90">
            Complete guide to yarn weights from lace to jumbo. Find the right yarn and hook size for your next project.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search yarn weight or project type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 py-3 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        {/* Visual Weight Cards */}
        <div className="mb-12 grid gap-4 md:grid-cols-4 lg:grid-cols-8">
          {yarnWeights.map((yarn) => (
            <button
              key={yarn.number}
              onClick={() => setSelectedWeight(selectedWeight === yarn.number ? null : yarn.number)}
              className={`rounded-lg p-4 text-center transition-all ${
                selectedWeight === yarn.number
                  ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                  : 'bg-white shadow-sm hover:shadow-md dark:bg-neutral-800'
              }`}
            >
              <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black ${
                selectedWeight === yarn.number ? 'bg-white/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {yarn.number}
              </div>
              <p className={`text-sm font-bold ${selectedWeight === yarn.number ? '' : 'text-neutral-900 dark:text-neutral-50'}`}>
                {yarn.name}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Weight Detail */}
        {selectedWeight !== null && (
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg dark:bg-neutral-800">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl font-black text-white">
                {selectedWeight}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  {yarnWeights[selectedWeight].name} Weight
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Also called: {yarnWeights[selectedWeight].alternateNames.join(', ')}
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500">Hook Size (mm)</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {yarnWeights[selectedWeight].hookSizeMM}mm
                </p>
              </div>
              <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500">Hook Size (US)</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {yarnWeights[selectedWeight].hookSizeUS}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500">Gauge (sts/4")</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {yarnWeights[selectedWeight].gaugePerInch}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500">Yardage</p>
                <p className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {yarnWeights[selectedWeight].yardage}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">Best For:</h3>
              <div className="flex flex-wrap gap-2">
                {yarnWeights[selectedWeight].bestFor.map((item, i) => (
                  <span key={i} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full Chart Table */}
        <div className="mb-12 overflow-x-auto">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Complete Yarn Weight Chart
          </h2>
          
          <table className="w-full rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <thead className="bg-neutral-100 dark:bg-neutral-900">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-3 py-3 text-left text-sm font-semibold">Weight Name</th>
                <th className="px-3 py-3 text-left text-sm font-semibold">Other Names</th>
                <th className="px-3 py-3 text-left text-sm font-semibold">Hook (mm)</th>
                <th className="px-3 py-3 text-left text-sm font-semibold">Hook (US)</th>
                <th className="hidden px-3 py-3 text-left text-sm font-semibold lg:table-cell">Gauge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredWeights.map((yarn) => (
                <tr 
                  key={yarn.number}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                >
                  <td className="px-3 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {yarn.number}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-neutral-900 dark:text-neutral-50">
                    {yarn.name}
                  </td>
                  <td className="px-3 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                    {yarn.alternateNames.join(', ')}
                  </td>
                  <td className="px-3 py-3 font-mono">{yarn.hookSizeMM}</td>
                  <td className="px-3 py-3">{yarn.hookSizeUS}</td>
                  <td className="hidden px-3 py-3 text-sm lg:table-cell">{yarn.gaugePerInch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Project Recommendations */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Which Yarn Weight Should I Use?
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                🧸 Amigurumi
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Use <strong>Medium (#4)</strong> or <strong>Light (#3)</strong> weight with a hook 1-2 sizes smaller than recommended 
                to create tight stitches that won't show stuffing.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                🧣 Blankets & Afghans
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Medium (#4)</strong> is most popular. For faster projects, try <strong>Bulky (#5)</strong> or 
                <strong> Super Bulky (#6)</strong>. Baby blankets often use <strong>Fine (#2)</strong> or <strong>Light (#3)</strong>.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                🧥 Sweaters & Garments
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Light (#3) DK</strong> or <strong>Medium (#4) Worsted</strong> for most climates. 
                <strong> Super Fine (#1)</strong> yarn for delicate, drapey fabrics.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                🧦 Socks
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Super Fine (#1) Sock yarn</strong> is specifically designed for durability and fit. 
                Look for blends with nylon for extra strength.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                🎁 Quick Gifts
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Bulky (#5)</strong> or <strong>Super Bulky (#6)</strong> work up fast! 
                Great for last-minute scarves, hats, and cowls.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                👶 Baby Items
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong>Fine (#2) Sport</strong> or <strong>Light (#3) DK</strong> are ideal. 
                Choose soft, washable fibers like cotton blends or superwash wool.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                What is WPI and how do I measure it?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                WPI stands for "Wraps Per Inch" - wrap your yarn around a ruler for 1 inch without stretching or gaps. 
                Count the wraps to determine yarn weight. More wraps = finer yarn.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                Can I substitute different yarn weights?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Yes, but you'll need to adjust your hook size and possibly the pattern. Going up a weight usually means 
                a larger finished product; going down means smaller. Always make a gauge swatch first!
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                What's the most popular yarn weight for beginners?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                <strong>Medium (#4) Worsted</strong> weight is perfect for beginners! It's easy to see stitches, 
                works up at a reasonable pace, and is available in countless colors at any craft store.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            Track Your Yarn Stash
          </h2>
          <p className="mb-6 opacity-90">
            My Crochet Kit helps you organize your yarn collection by weight, color, and yardage. 
            Never buy duplicate yarn again!
          </p>
          <button
            onClick={() => goToCheckout('pro')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-blue-600 transition-colors hover:bg-neutral-100"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
