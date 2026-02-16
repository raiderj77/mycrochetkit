import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CircleDot, ChevronDown } from 'lucide-react';

interface HatSize {
  label: string;
  age: string;
  circumference: number; // inches
  height: number; // inches
  crown: number; // inches (diameter)
}

const HAT_SIZES: HatSize[] = [
  { label: 'Preemie',       age: 'Premature',    circumference: 12,   height: 4.5,  crown: 3.8  },
  { label: 'Newborn',       age: '0-3 months',   circumference: 13.5, height: 5,    crown: 4.3  },
  { label: 'Baby',          age: '3-6 months',   circumference: 15,   height: 5.5,  crown: 4.8  },
  { label: 'Infant',        age: '6-12 months',  circumference: 16.5, height: 6,    crown: 5.25 },
  { label: 'Toddler',       age: '1-3 years',    circumference: 18,   height: 7,    crown: 5.7  },
  { label: 'Child',         age: '3-10 years',   circumference: 19.5, height: 7.5,  crown: 6.2  },
  { label: 'Pre-teen',      age: '10-13 years',  circumference: 20.5, height: 8,    crown: 6.5  },
  { label: 'Teen/Sm Adult', age: 'Teen/S',       circumference: 21,   height: 8.5,  crown: 6.7  },
  { label: 'Woman Avg',     age: 'Adult M',      circumference: 22,   height: 8.5,  crown: 7.0  },
  { label: 'Man Avg',       age: 'Adult L',      circumference: 23,   height: 9,    crown: 7.3  },
  { label: 'Large Adult',   age: 'Adult XL',     circumference: 24,   height: 9.5,  crown: 7.6  },
  { label: 'XL Adult',      age: 'Adult XXL',    circumference: 25,   height: 10,   crown: 8.0  },
];

interface HatCalcProps {
  projectId: string;
  onSave: (data: { selectedSize: string; customCirc: number; gauge: number }) => void;
  initialData?: { selectedSize: string; customCirc: number; gauge: number };
}

export function HatCalculator({ projectId: _pid, onSave, initialData }: HatCalcProps) {
  const [selectedSize, setSelectedSize] = useState(initialData?.selectedSize || 'Woman Avg');
  const [customCirc, setCustomCirc] = useState(initialData?.customCirc || 0);
  const [gauge, setGauge] = useState(initialData?.gauge || 14); // sts per 4 inches
  const [showChart, setShowChart] = useState(false);

  const activeSize = HAT_SIZES.find((s) => s.label === selectedSize) || HAT_SIZES[8];
  const circ = customCirc > 0 ? customCirc : activeSize.circumference;

  const calc = useMemo(() => {
    const stsPerInch = gauge / 4;
    const crownDiameter = customCirc > 0 ? customCirc / Math.PI : activeSize.crown;
    const startingChain = Math.round(circ * stsPerInch);
    const crownSts = Math.round(crownDiameter * stsPerInch);
    const height = customCirc > 0 ? Math.round(circ * 0.38 * 10) / 10 : activeSize.height;

    // Decrease rounds: typically reduce by 6-8 sts per round for sc
    const decreasePerRound = 6;
    const decreaseRounds = Math.ceil((startingChain - crownSts) / decreasePerRound);

    return { stsPerInch, crownDiameter, startingChain, crownSts, height, decreaseRounds, decreasePerRound };
  }, [circ, gauge, activeSize, customCirc]);

  const save = (field: string, value: string | number) => {
    const next = {
      selectedSize: field === 'size' ? value as string : selectedSize,
      customCirc: field === 'circ' ? value as number : customCirc,
      gauge: field === 'gauge' ? value as number : gauge,
    };
    if (field === 'size') setSelectedSize(value as string);
    if (field === 'circ') setCustomCirc(value as number);
    if (field === 'gauge') setGauge(value as number);
    onSave(next);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <span className="text-[#746454] text-sm font-medium uppercase tracking-wider block mb-4">{'\uD83C\uDFA9'} Hat Size Calculator</span>

        {/* Size Selector */}
        <div className="mb-4">
          <label className="text-[#746454] text-xs mb-1 block">Size</label>
          <select value={selectedSize} onChange={(e) => save('size', e.target.value)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none appearance-none">
            {HAT_SIZES.map((s) => (<option key={s.label} value={s.label} className="bg-[#1a1215] text-[#3D352E]">{s.label} ({s.age}) - {s.circumference}"</option>))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[#746454] text-xs mb-1 block">Custom circumference (in)</label>
            <input type="number" step="0.5" value={customCirc || ''} onChange={(e) => save('circ', parseFloat(e.target.value) || 0)} placeholder={`${activeSize.circumference}`} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-[#746454] text-xs mb-1 block">Gauge (sts / 4 in)</label>
            <input type="number" value={gauge} onChange={(e) => save('gauge', parseFloat(e.target.value) || 14)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-[#EDE8E3] pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Head circumference</span>
            <span className="text-[#3D352E]/80">{circ}"</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Crown diameter</span>
            <span className="text-[#3D352E]/80">{calc.crownDiameter.toFixed(1)}"</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Hat height</span>
            <span className="text-[#3D352E]/80">{calc.height}"</span>
          </div>
          <div className="flex justify-between text-sm border-t border-[#EDE8E3] pt-2">
            <span className="text-[#746454]">Starting chain</span>
            <span className="text-[#7FBFA0] font-bold">{calc.startingChain} sts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Crown stitches</span>
            <span className="text-[#3D352E]/80">{calc.crownSts} sts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Decrease rounds</span>
            <span className="text-[#3D352E]/80">~{calc.decreaseRounds} rounds ({calc.decreasePerRound} dec/rnd)</span>
          </div>
        </div>
      </div>

      {/* Size Chart */}
      <motion.div className="glass-card overflow-hidden">
        <motion.button onClick={() => setShowChart(!showChart)} className="w-full p-4 flex items-center justify-between text-[#746454] hover:text-[#3D352E] transition-colors">
          <span className="flex items-center gap-2 text-sm font-medium"><CircleDot className="w-4 h-4" /> Full Size Chart</span>
          <motion.span animate={{ rotate: showChart ? 180 : 0 }}><ChevronDown className="w-4 h-4" /></motion.span>
        </motion.button>
        {showChart && (
          <div className="border-t border-[#EDE8E3] overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#8D7B6A] border-b border-white/5">
                  <th className="text-left p-2 pl-4">Size</th>
                  <th className="text-left p-2">Age</th>
                  <th className="text-right p-2">Circ</th>
                  <th className="text-right p-2">Height</th>
                  <th className="text-right p-2 pr-4">Crown</th>
                </tr>
              </thead>
              <tbody>
                {HAT_SIZES.map((s) => (
                  <tr key={s.label} className={`border-b border-white/5 ${s.label === selectedSize ? 'bg-[#7FBFA0]/10' : ''}`}>
                    <td className="p-2 pl-4 text-[#746454]">{s.label}</td>
                    <td className="p-2 text-[#746454]">{s.age}</td>
                    <td className="p-2 text-right text-[#746454]">{s.circumference}"</td>
                    <td className="p-2 text-right text-[#746454]">{s.height}"</td>
                    <td className="p-2 text-right pr-4 text-[#746454]">{s.crown}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
