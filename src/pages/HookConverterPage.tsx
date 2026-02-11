import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Ruler, Search } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

interface HookSize {
  metric: number;
  us: string;
  uk: string;
  yarnWeight: string;
}

const HOOK_SIZES: HookSize[] = [
  { metric: 2.0, us: '-', uk: '14', yarnWeight: 'Lace' },
  { metric: 2.25, us: 'B/1', uk: '13', yarnWeight: 'Lace/Fingering' },
  { metric: 2.5, us: '-', uk: '12', yarnWeight: 'Fingering' },
  { metric: 2.75, us: 'C/2', uk: '11', yarnWeight: 'Fingering' },
  { metric: 3.0, us: '-', uk: '11', yarnWeight: 'Fingering/Sport' },
  { metric: 3.25, us: 'D/3', uk: '10', yarnWeight: 'Sport' },
  { metric: 3.5, us: 'E/4', uk: '9', yarnWeight: 'Sport/DK' },
  { metric: 3.75, us: 'F/5', uk: '9', yarnWeight: 'DK' },
  { metric: 4.0, us: 'G/6', uk: '8', yarnWeight: 'DK/Worsted' },
  { metric: 4.5, us: '7', uk: '7', yarnWeight: 'Worsted' },
  { metric: 5.0, us: 'H/8', uk: '6', yarnWeight: 'Worsted' },
  { metric: 5.5, us: 'I/9', uk: '5', yarnWeight: 'Worsted/Aran' },
  { metric: 6.0, us: 'J/10', uk: '4', yarnWeight: 'Aran' },
  { metric: 6.5, us: 'K/10.5', uk: '3', yarnWeight: 'Aran/Bulky' },
  { metric: 7.0, us: '-', uk: '2', yarnWeight: 'Bulky' },
  { metric: 8.0, us: 'L/11', uk: '0', yarnWeight: 'Bulky' },
  { metric: 9.0, us: 'M/13', uk: '00', yarnWeight: 'Super Bulky' },
  { metric: 10.0, us: 'N/15', uk: '000', yarnWeight: 'Super Bulky' },
  { metric: 11.5, us: 'P/16', uk: '-', yarnWeight: 'Jumbo' },
  { metric: 12.0, us: '-', uk: '-', yarnWeight: 'Jumbo' },
  { metric: 15.0, us: 'Q/19', uk: '-', yarnWeight: 'Jumbo' },
  { metric: 16.0, us: 'S', uk: '-', yarnWeight: 'Jumbo' },
  { metric: 19.0, us: '-', uk: '-', yarnWeight: 'Jumbo' },
  { metric: 25.0, us: '-', uk: '-', yarnWeight: 'Jumbo' },
];

export function HookConverterPage() {
  const [search, setSearch] = useState('');
  const [selectedSize, setSelectedSize] = useState<HookSize | null>(null);

  const filteredSizes = useMemo(() => {
    if (!search.trim()) return HOOK_SIZES;
    const query = search.toLowerCase().trim();
    return HOOK_SIZES.filter(
      (size) =>
        size.metric.toString().includes(query) ||
        size.us.toLowerCase().includes(query) ||
        size.uk.toLowerCase().includes(query) ||
        size.yarnWeight.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <>
      <SEOHead
        title="Crochet Hook Size Converter - US, UK, Metric Chart | MyCrochetKit"
        description="Convert crochet hook sizes between US, UK, and metric measurements. Free hook size chart with recommended yarn weights. No signup required."
        canonicalUrl="https://mycrochetkit.com/hook-converter"
      />

      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
            <Link
              to="/tools"
              className="flex items-center gap-2 text-[#2C1810]/70 hover:text-[#2C1810] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">All Tools</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B8A9C9] to-[#8B7A9C] flex items-center justify-center">
                <Ruler className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#2C1810]">Hook Converter</span>
            </div>
            <div className="w-20" />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-2 text-center">
              Crochet Hook Size Converter
            </h1>
            <p className="text-[#2C1810]/70 text-center mb-8">
              Convert between US, UK, and metric hook sizes instantly.
            </p>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C1810]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by size (e.g., 5mm, H/8, worsted)..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-[#2C1810] placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 shadow-sm border border-[#2C1810]/5"
              />
            </div>

            {/* Selected Size Card */}
            {selectedSize && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-[#B8A9C9]/20 to-[#E86A58]/10 rounded-3xl p-8 mb-8 border border-[#B8A9C9]/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-[#2C1810]/60 uppercase tracking-wider">Selected Hook</h2>
                  <button
                    onClick={() => setSelectedSize(null)}
                    className="text-sm text-[#2C1810]/50 hover:text-[#2C1810]"
                  >
                    Clear
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold text-[#2C1810]">{selectedSize.metric}mm</div>
                    <div className="text-sm text-[#2C1810]/60">Metric</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#E86A58]">{selectedSize.us}</div>
                    <div className="text-sm text-[#2C1810]/60">US</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#B8A9C9]">{selectedSize.uk}</div>
                    <div className="text-sm text-[#2C1810]/60">UK/Canadian</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="inline-block px-4 py-2 bg-white/60 rounded-full text-sm text-[#2C1810]/70">
                    Recommended for: <strong>{selectedSize.yarnWeight}</strong> weight yarn
                  </span>
                </div>
              </motion.div>
            )}

            {/* Size Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#2C1810]/5 overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 bg-[#2C1810]/5 text-sm font-semibold text-[#2C1810]/70">
                <div>Metric (mm)</div>
                <div>US</div>
                <div>UK/Canadian</div>
                <div>Yarn Weight</div>
              </div>
              <div className="divide-y divide-[#2C1810]/5 max-h-[500px] overflow-y-auto">
                {filteredSizes.map((size) => (
                  <motion.button
                    key={size.metric}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full grid grid-cols-4 gap-4 p-4 text-left hover:bg-[#FFF8F0] transition-colors ${
                      selectedSize?.metric === size.metric ? 'bg-[#E86A58]/5' : ''
                    }`}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="font-semibold text-[#2C1810]">{size.metric}</div>
                    <div className="text-[#E86A58] font-medium">{size.us}</div>
                    <div className="text-[#B8A9C9] font-medium">{size.uk}</div>
                    <div className="text-[#2C1810]/60 text-sm">{size.yarnWeight}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {filteredSizes.length === 0 && (
              <div className="text-center py-12 text-[#2C1810]/60">
                No hook sizes match your search. Try a different term.
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 bg-[#7FBFA0]/10 rounded-2xl p-6 border border-[#7FBFA0]/20">
              <h3 className="font-semibold text-[#2C1810] mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-[#2C1810]/70">
                <li>• US and UK sizing runs in <strong>opposite directions</strong> — US increases as hook gets larger, UK decreases.</li>
                <li>• When in doubt, go with the <strong>metric measurement</strong> — it's the most precise.</li>
                <li>• Always make a <strong>gauge swatch</strong> to ensure your tension matches the pattern.</li>
                <li>• Ergonomic hooks often measure differently — check the actual size, not just the label.</li>
              </ul>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
