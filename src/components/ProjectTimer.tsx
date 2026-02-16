import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, DollarSign, Clock, ChevronDown, Package } from 'lucide-react';

interface PricingConfig {
  hourlyRate: number;
  yarnCost: number;
  suppliesCost: number;
  markup: number;
}

interface ProjectTimerProps {
  projectId: string;
  onSave: (data: { timerSeconds: number; pricing: PricingConfig }) => void;
  initialSeconds?: number;
  initialPricing?: PricingConfig;
}

const DEFAULT_PRICING: PricingConfig = {
  hourlyRate: 15,
  yarnCost: 0,
  suppliesCost: 0,
  markup: 2.0,
};

export function ProjectTimer({ projectId: _projectId, onSave, initialSeconds = 0, initialPricing }: ProjectTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [pricing, setPricing] = useState<PricingConfig>(initialPricing || DEFAULT_PRICING);
  const [showPricing, setShowPricing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const baseSecondsRef = useRef(initialSeconds);

  useEffect(() => { baseSecondsRef.current = totalSeconds; }, [totalSeconds]);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now();
    baseSecondsRef.current = totalSeconds;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      setTotalSeconds(baseSecondsRef.current + elapsed);
    }, 1000);
  }, [isRunning, totalSeconds]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    onSave({ timerSeconds: totalSeconds, pricing });
  }, [isRunning, totalSeconds, pricing, onSave]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setTotalSeconds(0);
    baseSecondsRef.current = 0;
    startTimeRef.current = null;
    onSave({ timerSeconds: 0, pricing });
  }, [pricing, onSave]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const saveInterval = setInterval(() => {
      onSave({ timerSeconds: totalSeconds, pricing });
    }, 30000);
    return () => clearInterval(saveInterval);
  }, [isRunning, totalSeconds, pricing, onSave]);

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const laborCost = (totalSeconds / 3600) * pricing.hourlyRate;
  const totalCost = laborCost + pricing.yarnCost + pricing.suppliesCost;
  const suggestedPrice = totalCost * pricing.markup;

  const updatePricing = (field: keyof PricingConfig, value: number) => {
    const next = { ...pricing, [field]: value };
    setPricing(next);
    onSave({ timerSeconds: totalSeconds, pricing: next });
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#E86A58]" />
          <span className="text-[#746454] text-sm font-medium uppercase tracking-wider">Project Timer</span>
        </div>
        <div className="text-center mb-6">
          <div className="font-mono text-5xl font-bold text-[#3D352E] tracking-wider">
            {String(hours).padStart(2, '0')}
            <span className="text-[#3D352E]/30">:</span>
            {String(mins).padStart(2, '0')}
            <span className="text-[#3D352E]/30">:</span>
            {String(secs).padStart(2, '0')}
          </div>
          {isRunning && (
            <motion.div
              className="w-2 h-2 rounded-full bg-[#7FBFA0] mx-auto mt-3"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex justify-center gap-4">
          <motion.button onClick={reset} className="w-12 h-12 rounded-full bg-[#FAF0E4] flex items-center justify-center text-[#746454] hover:text-[#3D352E] hover:bg-[#FAF0E4] transition-colors" whileTap={{ scale: 0.9 }}>
            <RotateCcw className="w-5 h-5" />
          </motion.button>
          <motion.button onClick={isRunning ? pause : start} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isRunning ? 'bg-[#E86A58] hover:bg-[#D35A4A]' : 'bg-[#7FBFA0] hover:bg-[#6AAF8A]'} transition-colors`} whileTap={{ scale: 0.9 }}>
            {isRunning ? <Pause className="w-7 h-7 text-[#3D352E]" /> : <Play className="w-7 h-7 text-[#3D352E] ml-1" />}
          </motion.button>
          <div className="w-12" />
        </div>
      </div>

      <motion.div className="glass-card overflow-hidden">
        <motion.button onClick={() => setShowPricing(!showPricing)} className="w-full p-4 flex items-center justify-between text-[#746454] hover:text-[#3D352E] transition-colors" whileTap={{ scale: 0.99 }}>
          <span className="flex items-center gap-2 text-sm font-medium"><DollarSign className="w-4 h-4" /> Seller Pricing Calculator</span>
          <motion.span animate={{ rotate: showPricing ? 180 : 0 }}><ChevronDown className="w-4 h-4" /></motion.span>
        </motion.button>
        <AnimatePresence>
          {showPricing && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[#EDE8E3]">
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#746454] text-xs mb-1 block">Hourly Rate ($)</label>
                    <input type="number" value={pricing.hourlyRate} onChange={(e) => updatePricing('hourlyRate', parseFloat(e.target.value) || 0)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2 text-[#3D352E] text-sm focus:border-[#E86A58]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[#746454] text-xs mb-1 block">Yarn Cost ($)</label>
                    <input type="number" value={pricing.yarnCost} onChange={(e) => updatePricing('yarnCost', parseFloat(e.target.value) || 0)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2 text-[#3D352E] text-sm focus:border-[#E86A58]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[#746454] text-xs mb-1 block">Other Supplies ($)</label>
                    <input type="number" value={pricing.suppliesCost} onChange={(e) => updatePricing('suppliesCost', parseFloat(e.target.value) || 0)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2 text-[#3D352E] text-sm focus:border-[#E86A58]/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[#746454] text-xs mb-1 block">Markup (x)</label>
                    <input type="number" step="0.1" value={pricing.markup} onChange={(e) => updatePricing('markup', parseFloat(e.target.value) || 1)} className="w-full bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2 text-[#3D352E] text-sm focus:border-[#E86A58]/50 focus:outline-none" />
                  </div>
                </div>
                <div className="border-t border-[#EDE8E3] pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#746454]">Time tracked</span><span className="text-[#3D352E]/80">{hours}h {mins}m</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#746454]">Labor cost</span><span className="text-[#3D352E]/80">${laborCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#746454]">Materials</span><span className="text-[#3D352E]/80">${(pricing.yarnCost + pricing.suppliesCost).toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#746454]">Total cost</span><span className="text-[#3D352E]/80">${totalCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-bold border-t border-[#EDE8E3] pt-2 mt-2">
                    <span className="text-[#7FBFA0] flex items-center gap-1"><Package className="w-4 h-4" /> Suggested Price</span>
                    <span className="text-[#7FBFA0]">${suggestedPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
