import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, Copy, Check, ExternalLink } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

interface StitchDefinition {
  abbr: string;
  usName: string;
  ukName?: string;
  ukAbbr?: string;
  description: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  videoUrl?: string;
}

const STITCHES: StitchDefinition[] = [
  // Basic Stitches
  {
    abbr: 'ch',
    usName: 'Chain',
    description: 'The foundation stitch. Yarn over, pull through loop on hook. Forms the base of most projects.',
    difficulty: 'basic',
  },
  {
    abbr: 'sl st',
    usName: 'Slip Stitch',
    description: 'Insert hook, yarn over, pull through both loops at once. Used to join rounds or move yarn without adding height.',
    difficulty: 'basic',
  },
  {
    abbr: 'sc',
    usName: 'Single Crochet',
    ukName: 'Double Crochet',
    ukAbbr: 'dc',
    description: 'Insert hook, yarn over, pull up loop (2 loops on hook), yarn over, pull through both loops. Creates a tight, dense fabric.',
    difficulty: 'basic',
  },
  {
    abbr: 'hdc',
    usName: 'Half Double Crochet',
    ukName: 'Half Treble Crochet',
    ukAbbr: 'htr',
    description: 'Yarn over, insert hook, yarn over, pull up loop (3 loops), yarn over, pull through all 3 loops. Taller than sc, shorter than dc.',
    difficulty: 'basic',
  },
  {
    abbr: 'dc',
    usName: 'Double Crochet',
    ukName: 'Treble Crochet',
    ukAbbr: 'tr',
    description: 'Yarn over, insert hook, yarn over, pull up loop, (yarn over, pull through 2 loops) twice. One of the most common stitches.',
    difficulty: 'basic',
  },
  {
    abbr: 'tr',
    usName: 'Treble Crochet',
    ukName: 'Double Treble Crochet',
    ukAbbr: 'dtr',
    description: 'Yarn over twice, insert hook, yarn over, pull up loop, (yarn over, pull through 2 loops) three times. Creates a tall, open fabric.',
    difficulty: 'basic',
  },
  {
    abbr: 'dtr',
    usName: 'Double Treble Crochet',
    ukName: 'Triple Treble',
    ukAbbr: 'ttr',
    description: 'Yarn over 3 times, then work off loops in pairs. Very tall stitch.',
    difficulty: 'intermediate',
  },
  
  // Increases & Decreases
  {
    abbr: 'inc',
    usName: 'Increase',
    description: 'Work 2 stitches in the same stitch. Adds width to your work.',
    difficulty: 'basic',
  },
  {
    abbr: 'dec',
    usName: 'Decrease',
    description: 'Work 2 stitches together as one. Removes width from your work.',
    difficulty: 'basic',
  },
  {
    abbr: 'sc2tog',
    usName: 'Single Crochet 2 Together',
    description: 'Insert hook in next st, pull up loop, insert in following st, pull up loop (3 loops), yarn over, pull through all 3. Invisible decrease.',
    difficulty: 'basic',
  },
  {
    abbr: 'dc2tog',
    usName: 'Double Crochet 2 Together',
    description: 'Work dc until 2 loops remain, work next dc until 3 loops remain, yarn over, pull through all 3.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'inv dec',
    usName: 'Invisible Decrease',
    description: 'Insert hook through front loops only of next 2 sts, yarn over, pull through both, yarn over, pull through 2. Cleaner than sc2tog for amigurumi.',
    difficulty: 'intermediate',
  },
  
  // Special Stitches
  {
    abbr: 'mr',
    usName: 'Magic Ring',
    description: 'Adjustable starting ring for working in rounds. Also called magic circle or magic loop. Pull tail to close center hole.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'FLO',
    usName: 'Front Loop Only',
    description: 'Work stitch through only the front loop of the stitch below. Creates a ridge on the back.',
    difficulty: 'basic',
  },
  {
    abbr: 'BLO',
    usName: 'Back Loop Only',
    description: 'Work stitch through only the back loop of the stitch below. Creates a ridge on the front, adds stretch.',
    difficulty: 'basic',
  },
  {
    abbr: 'BPdc',
    usName: 'Back Post Double Crochet',
    description: 'Insert hook from back to front around post of stitch below, complete dc. Creates texture and ribbing.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'FPdc',
    usName: 'Front Post Double Crochet',
    description: 'Insert hook from front to back around post of stitch below, complete dc. Creates texture and cables.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'bobble',
    usName: 'Bobble Stitch',
    description: 'Work multiple dc in same stitch but stop before final yarn over on each, then pull through all loops at once. Creates 3D bump.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'popcorn',
    usName: 'Popcorn Stitch',
    description: 'Work 5 dc in same st, remove hook, insert in first dc, grab dropped loop, pull through. Creates prominent bump.',
    difficulty: 'advanced',
  },
  {
    abbr: 'puff',
    usName: 'Puff Stitch',
    description: 'Yarn over, insert, pull up long loop - repeat 3-5 times in same st, yarn over, pull through all loops.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'shell',
    usName: 'Shell Stitch',
    description: 'Multiple stitches (usually 5 dc) worked in the same stitch. Creates a fan or shell shape.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'V-st',
    usName: 'V-Stitch',
    description: '(dc, ch 1, dc) in same stitch. Creates a V shape with a chain space in the middle.',
    difficulty: 'basic',
  },
  {
    abbr: 'picot',
    usName: 'Picot',
    description: 'Ch 3, sl st in first ch. Creates a small decorative bump, often used in edging.',
    difficulty: 'basic',
  },
  {
    abbr: 'spike',
    usName: 'Spike Stitch',
    description: 'Insert hook into a row below the current row, pull up a long loop, complete stitch. Creates color/texture effects.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'cl',
    usName: 'Cluster',
    description: 'Multiple stitches worked into different stitches but joined at the top. Creates a bundled effect.',
    difficulty: 'intermediate',
  },
  {
    abbr: 'crossed dc',
    usName: 'Crossed Double Crochet',
    description: 'Skip 1 st, dc in next, dc in skipped st working in front of first dc. Creates X pattern.',
    difficulty: 'intermediate',
  },
  
  // Pattern Terms
  {
    abbr: 'st',
    usName: 'Stitch',
    description: 'A single unit of crochet work. "St" can refer to any type of stitch.',
    difficulty: 'basic',
  },
  {
    abbr: 'sp',
    usName: 'Space',
    description: 'The gap or hole created by chain stitches in previous rows.',
    difficulty: 'basic',
  },
  {
    abbr: 'sk',
    usName: 'Skip',
    description: 'Pass over the indicated stitch without working into it.',
    difficulty: 'basic',
  },
  {
    abbr: 'rep',
    usName: 'Repeat',
    description: 'Work the instructions again as indicated.',
    difficulty: 'basic',
  },
  {
    abbr: 'tog',
    usName: 'Together',
    description: 'Join stitches together, usually for decreasing.',
    difficulty: 'basic',
  },
  {
    abbr: 'yo',
    usName: 'Yarn Over',
    description: 'Wrap yarn around hook from back to front. Fundamental motion in crochet.',
    difficulty: 'basic',
  },
  {
    abbr: 'RS',
    usName: 'Right Side',
    description: 'The front or public-facing side of your work.',
    difficulty: 'basic',
  },
  {
    abbr: 'WS',
    usName: 'Wrong Side',
    description: 'The back or inside of your work.',
    difficulty: 'basic',
  },
  {
    abbr: 'rnd',
    usName: 'Round',
    description: 'One complete circuit when working in the round (not turning).',
    difficulty: 'basic',
  },
  {
    abbr: 'row',
    usName: 'Row',
    description: 'One horizontal line of stitches, worked flat (turning at end).',
    difficulty: 'basic',
  },
  {
    abbr: 'PM',
    usName: 'Place Marker',
    description: 'Put a stitch marker in the indicated stitch for reference.',
    difficulty: 'basic',
  },
  {
    abbr: 'tch',
    usName: 'Turning Chain',
    description: 'Chain stitches at the beginning of a row to reach the height of the stitches in that row.',
    difficulty: 'basic',
  },
  {
    abbr: 'ea',
    usName: 'Each',
    description: 'Work the instruction into every stitch indicated.',
    difficulty: 'basic',
  },
  {
    abbr: 'alt',
    usName: 'Alternate',
    description: 'Work instructions in every other stitch or row.',
    difficulty: 'basic',
  },
  {
    abbr: 'approx',
    usName: 'Approximately',
    description: 'About, or close to the measurement given.',
    difficulty: 'basic',
  },
  {
    abbr: 'beg',
    usName: 'Beginning',
    description: 'Start or first stitch/row of a section.',
    difficulty: 'basic',
  },
  {
    abbr: 'cont',
    usName: 'Continue',
    description: 'Keep working as established.',
    difficulty: 'basic',
  },
  {
    abbr: 'rem',
    usName: 'Remaining',
    description: 'The stitches that are left.',
    difficulty: 'basic',
  },
  {
    abbr: 'x',
    usName: 'Times',
    description: 'Repeat the indicated number of times. "6x" means repeat 6 times.',
    difficulty: 'basic',
  },
  {
    abbr: '()',
    usName: 'Parentheses',
    description: 'Work instructions inside parentheses as a group, or stitch count at end of row.',
    difficulty: 'basic',
  },
  {
    abbr: '[]',
    usName: 'Brackets',
    description: 'Work instructions inside brackets the number of times indicated after.',
    difficulty: 'basic',
  },
  {
    abbr: '*',
    usName: 'Asterisk',
    description: 'Repeat instructions following the asterisk as directed.',
    difficulty: 'basic',
  },
];

