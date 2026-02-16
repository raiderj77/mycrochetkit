import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, Info } from 'lucide-react';

interface YarnWeight {
  id: string;
  name: string;
  ply: string;
  hookRange: string;
  yardageFactor: number;
}

const YARN_WEIGHTS: YarnWeight[] = [
  { id: 'lace',       name: '0 - Lace',            ply: '2-ply',   hookRange: '1.5-2.25mm',  yardageFactor: 2.2 },
  { id: 'superfine',  name: '1 - Super Fine',      ply: '3-4 ply', hookRange: '2.25-3.5mm',  yardageFactor: 1.8 },
  { id: 'fine',       name: '2 - Fine',            ply: '5 ply',   hookRange: '3.5-4.5mm',   yardageFactor: 1.5 },
  { id: 'light',      name: '3 - DK / Light',      ply: '8 ply',   hookRange: '4.5-5.5mm',   yardageFactor: 1.25 },
  { id: 'medium',     name: '4 - Worsted',         ply: '10 ply',  hookRange: '5.5-6.5mm',   yardageFactor: 1.0 },
  { id: 'bulky',      name: '5 - Bulky',           ply: '12 ply',  hookRange: '6.5-9mm',     yardageFactor: 0.75 },
  { id: 'superbulky', name: '6 - Super Bulky',     ply: '14+ ply', hookRange: '9-16mm',      yardageFactor: 0.55 },
  { id: 'jumbo',      name: '7 - Jumbo',           ply: 'roving',  hookRange: '16mm+',       yardageFactor: 0.4 },
];

interface YarnSubstitutionProps {
  projectId: string;
  onSave: (data: { fromWeight: string; toWeight: string; originalYardage: number }) => void;
  initialData?: { fromWeight: string; toWeight: string; originalYardage: number };
}

export function YarnSubstitution({ projectId: _pid, onSave, initialData }: YarnSubstitutionProps) {
  const [fromWeight, setFromWeight] = useState(initialData?.fromWeight || 'medium');
  const [toWeight, setToWeight] = useState(initialData?.toWeight || 'bulky');
  const [originalYardage, setOriginalYardage] = useState(initialData?.originalYardage || 0);

  const fromYarn = YARN_WEIGHTS.find((y) => y.id === fromWeight)!;
  const toYarn = YARN_WEIGHTS.find((y) => y.id === toWeight)!;

  const conversion = useMemo(() => {
    const ratio = fromYarn.yardageFactor / toYarn.yardageFactor;
    const adjustedYardage = originalYardage > 0 ? Math.ceil(originalYardage * ratio) : 0;
    const weightDiff = YARN_WEIGHTS.findIndex(y => y.id === toWeight) - YARN_WEIGHTS.findIndex(y => y.id === fromWeight);
    const riskLevel: 'low' | 'medium' | 'high' = Math.abs(weightDiff) <= 1 ? 'low' : Math.abs(weightDiff) <= 2 ? 'medium' : 'high';
    return { ratio, adjustedYardage, weightDiff, riskLevel };
  }, [fromWeight, toWeight, originalYardage, fromYarn, toYarn]);

  const handleChange = (field: string, value: string | number) => {
    const next = {
      fromWeight: field === 'from' ? value as string : fromWeight,
      toWeight: field === 'to' ? value as string : toWeight,
      originalYardage: field === 'yardage' ? value as number : originalYardage,
    };
    if (field === 'from') setFromWeight(value as string);
    if (field === 'to') setToWeight(value as string);
    if (field === 'yardage') setOriginalYardage(value as number);
    onSave(next);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <span className="text-[#746454] text-sm font-medium uppercase tracking-wider block mb-4">{'\uD83E\uDDF6'} Yarn Substitution</span>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label className="text-[#746454] text-xs mb-1 block">Pattern calls for</label>
            <select value={fromWeight} onChange={(e) => handleChange('from', e.target.value)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none appearance-none">
              {YARN_WEIGHTS.map((y) => (<option key={y.id} value={y.id} className="bg-[#1a1215] text-[#3D352E]">{y.name}</option>))}
            </select>
          </div>
          <ArrowRight className="w-5 h-5 text-[#3D352E]/30 mt-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="text-[#746454] text-xs mb-1 block">Substituting with</label>
            <select value={toWeight} onChange={(e) => handleChange('to', e.target.value)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none appearance-none">
              {YARN_WEIGHTS.map((y) => (<option key={y.id} value={y.id} className="bg-[#1a1215] text-[#3D352E]">{y.name}</option>))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[#746454] text-xs mb-1 block">Original pattern yardage</label>
          <input type="number" value={originalYardage || ''} onChange={(e) => handleChange('yardage', parseFloat(e.target.value) || 0)} placeholder="e.g. 1200" className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2.5 text-[#3D352E] text-sm focus:outline-none" />
        </div>

        {/* Results */}
        <div className="border-t border-[#EDE8E3] pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Conversion ratio</span>
            <span className="text-[#3D352E]/80">{conversion.ratio.toFixed(2)}x</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#746454]">Recommended hook</span>
            <span className="text-[#3D352E]/80">{toYarn.hookRange}</span>
          </div>
          {originalYardage > 0 && (
            <div className="flex justify-between text-base font-bold border-t border-[#EDE8E3] pt-3">
              <span className="text-[#7FBFA0]">You need</span>
              <span className="text-[#7FBFA0]">{conversion.adjustedYardage} yards</span>
            </div>
          )}
        </div>
      </div>

      {/* Risk Warning */}
      {conversion.riskLevel !== 'low' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-4 border-l-4 ${conversion.riskLevel === 'high' ? 'border-l-[#E86A58]' : 'border-l-[#eab308]'}`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: conversion.riskLevel === 'high' ? '#E86A58' : '#eab308' }} />
            <div>
              <p className="text-[#3D352E]/80 text-sm font-medium mb-1">
                {conversion.riskLevel === 'high' ? 'Major weight change' : 'Moderate weight change'}
              </p>
              <p className="text-[#746454] text-xs">
                {Math.abs(conversion.weightDiff) >= 3
                  ? 'Substituting across 3+ weight categories will significantly change drape, texture, and sizing. A gauge swatch is essential.'
                  : 'Substituting across 2 weight categories may affect drape and sizing. Swatch to check gauge.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Reference */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-3.5 h-3.5 text-[#8D7B6A]" />
          <span className="text-[#8D7B6A] text-xs uppercase tracking-wider">Quick Reference</span>
        </div>
        <div className="space-y-1.5">
          {YARN_WEIGHTS.map((y) => (
            <div key={y.id} className={`flex items-center gap-3 text-xs px-2 py-1 rounded ${y.id === fromWeight || y.id === toWeight ? 'bg-[#FAF0E4]' : ''}`}>
              <span className={`w-2 h-2 rounded-full ${y.id === fromWeight ? 'bg-[#E86A58]' : y.id === toWeight ? 'bg-[#7FBFA0]' : 'bg-[#FAF0E4]'}`} />
              <span className="text-[#746454] flex-1">{y.name}</span>
              <span className="text-[#3D352E]/30">{y.ply}</span>
              <span className="text-[#3D352E]/30">{y.hookRange}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
