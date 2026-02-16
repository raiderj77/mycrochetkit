#!/bin/bash
# Script to add Tools section and update imports in App.tsx

set -e

echo "🔧 Updating App.tsx..."

# Backup original
cp src/App.tsx src/App.tsx.backup
echo "✅ Created backup: src/App.tsx.backup"

# Step 1: Update imports (line 16)
echo "📝 Updating imports..."
sed -i '16s/.*/import { Mic, ArrowRight, Sparkles, WifiOff, Mail, Play, FileText, Loader2, BookOpen, Calculator, Ruler, Grid3x3 } from '\''lucide-react'\'';/' src/App.tsx

# Step 2: Create tools section
cat > /tmp/tools-section.txt << 'EOF'

        {/* Free Tools Section */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-[#7FBFA0]/15 text-[#2D7A4F] text-sm font-medium rounded-full mb-4">
                100% Free Tools
              </span>
              <h2 className="display-font text-4xl md:text-5xl text-[#2C1810] mb-4">
                Everything You Need to Crochet Smarter
              </h2>
              <p className="text-lg text-[#2C1810]/70 max-w-2xl mx-auto">
                No account required. Works offline. Always free.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <Link to="/quick-counter" className="group block bg-gradient-to-br from-[#E86A58] to-[#D35A4A] rounded-2xl p-6 text-white hover:shadow-xl transition-all h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <Mic className="w-8 h-8" />
                    <span className="px-2 py-0.5 bg-white/20 text-xs font-semibold rounded-full">Most Popular</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Voice Row Counter</h3>
                  <p className="text-white/90 mb-4">Hands-free counting. Just say "next" to count rows.</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">Try Free <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <Link to="/stitch-glossary" className="group block bg-white rounded-2xl p-6 border border-[#2C1810]/10 hover:border-[#B8A9C9]/50 hover:shadow-lg transition-all h-full">
                  <BookOpen className="w-8 h-8 text-[#B8A9C9] mb-3" />
                  <h3 className="text-xl font-bold text-[#2C1810] mb-2">Stitch Glossary</h3>
                  <p className="text-[#2C1810]/70 mb-4">40+ crochet abbreviations with US & UK terms. Searchable.</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8A9C9] group-hover:gap-3 transition-all">Look Up Stitches <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <Link to="/yarn-calculator" className="group block bg-white rounded-2xl p-6 border border-[#2C1810]/10 hover:border-[#7FBFA0]/50 hover:shadow-lg transition-all h-full">
                  <Calculator className="w-8 h-8 text-[#7FBFA0] mb-3" />
                  <h3 className="text-xl font-bold text-[#2C1810] mb-2">Yarn Calculator</h3>
                  <p className="text-[#2C1810]/70 mb-4">Calculate exactly how much yarn you need for any project.</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#7FBFA0] group-hover:gap-3 transition-all">Calculate Yarn <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <Link to="/hook-converter" className="group block bg-white rounded-2xl p-6 border border-[#2C1810]/10 hover:border-[#E8B86A]/50 hover:shadow-lg transition-all h-full">
                  <Ruler className="w-8 h-8 text-[#E8B86A] mb-3" />
                  <h3 className="text-xl font-bold text-[#2C1810] mb-2">Hook Size Converter</h3>
                  <p className="text-[#2C1810]/70 mb-4">Convert between US, UK, and metric hook sizes instantly.</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#E8B86A] group-hover:gap-3 transition-all">Convert Sizes <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <Link to="/tools/c2c-generator" className="group block bg-white rounded-2xl p-6 border border-[#2C1810]/10 hover:border-[#6AB8E8]/50 hover:shadow-lg transition-all h-full">
                  <Grid3x3 className="w-8 h-8 text-[#6AB8E8] mb-3" />
                  <h3 className="text-xl font-bold text-[#2C1810] mb-2">C2C Pattern Generator</h3>
                  <p className="text-[#2C1810]/70 mb-4">Create corner-to-corner patterns from any image.</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#6AB8E8] group-hover:gap-3 transition-all">Generate Pattern <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                <Link to="/tools" className="group flex flex-col items-center justify-center bg-[#FFF8F0] rounded-2xl p-6 border-2 border-dashed border-[#2C1810]/20 hover:border-[#E86A58]/50 hover:bg-white transition-all h-full min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-[#E86A58]/10 flex items-center justify-center mb-3">
                    <ArrowRight className="w-6 h-6 text-[#E86A58]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2C1810] mb-2">View All Tools</h3>
                  <p className="text-[#2C1810]/60 text-sm text-center">Explore our complete toolkit</p>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
EOF

# Insert before Trust Section
sed -i '/^        {\/\* Trust Section \*\/}$/e cat /tmp/tools-section.txt' src/App.tsx

echo "✅ App.tsx updated!"
echo ""
echo "Next: npm run build && firebase deploy"
