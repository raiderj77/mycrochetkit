/**
 * Crochet Hook Size Chart
 * SEO-optimized page for hook size reference
 */

import { useState } from 'react';
import { Search, Ruler, ArrowRight } from 'lucide-react';
import { goToCheckout } from '../lib/stripe-client';

const hookSizes = [
  // Steel hooks for thread/lace
  { mm: 0.75, us: '14 Steel', uk: '-', yarnWeight: 'Thread', notes: 'Finest thread crochet' },
  { mm: 0.85, us: '13 Steel', uk: '-', yarnWeight: 'Thread', notes: 'Fine thread work' },
  { mm: 1.0, us: '12 Steel', uk: '-', yarnWeight: 'Thread', notes: 'Lace and doilies' },
  { mm: 1.1, us: '11 Steel', uk: '-', yarnWeight: 'Thread', notes: 'Thread crochet' },
  { mm: 1.3, us: '10 Steel', uk: '-', yarnWeight: 'Thread', notes: 'Size 10 crochet thread' },
  { mm: 1.4, us: '9 Steel', uk: '-', yarnWeight: 'Thread', notes: 'Fine lacework' },
  { mm: 1.5, us: '8 Steel', uk: '-', yarnWeight: 'Thread/Lace', notes: 'Transitional size' },
  { mm: 1.65, us: '7 Steel', uk: '-', yarnWeight: 'Lace', notes: 'Fine lace weight' },
  { mm: 1.8, us: '6 Steel', uk: '-', yarnWeight: 'Lace', notes: 'Lace weight yarn' },
  { mm: 2.0, us: '-', uk: '14', yarnWeight: 'Lace', notes: 'Fine fingering' },
  
  // Regular aluminum/plastic hooks
  { mm: 2.25, us: 'B/1', uk: '13', yarnWeight: 'Super Fine', notes: 'Sock yarn, tight amigurumi' },
  { mm: 2.5, us: '-', uk: '12', yarnWeight: 'Super Fine', notes: 'Between sizes' },
  { mm: 2.75, us: 'C/2', uk: '11', yarnWeight: 'Super Fine', notes: 'Fine yarn projects' },
  { mm: 3.0, us: '-', uk: '10', yarnWeight: 'Fine', notes: 'Sport weight' },
  { mm: 3.25, us: 'D/3', uk: '10', yarnWeight: 'Fine', notes: 'Tight sport weight' },
  { mm: 3.5, us: 'E/4', uk: '9', yarnWeight: 'Fine', notes: 'Sport/DK transition' },
  { mm: 3.75, us: 'F/5', uk: '9', yarnWeight: 'Light', notes: 'Light DK weight' },
  { mm: 4.0, us: 'G/6', uk: '8', yarnWeight: 'Light', notes: 'Standard DK' },
  { mm: 4.5, us: '7', uk: '7', yarnWeight: 'Light', notes: 'DK/Worsted transition' },
  { mm: 5.0, us: 'H/8', uk: '6', yarnWeight: 'Medium', notes: 'Light worsted' },
  { mm: 5.5, us: 'I/9', uk: '5', yarnWeight: 'Medium', notes: 'Standard worsted' },
  { mm: 6.0, us: 'J/10', uk: '4', yarnWeight: 'Medium', notes: 'Most popular size!' },
  { mm: 6.5, us: 'K/10.5', uk: '3', yarnWeight: 'Medium/Bulky', notes: 'Heavy worsted' },
  { mm: 7.0, us: '-', uk: '2', yarnWeight: 'Bulky', notes: 'Light chunky' },
  { mm: 8.0, us: 'L/11', uk: '0', yarnWeight: 'Bulky', notes: 'Chunky yarn' },
  { mm: 9.0, us: 'M/13', uk: '00', yarnWeight: 'Bulky', notes: 'Heavy chunky' },
  { mm: 10.0, us: 'N/15', uk: '000', yarnWeight: 'Super Bulky', notes: 'Super chunky' },
  { mm: 12.0, us: 'P/16', uk: '-', yarnWeight: 'Super Bulky', notes: 'Very thick yarn' },
  { mm: 15.0, us: 'Q', uk: '-', yarnWeight: 'Super Bulky', notes: 'Extreme yarn' },
  { mm: 16.0, us: 'Q', uk: '-', yarnWeight: 'Jumbo', notes: 'Roving yarn' },
  { mm: 19.0, us: 'S', uk: '-', yarnWeight: 'Jumbo', notes: 'Giant projects' },
  { mm: 25.0, us: '-', uk: '-', yarnWeight: 'Jumbo', notes: 'Arm crochet prep' },
];

import { Helmet } from 'react-helmet-async';

