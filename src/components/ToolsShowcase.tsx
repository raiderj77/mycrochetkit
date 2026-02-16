import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, BookOpen, Calculator, Ruler, Grid3x3, FileText, Clock, Thermometer, Crown, ChevronDown, Sparkles, ArrowRight, Repeat, CircleDot, Hash } from 'lucide-react';

const FREE_TOOLS = [
  { icon: Mic, name: 'Voice Counter', desc: 'Say "next" to count rows hands-free. Works offline.', color: '#E86A58' },
  { icon: BookOpen, name: 'Stitch Glossary', desc: '60+ stitches with abbreviations and descriptions.', color: '#B8A9C9' },
  { icon: Calculator, name: 'Yarn Calculator', desc: 'Calculate yardage needed for any project size.', color: '#7FBFA0' },
  { icon: Ruler, name: 'Hook Converter', desc: 'US, UK, and metric hook sizes side by side.', color: '#eab308' },
  { icon: Grid3x3, name: 'C2C Pattern Generator', desc: 'Turn any image into a corner-to-corner chart.', color: '#E86A58' },
  { icon: FileText, name: 'Pattern Notes', desc: 'Attach notes, warnings, and mods to specific rows.', color: '#7FBFA0' },
  { icon: Repeat, name: 'Yarn Substitution', desc: 'Convert yardage between yarn weights safely.', color: '#f97316' },
  { icon: CircleDot, name: 'Hat Calculator', desc: 'Calculate stitches for any hat size from your gauge.', color: '#a78bfa' },
  { icon: Hash, name: 'Stitch Multiples', desc: 'Find the nearest stitch count for any pattern repeat.', color: '#B8A9C9' },
];

const PRO_FEATURES = [
  { icon: Clock, name: 'Project Timer + Seller Pricing', desc: 'Track work time per project. Auto-calculates fair selling prices from labor + materials.', color: '#E86A58' },
  { icon: Thermometer, name: 'Temperature Blanket Planner', desc: 'Custom color charts, daily temp logging, yarn-per-color estimates. All year, one place.', color: '#ef4444' },
  { icon: Grid3x3, name: 'Granny Square Layout', desc: 'Arrange and randomize square colors digitally. No more crawling on the floor.', color: '#B8A9C9' },
  { icon: Sparkles, name: 'Unlimited Projects + Cloud Sync', desc: 'Free gets 3 projects. Pro gets unlimited with automatic cloud backup across devices.', color: '#7FBFA0' },
];

export function ToolsShowcase() {
  const [showAllFree, setShowAllFree] = useState(false);
  const visibleFree = showAllFree ? FREE_TOOLS : FREE_TOOLS.slice(0, 6);
  return (
    <div className="py-16 px-4 max-w-5xl mx-auto space-y-20">
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">9 free tools. No catch.</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Everything you need to crochet smarter. Voice counter, calculators, stitch glossary, and more. Free forever.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {visibleFree.map((tool, i) => (
              <motion.div key={tool.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: i * 0.05 }} className="group p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tool.color + '15' }}>
                    <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-sm mb-1">{tool.name}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {FREE_TOOLS.length > 6 && (
          <div className="text-center mt-6">
            <motion.button onClick={() => setShowAllFree(!showAllFree)} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[#E86A58] hover:text-[#D35A4A] text-sm font-medium transition-colors" whileTap={{ scale: 0.97 }}>
              {showAllFree ? 'Show less' : `+ ${FREE_TOOLS.length - 6} more free tools`}
              <motion.span animate={{ rotate: showAllFree ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </div>
        )}
      </section>
      <section>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E86A58]/10 mb-4">
            <Crown className="w-4 h-4 text-[#E86A58]" />
            <span className="text-[#E86A58] text-sm font-bold uppercase tracking-wider">Pro</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Built for serious makers.</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Tools you won't find anywhere else. Temperature planners, seller pricing, layout designers, and unlimited everything.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRO_FEATURES.map((feat, i) => (
            <motion.div key={feat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F6] to-white border border-[#E86A58]/10 hover:border-[#E86A58]/25 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: feat.color + '12' }}>
                  <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold mb-1.5 flex items-center gap-2">{feat.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-b from-[#FFF5F3] to-white border border-[#E86A58]/10 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-gray-300 line-through text-lg">$99</span>
              <span className="text-gray-900 text-5xl font-bold">$59.99</span>
              <span className="text-gray-400 text-sm">lifetime</span>
            </div>
            <p className="text-gray-400 text-sm">Or $4.99/mo · $49.99/yr · No recurring surprises</p>
            <button className="mt-1 inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E86A58] to-[#D35A4A] text-[#3D352E] font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow text-lg">
              Get Pro <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-gray-300 text-xs">Payment coming soon. Join the waitlist to lock in founders pricing.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
