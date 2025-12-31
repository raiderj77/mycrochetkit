/**
 * Crochet Abbreviations Guide
 * SEO-optimized page for crochet terminology
 */

import { useState } from 'react';
import { Search, BookOpen, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { goToCheckout } from '../lib/stripe-client';

// Comprehensive abbreviation data
const abbreviations = [
  // Basic Stitches
  { us: 'ch', uk: 'ch', name: 'Chain', description: 'Foundation stitch that creates a row of connected loops', category: 'Basic' },
  { us: 'sl st', uk: 'ss', name: 'Slip Stitch', description: 'Shortest crochet stitch, used to join rounds or move yarn without adding height', category: 'Basic' },
  { us: 'sc', uk: 'dc', name: 'Single Crochet / Double Crochet (UK)', description: 'Insert hook, yarn over, pull through, yarn over, pull through both loops', category: 'Basic' },
  { us: 'hdc', uk: 'htr', name: 'Half Double Crochet / Half Treble (UK)', description: 'Yarn over, insert hook, yarn over, pull through, yarn over, pull through all 3 loops', category: 'Basic' },
  { us: 'dc', uk: 'tr', name: 'Double Crochet / Treble (UK)', description: 'Yarn over, insert hook, yarn over, pull through, [yarn over, pull through 2] twice', category: 'Basic' },
  { us: 'tr', uk: 'dtr', name: 'Treble Crochet / Double Treble (UK)', description: 'Yarn over twice, insert hook, then work off 2 loops at a time', category: 'Basic' },
  { us: 'dtr', uk: 'trtr', name: 'Double Treble / Triple Treble (UK)', description: 'Yarn over 3 times, insert hook, then work off 2 loops at a time', category: 'Basic' },
  
  // Increases & Decreases
  { us: 'inc', uk: 'inc', name: 'Increase', description: 'Work 2 or more stitches in the same stitch to add width', category: 'Shaping' },
  { us: 'dec', uk: 'dec', name: 'Decrease', description: 'Work 2 or more stitches together to reduce width', category: 'Shaping' },
  { us: 'sc2tog', uk: 'dc2tog', name: 'Single Crochet 2 Together', description: 'Decrease by working 2 single crochets together as one', category: 'Shaping' },
  { us: 'dc2tog', uk: 'tr2tog', name: 'Double Crochet 2 Together', description: 'Decrease by working 2 double crochets together as one', category: 'Shaping' },
  { us: 'invdec', uk: 'invdec', name: 'Invisible Decrease', description: 'A neater decrease for amigurumi - insert through front loops only', category: 'Shaping' },
  
  // Special Stitches
  { us: 'FLO', uk: 'FLO', name: 'Front Loop Only', description: 'Work into only the front loop of the stitch for a ribbed effect', category: 'Technique' },
  { us: 'BLO', uk: 'BLO', name: 'Back Loop Only', description: 'Work into only the back loop of the stitch for texture', category: 'Technique' },
  { us: 'BPdc', uk: 'BPtr', name: 'Back Post Double Crochet', description: 'Work around the post from behind for cables and texture', category: 'Technique' },
  { us: 'FPdc', uk: 'FPtr', name: 'Front Post Double Crochet', description: 'Work around the post from front for raised stitches', category: 'Technique' },
  { us: 'picot', uk: 'picot', name: 'Picot', description: 'Decorative loop made by chaining and slip stitching back', category: 'Decorative' },
  { us: 'popcorn', uk: 'popcorn', name: 'Popcorn Stitch', description: 'Multiple stitches in one spot, then joined at top for 3D bobble', category: 'Decorative' },
  { us: 'puff', uk: 'puff', name: 'Puff Stitch', description: 'Multiple yarn overs pulled through together for puffy texture', category: 'Decorative' },
  { us: 'bobble', uk: 'bobble', name: 'Bobble Stitch', description: 'Similar to popcorn but worked from the wrong side', category: 'Decorative' },
  { us: 'shell', uk: 'shell', name: 'Shell Stitch', description: 'Multiple stitches worked into same stitch creating fan shape', category: 'Decorative' },
  { us: 'V-st', uk: 'V-st', name: 'V-Stitch', description: 'Two stitches with a chain between, worked in same stitch', category: 'Decorative' },
  
  // Pattern Instructions
  { us: 'yo', uk: 'yoh', name: 'Yarn Over', description: 'Wrap yarn around hook before inserting into stitch', category: 'Instruction' },
  { us: 'sk', uk: 'miss', name: 'Skip / Miss', description: 'Skip the next stitch without working into it', category: 'Instruction' },
  { us: 'sp', uk: 'sp', name: 'Space', description: 'The gap or hole between stitches, often from chains', category: 'Instruction' },
  { us: 'rep', uk: 'rep', name: 'Repeat', description: 'Repeat the instructions as specified', category: 'Instruction' },
  { us: 'rnd', uk: 'rnd', name: 'Round', description: 'One complete circuit when working in the round', category: 'Instruction' },
  { us: 'RS', uk: 'RS', name: 'Right Side', description: 'The front/public side of your work', category: 'Instruction' },
  { us: 'WS', uk: 'WS', name: 'Wrong Side', description: 'The back/private side of your work', category: 'Instruction' },
  { us: 'tog', uk: 'tog', name: 'Together', description: 'Work stitches together as one', category: 'Instruction' },
  { us: 'pm', uk: 'pm', name: 'Place Marker', description: 'Put a stitch marker to track position', category: 'Instruction' },
  { us: 'MC', uk: 'MC', name: 'Magic Circle / Ring', description: 'Adjustable starting ring for working in the round', category: 'Instruction' },
  { us: 'MR', uk: 'MR', name: 'Magic Ring', description: 'Same as magic circle - adjustable starting loop', category: 'Instruction' },
  { us: 'fo', uk: 'fo', name: 'Fasten Off', description: 'Cut yarn and secure the final stitch', category: 'Instruction' },
  { us: 'cont', uk: 'cont', name: 'Continue', description: 'Keep working in the established pattern', category: 'Instruction' },
  { us: 'beg', uk: 'beg', name: 'Beginning', description: 'The start of a row or round', category: 'Instruction' },
  { us: 'alt', uk: 'alt', name: 'Alternate', description: 'Every other stitch or row', category: 'Instruction' },
  { us: 'approx', uk: 'approx', name: 'Approximately', description: 'About or roughly this measurement', category: 'Instruction' },
  { us: 'ea', uk: 'ea', name: 'Each', description: 'Every one of the stitches mentioned', category: 'Instruction' },
  { us: 'lp(s)', uk: 'lp(s)', name: 'Loop(s)', description: 'The yarn loops on your hook or in a stitch', category: 'Instruction' },
  { us: 'prev', uk: 'prev', name: 'Previous', description: 'The one before the current position', category: 'Instruction' },
  { us: 'rem', uk: 'rem', name: 'Remaining', description: 'The stitches left to work', category: 'Instruction' },
  { us: 'tch', uk: 'tch', name: 'Turning Chain', description: 'Chain stitches made at row end before turning', category: 'Instruction' },
  { us: 'st(s)', uk: 'st(s)', name: 'Stitch(es)', description: 'Individual crochet stitch or stitches', category: 'Instruction' },
];

const categories = ['All', 'Basic', 'Shaping', 'Technique', 'Decorative', 'Instruction'];

import { Helmet } from 'react-helmet-async';

export default function CrochetAbbreviations() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUK, setShowUK] = useState(false);

  const filteredAbbreviations = abbreviations.filter(abbr => {
    const matchesSearch = 
      abbr.us.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abbr.uk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abbr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abbr.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || abbr.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Complete Crochet Abbreviations Guide (US vs UK) | My Crochet Kit</title>
        <meta name="description" content="Never be confused by sc, dc, tr, or hdc again. Our complete crochet abbreviations chart helps you translate between US and UK terms instantly." />
        <meta property="og:title" content="Crochet Abbreviations Master Chart | My Crochet Kit" />
        <meta property="og:description" content="Translate between US and UK crochet terms with our comprehensive abbreviations guide." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
            <BookOpen className="h-4 w-4" />
            Free Crochet Reference Guide
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            Crochet Abbreviations Chart
          </h1>
          <p className="mx-auto max-w-2xl text-xl opacity-90">
            Complete guide to US and UK crochet abbreviations. Never be confused by sc, dc, tr, or hdc again!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search abbreviations... (e.g., sc, chain, decrease)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 py-3 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {/* US/UK Toggle */}
            <button
              onClick={() => setShowUK(!showUK)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                showUK 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
              }`}
            >
              <Globe className="h-4 w-4" />
              {showUK ? 'UK Terms' : 'US Terms'}
            </button>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Important US/UK Difference Notice */}
        <div className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 p-6 dark:border-amber-600 dark:bg-amber-900/20">
          <h2 className="mb-2 text-lg font-bold text-amber-900 dark:text-amber-100">
            ⚠️ US vs UK Terms Are Different!
          </h2>
          <p className="text-amber-800 dark:text-amber-200">
            A <strong>US single crochet (sc)</strong> is called <strong>double crochet (dc)</strong> in UK patterns. 
            Always check if your pattern uses US or UK terminology before starting!
          </p>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <div className="rounded bg-white/50 p-2 dark:bg-neutral-800/50">
              <strong>US sc</strong> = <strong>UK dc</strong> (shortest stitch)
            </div>
            <div className="rounded bg-white/50 p-2 dark:bg-neutral-800/50">
              <strong>US dc</strong> = <strong>UK tr</strong> (tall stitch)
            </div>
          </div>
        </div>

        {/* Abbreviations Table */}
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <table className="w-full">
            <thead className="bg-neutral-100 dark:bg-neutral-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  {showUK ? 'UK' : 'US'} Abbr.
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Full Name
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold md:table-cell">
                  {showUK ? 'US' : 'UK'} Equivalent
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-semibold lg:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredAbbreviations.map((abbr, index) => (
                <tr 
                  key={index}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                >
                  <td className="px-4 py-3">
                    <code className="rounded bg-purple-100 px-2 py-1 font-mono text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      {showUK ? abbr.uk : abbr.us}
                    </code>
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                    {abbr.name}
                  </td>
                  <td className="hidden px-4 py-3 text-neutral-600 dark:text-neutral-400 md:table-cell">
                    <code className="rounded bg-neutral-100 px-2 py-1 font-mono text-sm dark:bg-neutral-700">
                      {showUK ? abbr.us : abbr.uk}
                    </code>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 lg:table-cell">
                    {abbr.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      abbr.category === 'Basic' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      abbr.category === 'Shaping' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      abbr.category === 'Technique' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                      abbr.category === 'Decorative' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' :
                      'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                    }`}>
                      {abbr.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Showing {filteredAbbreviations.length} of {abbreviations.length} abbreviations
        </p>

        {/* FAQ Section for SEO */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Frequently Asked Questions
          </h2>
          
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                What does SC mean in crochet?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                SC stands for <strong>Single Crochet</strong> in US terminology. It's the shortest and most basic crochet stitch. 
                In UK patterns, the same stitch is called <strong>Double Crochet (dc)</strong>. To make a single crochet: 
                insert hook, yarn over, pull through, yarn over, pull through both loops.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                What's the difference between US and UK crochet terms?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                US and UK crochet terms are offset by one stitch height. What Americans call "single crochet" (sc), 
                British crocheters call "double crochet" (dc). US "double crochet" (dc) is UK "treble" (tr). 
                Always check whether your pattern uses US or UK terminology before starting!
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                What does HDC mean in crochet?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                HDC stands for <strong>Half Double Crochet</strong>. It's taller than a single crochet but shorter than a double crochet. 
                In UK terms, it's called <strong>Half Treble (htr)</strong>. To make one: yarn over, insert hook, 
                yarn over, pull through, yarn over, pull through all 3 loops at once.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-800">
              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                What is a magic circle in crochet?
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                A <strong>Magic Circle</strong> (also called Magic Ring or MC/MR) is an adjustable starting loop used when crocheting in the round. 
                It allows you to pull the center tight so there's no hole. It's essential for amigurumi and any project worked in rounds 
                from the center outward.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            Never Forget an Abbreviation Again
          </h2>
          <p className="mb-6 opacity-90">
            My Crochet Kit includes a built-in glossary with all these terms, 
            plus voice-controlled row counters, pattern tracking, and more.
          </p>
          <button
            onClick={() => goToCheckout('pro')}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-purple-600 transition-colors hover:bg-neutral-100"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/crochet-pricing-guide')}
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-neutral-800 dark:text-indigo-400"
          >
            Pricing Guide <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/yarn-weight-chart')}
            className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-100 dark:bg-neutral-800 dark:text-purple-400"
          >
            Yarn Weights <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
