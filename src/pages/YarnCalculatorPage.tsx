import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Share2, Copy, Check } from 'lucide-react';
import { SEOHead } from '../seo/components/SEOHead';

type ProjectType = 'blanket' | 'scarf' | 'hat' | 'sweater' | 'amigurumi' | 'custom';
type Unit = 'inches' | 'cm';
type YarnWeight = 'lace' | 'fingering' | 'sport' | 'dk' | 'worsted' | 'aran' | 'bulky' | 'super-bulky';

interface YarnWeightInfo {
  name: string;
  yardsPerSquareInch: number; // approximate yards needed per square inch
  metersPerSquareCm: number;
}

const YARN_WEIGHTS: Record<YarnWeight, YarnWeightInfo> = {
  'lace': { name: 'Lace (0)', yardsPerSquareInch: 0.8, metersPerSquareCm: 0.28 },
  'fingering': { name: 'Fingering (1)', yardsPerSquareInch: 0.9, metersPerSquareCm: 0.32 },
  'sport': { name: 'Sport (2)', yardsPerSquareInch: 1.0, metersPerSquareCm: 0.35 },
  'dk': { name: 'DK (3)', yardsPerSquareInch: 1.2, metersPerSquareCm: 0.42 },
  'worsted': { name: 'Worsted (4)', yardsPerSquareInch: 1.5, metersPerSquareCm: 0.52 },
  'aran': { name: 'Aran (4.5)', yardsPerSquareInch: 1.7, metersPerSquareCm: 0.60 },
  'bulky': { name: 'Bulky (5)', yardsPerSquareInch: 2.0, metersPerSquareCm: 0.70 },
  'super-bulky': { name: 'Super Bulky (6)', yardsPerSquareInch: 2.5, metersPerSquareCm: 0.88 },
};

const PROJECT_PRESETS: Record<ProjectType, { width: number; height: number; unit: Unit; label: string }> = {
  'blanket': { width: 50, height: 60, unit: 'inches', label: 'Throw Blanket (50×60")' },
  'scarf': { width: 8, height: 60, unit: 'inches', label: 'Scarf (8×60")' },
  'hat': { width: 22, height: 8, unit: 'inches', label: 'Adult Hat (22" circ × 8" tall)' },
  'sweater': { width: 40, height: 28, unit: 'inches', label: 'Adult Sweater (approx)' },
  'amigurumi': { width: 5, height: 5, unit: 'inches', label: 'Small Amigurumi' },
  'custom': { width: 0, height: 0, unit: 'inches', label: 'Custom Dimensions' },
};

