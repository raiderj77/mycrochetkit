import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, BookOpen, Ruler, Mic, ExternalLink, Palette, Scale, Scissors, Grid3X3, Waves, BarChart3, DollarSign, Minus, Sparkles } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

const fiberTools = [
  {
    url: 'https://fibertools.app/stitch-counter',
    title: 'Stitch Counter',
    description: 'Voice-activated row and stitch counter. Say "next" to count hands-free.',
    icon: Mic,
    color: 'from-[#5E8A5E] to-[#4A6F4A]',
    highlight: 'Most Popular',
  },
  {
    url: 'https://fibertools.app/yarn-calculator',
    title: 'Yarn Calculator',
    description: 'Calculate yardage needed for any project by dimensions, weight, and gauge.',
    icon: Scale,
    color: 'from-[#A8C1A8] to-[#4A6F4A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/blanket-calculator',
    title: 'Blanket Size Calculator',
    description: 'Standard blanket dimensions with yardage estimates by yarn weight.',
    icon: Grid3X3,
    color: 'from-[#E8B86A] to-[#D4A04A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/gauge-calculator',
    title: 'Gauge Calculator',
    description: 'Convert gauge swatches to stitch and row counts for any project size.',
    icon: Ruler,
    color: 'from-[#6AB8E8] to-[#4A98C8]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/hook-converter',
    title: 'Hook Size Converter',
    description: 'Convert between US, UK, metric, and steel crochet hook sizes.',
    icon: Ruler,
    color: 'from-[#8D7B6A] to-[#5D5044]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/yarn-weight-chart',
    title: 'Yarn Weight Chart',
    description: 'Compare yarn weights from lace to jumbo with recommended hooks and gauges.',
    icon: BarChart3,
    color: 'from-[#7A9CC8] to-[#5A7CA8]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/abbreviations',
    title: 'Stitch Abbreviations',
    description: 'Decode any crochet abbreviation. US and UK terms with explanations.',
    icon: BookOpen,
    color: 'from-[#C9A97A] to-[#A8895A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/cost-calculator',
    title: 'Project Cost Calculator',
    description: 'Estimate total project cost including yarn, hooks, and supplies.',
    icon: DollarSign,
    color: 'from-[#A8C1A8] to-[#4A6F4A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/inc-dec-calculator',
    title: 'Increase/Decrease Calculator',
    description: 'Calculate evenly spaced increases and decreases for shaping.',
    icon: Minus,
    color: 'from-[#5E8A5E] to-[#4A6F4A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/stripe-generator',
    title: 'Stripe Pattern Generator',
    description: 'Generate random or structured stripe sequences with color palettes.',
    icon: Palette,
    color: 'from-[#C97A8B] to-[#A85A6B]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/color-pooling',
    title: 'Color Pooling Planner',
    description: 'Plan pooling projects with variegated yarn color repeat calculations.',
    icon: Waves,
    color: 'from-[#6AB8E8] to-[#4A98C8]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/spinning-calculator',
    title: 'Spinning Calculator',
    description: 'Estimate finished yardage from fiber weight for handspinning projects.',
    icon: Sparkles,
    color: 'from-[#8D7B6A] to-[#5D5044]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/cross-stitch-calculator',
    title: 'Cross Stitch Calculator',
    description: 'Calculate Aida fabric size, thread estimates, and count conversions.',
    icon: Grid3X3,
    color: 'from-[#E8B86A] to-[#D4A04A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/weaving-sett',
    title: 'Weaving Sett Calculator',
    description: 'Find optimal ends per inch based on yarn weight and weave structure.',
    icon: Calculator,
    color: 'from-[#8BC97A] to-[#6BA85A]',
    highlight: null,
  },
  {
    url: 'https://fibertools.app/thread-converter',
    title: 'Thread Size Converter',
    description: 'Convert between crochet thread sizes, tex, denier, and metric systems.',
    icon: Scissors,
    color: 'from-[#7A9CC8] to-[#5A7CA8]',
    highlight: null,
  },
];

export function FreeToolsPage() {
  return (
    <>
      <SEOHead
        title="Free Fiber Arts Tools - 15 Calculators & Converters | FiberTools"
        description="15 free crochet, knitting, and fiber arts tools: yarn calculator, stitch counter, gauge calculator, hook converter, stripe generator, and more. No signup required."
        canonicalUrl="https://mycrochetkit.com/tools"
      />

      <div className="min-h-screen bg-[#FEFDFB]">
        <header className="sticky top-0 z-50 bg-[#FEFDFB]/80 backdrop-blur-xl border-b border-[#3D352E]/5">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5E8A5E] to-[#4A6F4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#3D352E] text-lg">MyCrochetKit</span>
            </Link>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 bg-[#A8C1A8]/15 text-[#4A6F4A] text-sm font-medium rounded-full mb-4">
                100% Free &middot; No Signup Required
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#3D352E] mb-6">
                Free Fiber Arts Tools
              </h1>
              <p className="text-xl text-[#3D352E] max-w-2xl mx-auto">
                15 calculators, converters, and planners for crochet, knitting, weaving, and more &mdash; all on{' '}
                <a href="https://fibertools.app" target="_blank" rel="noopener noreferrer" className="text-[#5E8A5E] hover:text-[#4A6F4A] underline">
                  fibertools.app
                </a>.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
            {fiberTools.map((tool, index) => (
              <motion.div
                key={tool.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl p-6 shadow-sm border border-[#3D352E]/5 hover:shadow-lg hover:border-[#5E8A5E]/20 transition-all h-full"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-[#3D352E] group-hover:text-[#5E8A5E] transition-colors">
                          {tool.title}
                        </h2>
                        <ExternalLink className="w-3.5 h-3.5 text-[#3D352E]/25 group-hover:text-[#5E8A5E] transition-colors flex-shrink-0" />
                        {tool.highlight && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#5E8A5E]/10 text-[#5E8A5E] flex-shrink-0">
                            {tool.highlight}
                          </span>
                        )}
                      </div>
                      <p className="text-[#746454] text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#3D352E] mb-4">
              Want to save your projects?
            </h2>
            <p className="text-[#3D352E] mb-8">
              Create a free account to track projects, sync across devices, and access premium features.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#5E8A5E] hover:bg-[#4A6F4A] text-white rounded-2xl font-semibold transition-colors"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-[#3D352E]/5 bg-[#FEFDFB]">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[#3D352E]/65 text-sm">&copy; 2026 MyCrochetKit</span>
            <div className="flex gap-6">
              <Link to="/blog" className="text-[#3D352E]/65 hover:text-[#5E8A5E] text-sm transition-colors">Blog</Link>
              <Link to="/roadmap" className="text-[#3D352E]/65 hover:text-[#5E8A5E] text-sm transition-colors">Roadmap</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