export function StitchGlossaryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  const [showUK, setShowUK] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredStitches = useMemo(() => {
    let result = STITCHES;
    
    if (filter !== 'all') {
      result = result.filter(s => s.difficulty === filter);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.abbr.toLowerCase().includes(q) ||
        s.usName.toLowerCase().includes(q) ||
        (s.ukName && s.ukName.toLowerCase().includes(q)) ||
        (s.ukAbbr && s.ukAbbr.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [search, filter]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'basic': return 'bg-[#7FBFA0]/15 text-[#2D7A4F]';
      case 'intermediate': return 'bg-[#E8B86A]/15 text-[#A67C3D]';
      case 'advanced': return 'bg-[#E86A58]/15 text-[#C4483A]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <SEOHead
        title="Crochet Stitch Abbreviations Guide - US & UK Terms | MyCrochetKit"
        description="Complete crochet abbreviation glossary with US and UK terms. Learn what sc, dc, hdc, tr, BLO, FPdc mean. Free searchable stitch dictionary for crocheters."
        canonicalUrl="https://mycrochetkit.com/stitch-glossary"
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-5xl mx-auto flex items-center gap-4 px-6 py-4">
            <Link
              to="/tools"
              className="flex items-center gap-2 text-[#2C1810]/70 hover:text-[#2C1810] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B8A9C9] to-[#8B7A9C] flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">Stitch Glossary</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C1810]/40" />
              <input
                type="text"
                placeholder="Search stitches... (e.g., 'sc', 'double crochet', 'decrease')"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2C1810] placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                {(['all', 'basic', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilter(level)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      filter === level
                        ? 'bg-[#E86A58] text-white'
                        : 'bg-white text-[#2C1810]/70 hover:bg-[#E86A58]/10'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowUK(!showUK)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  showUK
                    ? 'bg-[#B8A9C9] text-white'
                    : 'bg-white text-[#2C1810]/70 hover:bg-[#B8A9C9]/20'
                }`}
              >
                {showUK ? '🇬🇧 UK Terms Shown' : '🇺🇸 US Terms'}
              </button>
            </div>
          </div>

          {/* Info Banner */}
          {showUK && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-[#B8A9C9]/10 border border-[#B8A9C9]/20 rounded-2xl"
            >
              <p className="text-sm text-[#2C1810]/70">
                <strong>UK vs US Terms:</strong> UK crochet terms are "one step up" from US terms. 
                US single crochet = UK double crochet. US double crochet = UK treble crochet.
              </p>
            </motion.div>
          )}

          {/* Results Count */}
          <p className="text-sm text-[#2C1810]/60 mb-4">
            {filteredStitches.length} {filteredStitches.length === 1 ? 'stitch' : 'stitches'} found
          </p>

          {/* Stitch List */}
          <div className="space-y-4">
            {filteredStitches.map((stitch, index) => (
              <motion.div
                key={stitch.abbr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#2C1810]/5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-bold text-[#E86A58] font-mono">
                      {stitch.abbr}
                    </span>
                    {showUK && stitch.ukAbbr && (
                      <span className="text-lg font-bold text-[#B8A9C9] font-mono">
                        / {stitch.ukAbbr}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor(stitch.difficulty)}`}>
                      {stitch.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${stitch.abbr}: ${stitch.usName}`)}
                    className="p-2 text-[#2C1810]/40 hover:text-[#E86A58] transition-colors"
                    title="Copy"
                  >
                    {copied === `${stitch.abbr}: ${stitch.usName}` ? (
                      <Check className="w-4 h-4 text-[#7FBFA0]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-[#2C1810] mb-1">
                  {stitch.usName}
                  {showUK && stitch.ukName && (
                    <span className="text-[#B8A9C9] font-normal ml-2">
                      (UK: {stitch.ukName})
                    </span>
                  )}
                </h3>

                <p className="text-[#2C1810]/70 leading-relaxed">
                  {stitch.description}
                </p>

                {stitch.videoUrl && (
                  <a
                    href={stitch.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#E86A58] hover:underline"
                  >
                    Watch Tutorial <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {filteredStitches.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#2C1810]/20" />
              <h3 className="text-lg font-medium text-[#2C1810]/60 mb-2">No stitches found</h3>
              <p className="text-[#2C1810]/40">Try a different search term or filter</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-8 bg-white rounded-3xl shadow-sm border border-[#2C1810]/5 text-center">
            <h2 className="text-2xl font-bold text-[#2C1810] mb-3">
              Track your stitches hands-free
            </h2>
            <p className="text-[#2C1810]/70 mb-6">
              Use voice commands to count rows while you crochet. Just say "next" to count.
            </p>
            <Link
              to="/quick-counter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-semibold rounded-xl transition-colors"
            >
              Try Voice Counter Free
            </Link>
          </div>
        </main>

        <footer className="border-t border-[#2C1810]/5 bg-white mt-12">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[#2C1810]/65 text-sm">© 2026 MyCrochetKit</span>
            <div className="flex gap-6">
              <Link to="/tools" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm">Free Tools</Link>
              <Link to="/blog" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm">Blog</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