export function YarnCalculatorPage() {
  const [projectType, setProjectType] = useState<ProjectType>('blanket');
  const [width, setWidth] = useState(PROJECT_PRESETS.blanket.width);
  const [height, setHeight] = useState(PROJECT_PRESETS.blanket.height);
  const [unit, setUnit] = useState<Unit>('inches');
  const [yarnWeight, setYarnWeight] = useState<YarnWeight>('worsted');
  const [copied, setCopied] = useState(false);

  const handleProjectChange = (type: ProjectType) => {
    setProjectType(type);
    if (type !== 'custom') {
      const preset = PROJECT_PRESETS[type];
      setWidth(preset.width);
      setHeight(preset.height);
      setUnit(preset.unit);
    }
  };

  const result = useMemo(() => {
    const yarnInfo = YARN_WEIGHTS[yarnWeight];
    let area: number;
    let yardsNeeded: number;
    let metersNeeded: number;

    if (unit === 'inches') {
      area = width * height;
      yardsNeeded = area * yarnInfo.yardsPerSquareInch;
      metersNeeded = yardsNeeded * 0.9144;
    } else {
      area = width * height;
      metersNeeded = area * yarnInfo.metersPerSquareCm;
      yardsNeeded = metersNeeded / 0.9144;
    }

    // Add 15% buffer for joins, mistakes, etc.
    const buffer = 1.15;
    yardsNeeded = Math.ceil(yardsNeeded * buffer);
    metersNeeded = Math.ceil(metersNeeded * buffer);

    // Calculate skeins needed (assuming common skein sizes)
    const skeinsSmall = Math.ceil(yardsNeeded / 220); // Worsted typical
    const skeinsLarge = Math.ceil(yardsNeeded / 380); // Large skein

    return {
      yards: yardsNeeded,
      meters: metersNeeded,
      skeinsSmall,
      skeinsLarge,
    };
  }, [width, height, unit, yarnWeight]);

  const handleShare = async () => {
    const text = `Yarn needed for ${width}${unit === 'inches' ? '"' : 'cm'} × ${height}${unit === 'inches' ? '"' : 'cm'} project with ${YARN_WEIGHTS[yarnWeight].name} weight yarn:\n\n📏 ${result.yards.toLocaleString()} yards (${result.meters.toLocaleString()} meters)\n🧶 ${result.skeinsSmall}-${result.skeinsLarge} skeins\n\nCalculated with MyCrochetKit: https://mycrochetkit.com/yarn-calculator`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <SEOHead
        title="Free Yarn Calculator - How Much Yarn Do I Need? | MyCrochetKit"
        description="Calculate exactly how much yarn you need for any crochet or knitting project. Enter dimensions, yarn weight, and get instant results. Free, no signup required."
        canonicalUrl="https://mycrochetkit.com/yarn-calculator"
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7FBFA0] to-[#5A9A7A] flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#2C1810]">Yarn Calculator</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#2C1810]/10 text-[#2C1810]/70 hover:text-[#2C1810] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#7FBFA0]" /> : <Share2 className="w-4 h-4" />}
              <span className="text-sm font-medium hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-2 text-center">
              How Much Yarn Do I Need?
            </h1>
            <p className="text-[#2C1810]/70 text-center mb-8">
              Enter your project dimensions and yarn weight to calculate.
            </p>

            {/* Project Type */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2C1810]/5 mb-6">
              <label className="block text-sm font-medium text-[#2C1810]/70 mb-3">Project Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(PROJECT_PRESETS) as ProjectType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleProjectChange(type)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      projectType === type
                        ? 'bg-[#E86A58] text-white'
                        : 'bg-[#2C1810]/5 text-[#2C1810]/70 hover:bg-[#2C1810]/10'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2C1810]/5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-[#2C1810]/70">Dimensions</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUnit('inches')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      unit === 'inches' ? 'bg-[#B8A9C9] text-white' : 'bg-[#2C1810]/5 text-[#2C1810]/60'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      unit === 'cm' ? 'bg-[#B8A9C9] text-white' : 'bg-[#2C1810]/5 text-[#2C1810]/60'
                    }`}
                  >
                    CM
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#2C1810]/50 mb-1">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#2C1810]/50 mb-1">Height/Length</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                  />
                </div>
              </div>
            </div>

            {/* Yarn Weight */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2C1810]/5 mb-8">
              <label className="block text-sm font-medium text-[#2C1810]/70 mb-3">Yarn Weight</label>
              <select
                value={yarnWeight}
                onChange={(e) => setYarnWeight(e.target.value as YarnWeight)}
                className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] font-medium focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
              >
                {(Object.entries(YARN_WEIGHTS) as [YarnWeight, YarnWeightInfo][]).map(([key, info]) => (
                  <option key={key} value={key}>{info.name}</option>
                ))}
              </select>
            </div>

            {/* Results */}
            <motion.div
              className="bg-gradient-to-br from-[#7FBFA0]/10 to-[#B8A9C9]/10 rounded-3xl p-8 border border-[#7FBFA0]/20"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              key={`${width}-${height}-${yarnWeight}`}
            >
              <h2 className="text-sm font-medium text-[#2C1810]/60 mb-4 text-center uppercase tracking-wider">
                You'll Need
              </h2>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#2C1810] mb-2">
                  {result.yards.toLocaleString()}
                </div>
                <div className="text-[#2C1810]/70">
                  yards ({result.meters.toLocaleString()} meters)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-[#E86A58]">{result.skeinsSmall}</div>
                  <div className="text-xs text-[#2C1810]/60">skeins (220yd)</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-[#B8A9C9]">{result.skeinsLarge}</div>
                  <div className="text-xs text-[#2C1810]/60">skeins (380yd)</div>
                </div>
              </div>

              <p className="text-xs text-[#2C1810]/50 text-center mt-4">
                *Includes 15% buffer for joins and mistakes. Actual needs may vary based on gauge and stitch pattern.
              </p>
            </motion.div>

            {/* Share CTA */}
            <div className="mt-8 text-center">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white rounded-xl font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Results'}
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
