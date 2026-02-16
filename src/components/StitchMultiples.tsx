import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Hash, Info } from 'lucide-react';

interface StitchMultiplesProps {
  projectId: string;
  onSave: (data: { multiple: number; extra: number; desiredWidth: number; gauge: number }) => void;
  initialData?: { multiple: number; extra: number; desiredWidth: number; gauge: number };
}

const COMMON_PATTERNS = [
  { name: 'V-Stitch', multiple: 2, extra: 1 },
  { name: 'Shell Stitch (3)', multiple: 6, extra: 1 },
  { name: 'Shell Stitch (5)', multiple: 6, extra: 1 },
  { name: 'Granny Stitch', multiple: 3, extra: 0 },
  { name: 'Moss / Linen', multiple: 2, extra: 0 },
  { name: 'Chevron / Ripple', multiple: 12, extra: 3 },
  { name: 'Cable (6-st)', multiple: 6, extra: 2 },
  { name: 'Basketweave', multiple: 8, extra: 0 },
  { name: 'Star Stitch', multiple: 2, extra: 0 },
  { name: 'Puff Stitch', multiple: 2, extra: 0 },
  { name: 'Bobble (5dc)', multiple: 4, extra: 1 },
  { name: 'Waffle Stitch', multiple: 3, extra: 0 },
];

export function StitchMultiples({ projectId: _pid, onSave, initialData }: StitchMultiplesProps) {
  const [multiple, setMultiple] = useState(initialData?.multiple || 6);
  const [extra, setExtra] = useState(initialData?.extra || 1);
  const [desiredWidth, setDesiredWidth] = useState(initialData?.desiredWidth || 50);
  const [gauge, setGauge] = useState(initialData?.gauge || 14); // sts per 4 inches

  const results = useMemo(() => {
    const stsPerInch = gauge / 4;
    const rawSts = Math.round(desiredWidth * stsPerInch);

    // Find valid chain counts near the desired stitch count
    // Valid = (multiple * N) + extra
    const nearestBelow = Math.floor((rawSts - extra) / multiple) * multiple + extra;
    const nearestAbove = nearestBelow + multiple;

    const options = [nearestBelow, nearestAbove].filter(n => n > 0).map(sts => ({
      stitches: sts,
      repeats: (sts - extra) / multiple,
      width: (sts / stsPerInch).toFixed(1),
      chain: sts + 1, // +1 for turning chain (sc default)
    }));

    // Also show a range of valid counts
    const rangeStart = Math.max(1, Math.floor((rawSts - extra) / multiple) - 2);
    const range = Array.from({ length: 7 }, (_, i) => {
      const n = rangeStart + i;
      const sts = n * multiple + extra;
      return {
        repeats: n,
        stitches: sts,
        width: (sts / stsPerInch).toFixed(1),
        chain: sts + 1,
        isClosest: sts === nearestBelow || sts === nearestAbove,
      };
    }).filter(r => r.stitches > 0);

    return { rawSts, options, range, stsPerInch };
  }, [multiple, extra, desiredWidth, gauge]);

  const save = (field: string, value: number) => {
    const next = {
      multiple: field === 'multiple' ? value : multiple,
      extra: field === 'extra' ? value : extra,
      desiredWidth: field === 'width' ? value : desiredWidth,
      gauge: field === 'gauge' ? value : gauge,
    };
    if (field === 'multiple') setMultiple(value);
    if (field === 'extra') setExtra(value);
    if (field === 'width') setDesiredWidth(value);
    if (field === 'gauge') setGauge(value);
    onSave(next);
  };

  const applyPreset = (preset: typeof COMMON_PATTERNS[0]) => {
    setMultiple(preset.multiple);
    setExtra(preset.extra);
    onSave({ multiple: preset.multiple, extra: preset.extra, desiredWidth, gauge });
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <span className="text-[#746454] text-sm font-medium uppercase tracking-wider block mb-4"><Hash className="w-4 h-4 inline" /> Stitch Multiples</span>

        {/* Common Patterns */}
        <div className="mb-4">
          <label className="text-[#746454] text-xs mb-2 block">Common patterns</label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PATTERNS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  p.multiple === multiple && p.extra === extra
                    ? 'bg-[#7FBFA0]/20 text-[#7FBFA0] border border-[#7FBFA0]/30'
                    : 'bg-[#FAF0E4] text-[#746454] hover:text-[#3D352E] border border-transparent'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[#746454] text-xs mb-1 block">Multiple of</label>
            <input type="number" min={1} value={multiple} onChange={(e) => save('multiple', parseInt(e.target.value) || 1)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-[#746454] text-xs mb-1 block">Plus extra</label>
            <input type="number" min={0} value={extra} onChange={(e) => save('extra', parseInt(e.target.value) || 0)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-[#746454] text-xs mb-1 block">Desired width (in)</label>
            <input type="number" value={desiredWidth} onChange={(e) => save('width', parseFloat(e.target.value) || 0)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-[#746454] text-xs mb-1 block">Gauge (sts / 4 in)</label>
            <input type="number" value={gauge} onChange={(e) => save('gauge', parseFloat(e.target.value) || 14)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
          </div>
        </div>

        {/* Formula */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#FAF0E4] rounded-lg">
          <Info className="w-3.5 h-3.5 text-[#3D352E]/30 flex-shrink-0" />
          <span className="text-[#8D7B6A] text-xs">
            Formula: ({multiple} {'\u00D7'} N) + {extra} = valid stitch count
          </span>
        </div>

        {/* Best Options */}
        {results.options.length > 0 && (
          <div className="border-t border-[#EDE8E3] pt-4 space-y-3">
            <span className="text-[#746454] text-xs uppercase tracking-wider">Best matches for {desiredWidth}" width</span>
            {results.options.map((opt, i) => (
              <motion.div key={opt.stitches} className={`p-3 rounded-xl ${i === 0 ? 'bg-[#7FBFA0]/10 border border-[#7FBFA0]/20' : 'bg-[#FAF0E4]'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${i === 0 ? 'text-[#7FBFA0]' : 'text-[#3D352E]/80'}`}>{opt.stitches} stitches</span>
                  <span className="text-[#746454] text-xs">{opt.width}" wide</span>
                </div>
                <div className="text-[#8D7B6A] text-xs">
                  {opt.repeats} repeats {'\u00B7'} Chain {opt.chain}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Full Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4">
          <span className="text-[#746454] text-xs uppercase tracking-wider">Valid Stitch Counts</span>
        </div>
        <div className="border-t border-[#EDE8E3]">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[#8D7B6A] border-b border-white/5">
                <th className="text-left p-2 pl-4">Repeats</th>
                <th className="text-right p-2">Stitches</th>
                <th className="text-right p-2">Chain</th>
                <th className="text-right p-2 pr-4">Width</th>
              </tr>
            </thead>
            <tbody>
              {results.range.map((r) => (
                <tr key={r.repeats} className={`border-b border-white/5 ${r.isClosest ? 'bg-[#7FBFA0]/10' : ''}`}>
                  <td className="p-2 pl-4 text-[#746454]">{r.repeats}x</td>
                  <td className="p-2 text-right text-[#746454] font-mono">{r.stitches}</td>
                  <td className="p-2 text-right text-[#746454] font-mono">{r.chain}</td>
                  <td className="p-2 text-right pr-4 text-[#746454]">{r.width}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