export default function HookSizeChart() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWeight, setFilterWeight] = useState('All');

  const weights = ['All', 'Thread', 'Lace', 'Super Fine', 'Fine', 'Light', 'Medium', 'Bulky', 'Super Bulky', 'Jumbo'];

  const filteredHooks = hookSizes.filter(hook => {
    const matchesSearch = 
      hook.mm.toString().includes(searchTerm) ||
      hook.us.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hook.uk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hook.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWeight = filterWeight === 'All' || hook.yarnWeight.includes(filterWeight);
    
    return matchesSearch && matchesWeight;
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Crochet Hook Size Conversion Chart (US, UK, Metric) | My Crochet Kit</title>
        <meta name="description" content="A complete crochet hook size conversion guide. Easily find the right hook for any project with our US, UK, and metric (mm) comparison chart." />
        <meta property="og:title" content="Crochet Hook Size Conversion Chart | My Crochet Kit" />
        <meta property="og:description" content="Complete US, UK, and metric hook size conversion chart for all yarn weights." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
            <Ruler className="h-4 w-4" />
            Free Reference Chart
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            Crochet Hook Size Chart
          </h1>
          <p className="mx-auto max-w-2xl text-xl opacity-90">
            Complete US, UK, and metric hook size conversion chart. Find the right hook for any yarn weight.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by size (e.g., 5.0, H/8, J/10)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 py-3 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          
          <select
            value={filterWeight}
            onChange={(e) => setFilterWeight(e.target.value)}
            className="rounded-lg border border-neutral-300 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800"
          >
            {weights.map(w => (
              <option key={w} value={w}>{w} Weight</option>
            ))}
          </select>
        </div>

        {/* Quick Reference Cards */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 p-6 dark:from-amber-900/30 dark:to-orange-900/30">
            <h3 className="mb-2 font-bold text-orange-900 dark:text-orange-100">Most Popular Size</h3>
            <p className="text-3xl font-black text-orange-600">6.0mm / J/10</p>
            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">Works with most worsted weight yarn</p>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 p-6 dark:from-blue-900/30 dark:to-indigo-900/30">
            <h3 className="mb-2 font-bold text-blue-900 dark:text-blue-100">Amigurumi Favorite</h3>
            <p className="text-3xl font-black text-blue-600">3.5mm / E/4</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">Creates tight stitches for stuffed toys</p>
          </div>
          
          <div className="rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 p-6 dark:from-pink-900/30 dark:to-rose-900/30">
            <h3 className="mb-2 font-bold text-pink-900 dark:text-pink-100">Beginner Recommended</h3>
            <p className="text-3xl font-black text-pink-600">5.5mm / I/9</p>
            <p className="mt-1 text-sm text-pink-700 dark:text-pink-300">Easy to hold, clear stitch visibility</p>
          </div>
        </div>

        {/* Main Chart */}
        <div className="mb-12 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <table className="w-full">
            <thead className="bg-neutral-100 dark:bg-neutral-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Metric (mm)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">US Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">UK Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Yarn Weight</th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredHooks.map((hook, index) => (
                <tr 
                  key={index}
                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${
                    hook.mm === 6.0 ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-50">
                      {hook.mm}mm
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-orange-100 px-2 py-1 font-mono text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                      {hook.us}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {hook.uk}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      hook.yarnWeight === 'Thread' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                      hook.yarnWeight === 'Lace' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                      hook.yarnWeight === 'Super Fine' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' :
                      hook.yarnWeight === 'Fine' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      hook.yarnWeight === 'Light' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300' :
                      hook.yarnWeight === 'Medium' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      hook.yarnWeight.includes('Bulky') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {hook.yarnWeight}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 md:table-cell">
                    {hook.notes}
                    {hook.mm === 6.0 && <span className="ml-2 text-orange-600">⭐</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Choose Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            How to Choose the Right Hook Size
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm text-white">1</span>
                Check the Yarn Label
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Most yarn labels recommend a hook size. This is the starting point - you may need to go 
                up or down based on your tension and project needs.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm text-white">2</span>
                Make a Gauge Swatch
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Crochet a 4" square and measure your stitches. If you have more stitches than the pattern calls for, 
                go up a hook size. Fewer stitches? Go down.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm text-white">3</span>
                Consider the Project
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                <strong>Amigurumi:</strong> Use 1-2 sizes smaller for tight stitches.<br />
                <strong>Blankets:</strong> Use recommended or 1 size larger for drape.<br />
                <strong>Garments:</strong> Match gauge exactly for proper fit.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm text-white">4</span>
                Trust Your Hands
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Everyone crochets differently! "Tight crocheters" usually need larger hooks, 
                "loose crocheters" need smaller. There's no wrong answer if your gauge matches.
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
                What size crochet hook should a beginner use?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Beginners should start with a <strong>5.5mm (I/9) or 6.0mm (J/10)</strong> hook with worsted weight yarn. 
                These sizes are comfortable to hold, make stitches easy to see, and work up at a satisfying pace.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                Why are US and UK crochet hook sizes different?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                US uses letter/number combinations (like J/10) while UK uses numbers that run opposite 
                (smaller UK numbers = larger hooks). Metric (mm) is universal and most accurate. 
                When in doubt, use the mm size!
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                What's the difference between steel and regular hooks?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Steel hooks (sizes 00-14) are very small and used for thread/lace crochet. 
                Regular hooks (B/1 and up) are made from aluminum, plastic, or wood and used for yarn. 
                Steel hook numbers work backwards - higher number = smaller hook!
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 font-bold text-neutral-900 dark:text-neutral-50">
                What hook size for amigurumi?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                For amigurumi, use a hook <strong>1-2 sizes smaller</strong> than recommended for your yarn. 
                With worsted weight, try 3.5mm (E/4) or 4.0mm (G/6). This creates tight stitches 
                that hide the stuffing inside.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            Never Lose Your Hook Size Settings
          </h2>
          <p className="mb-6 opacity-90">
            My Crochet Kit saves your preferred hook sizes for each project. 
            Track materials, gauge swatches, and more - all in one place.
          </p>
          <button
            onClick={() => goToCheckout('pro')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-orange-600 transition-colors hover:bg-neutral-100"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
