import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, BookOpen, Ruler, Mic } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

const tools = [
  {
    slug: '/quick-counter',
    title: 'Voice Row Counter',
    description: 'Hands-free row counting. Say "next" to count. No signup required.',
    icon: Mic,
    color: 'from-[#E86A58] to-[#D35A4A]',
    highlight: 'Most Popular',
  },
  {
    slug: '/yarn-calculator',
    title: 'Yarn Calculator',
    description: 'Calculate how much yarn you need for any project based on dimensions and gauge.',
    icon: Calculator,
    color: 'from-[#7FBFA0] to-[#5A9A7A]',
    highlight: null,
  },
  {
    slug: '/hook-converter',
    title: 'Hook Size Converter',
    description: 'Convert between US, UK, and metric crochet hook sizes instantly.',
    icon: Ruler,
    color: 'from-[#B8A9C9] to-[#8B7A9C]',
    highlight: null,
  },
  {
    slug: '/stitch-glossary',
    title: 'Stitch Abbreviation Guide',
    description: 'Decode any crochet abbreviation. US and UK terms with explanations.',
    icon: BookOpen,
    color: 'from-[#E8B86A] to-[#D4A04A]',
    highlight: '40+ Stitches',
  },
  {
    slug: '/tools/c2c-generator',
    title: 'C2C Pattern Generator',
    description: 'Create corner-to-corner patterns from any image or draw your own grid.',
    icon: Calculator,
    color: 'from-[#6AB8E8] to-[#4A98C8]',
    highlight: 'New',
  },
];

export function FreeToolsPage() {
  return (
    <>
      <SEOHead
        title="Free Crochet Tools - Yarn Calculator, Hook Converter, Row Counter | MyCrochetKit"
        description="Free online crochet tools: voice-activated row counter, yarn calculator, hook size converter, stitch glossary. No signup required. Works offline."
        canonicalUrl="https://mycrochetkit.com/tools"
      />
      
      <div className="min-h-screen bg-[#FFF8F0]">
        <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E86A58] to-[#D35A4A] flex items-center justify-center shadow-md">
                <span className="text-xl">🧶</span>
              </div>
              <span className="font-semibold text-[#2C1810] text-lg">MyCrochetKit</span>
            </Link>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1.5 bg-[#7FBFA0]/15 text-[#2D7A4F] text-sm font-medium rounded-full mb-4">
                100% Free • No Signup • Works Offline
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] mb-6">
                Free Crochet Tools
              </h1>
              <p className="text-xl text-[#2C1810]/70 max-w-2xl mx-auto">
                Everything you need to crochet smarter. No account required.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={tool.slug}
                  className="group block bg-white rounded-3xl p-8 shadow-sm border border-[#2C1810]/5 hover:shadow-lg hover:border-[#E86A58]/20 transition-all h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    {tool.highlight && (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        tool.highlight === 'Most Popular' 
                          ? 'bg-[#E86A58]/10 text-[#E86A58]' 
                          : 'bg-[#7FBFA0]/15 text-[#2D7A4F]'
                      }`}>
                        {tool.highlight}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-[#2C1810] mb-2 group-hover:text-[#E86A58] transition-colors">
                    {tool.title}
                  </h2>
                  
                  <p className="text-[#2C1810]/70 mb-4">
                    {tool.description}
                  </p>
                  
                  <span className="text-[#E86A58] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Use Tool <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-4">
              Want to save your projects?
            </h2>
            <p className="text-[#2C1810]/70 mb-8">
              Create a free account to sync your work across devices and access premium features.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E86A58] hover:bg-[#D35A4A] text-white rounded-2xl font-semibold transition-colors"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-[#2C1810]/5 bg-[#FFF8F0]">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[#2C1810]/65 text-sm">© 2026 MyCrochetKit</span>
            <div className="flex gap-6">
              <Link to="/blog" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm transition-colors">
                Blog
              </Link>
              <Link to="/roadmap" className="text-[#2C1810]/65 hover:text-[#E86A58] text-sm transition-colors">
                Roadmap
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
