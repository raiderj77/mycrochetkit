import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Palette, ChevronDown } from 'lucide-react';

interface TempRange {
  id: string;
  min: number;
  max: number;
  color: string;
  label: string;
}

interface TemperaturePlannerProps {
  projectId: string;
  onSave: (data: { tempRanges: TempRange[]; unit: 'F' | 'C'; dailyLog: Record<string, string> }) => void;
  initialRanges?: TempRange[];
  initialUnit?: 'F' | 'C';
  initialLog?: Record<string, string>;
}

function makeDefaultRanges(unit: 'F' | 'C'): TempRange[] {
  if (unit === 'F') {
    return [
      { id: '1', min: -20, max: 9, color: '#1e3a5f', label: 'Below 10\u00B0F' },
      { id: '2', min: 10, max: 19, color: '#2563eb', label: '10-19\u00B0F' },
      { id: '3', min: 20, max: 29, color: '#06b6d4', label: '20-29\u00B0F' },
      { id: '4', min: 30, max: 39, color: '#10b981', label: '30-39\u00B0F' },
      { id: '5', min: 40, max: 49, color: '#84cc16', label: '40-49\u00B0F' },
      { id: '6', min: 50, max: 59, color: '#a3e635', label: '50-59\u00B0F' },
      { id: '7', min: 60, max: 69, color: '#eab308', label: '60-69\u00B0F' },
      { id: '8', min: 70, max: 79, color: '#f97316', label: '70-79\u00B0F' },
      { id: '9', min: 80, max: 89, color: '#ef4444', label: '80-89\u00B0F' },
      { id: '10', min: 90, max: 110, color: '#991b1b', label: '90\u00B0F+' },
    ];
  }
  return [
    { id: '1', min: -30, max: -11, color: '#1e3a5f', label: 'Below -10\u00B0C' },
    { id: '2', min: -10, max: -1, color: '#2563eb', label: '-10 to -1\u00B0C' },
    { id: '3', min: 0, max: 4, color: '#06b6d4', label: '0-4\u00B0C' },
    { id: '4', min: 5, max: 9, color: '#10b981', label: '5-9\u00B0C' },
    { id: '5', min: 10, max: 14, color: '#84cc16', label: '10-14\u00B0C' },
    { id: '6', min: 15, max: 19, color: '#a3e635', label: '15-19\u00B0C' },
    { id: '7', min: 20, max: 24, color: '#eab308', label: '20-24\u00B0C' },
    { id: '8', min: 25, max: 29, color: '#f97316', label: '25-29\u00B0C' },
    { id: '9', min: 30, max: 34, color: '#ef4444', label: '30-34\u00B0C' },
    { id: '10', min: 35, max: 50, color: '#991b1b', label: '35\u00B0C+' },
  ];
}

export function TemperaturePlanner({ projectId: _projectId, onSave, initialRanges, initialUnit = 'F', initialLog = {} }: TemperaturePlannerProps) {
  const [unit, setUnit] = useState<'F' | 'C'>(initialUnit);
  const [ranges, setRanges] = useState<TempRange[]>(initialRanges || makeDefaultRanges(initialUnit));
  const [dailyLog, setDailyLog] = useState<Record<string, string>>(initialLog);
  const [showLog, setShowLog] = useState(false);
  const [todayTemp, setTodayTemp] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const dayOfYear = Math.floor((Date.now() - yearStart.getTime()) / 86400000) + 1;
  const loggedDays = Object.keys(dailyLog).length;

  const getColorForTemp = (temp: number): string => {
    const range = ranges.find((r) => temp >= r.min && temp <= r.max);
    return range?.color || '#666';
  };

  const logToday = () => {
    const temp = parseFloat(todayTemp);
    if (isNaN(temp)) return;
    const next = { ...dailyLog, [today]: todayTemp };
    setDailyLog(next);
    setTodayTemp('');
    onSave({ tempRanges: ranges, unit, dailyLog: next });
  };

  const updateRangeColor = (id: string, color: string) => {
    const next = ranges.map((r) => (r.id === id ? { ...r, color } : r));
    setRanges(next);
    onSave({ tempRanges: next, unit, dailyLog });
  };

  const yardsPerRow = 8;
  const yarnByColor = useMemo(() => {
    const counts: Record<string, number> = {};
    ranges.forEach((r) => { counts[r.id] = 0; });
    Object.values(dailyLog).forEach((tempVal) => {
      const t = parseFloat(tempVal);
      const matched = ranges.find((rng) => t >= rng.min && t <= rng.max);
      if (matched) counts[matched.id] = (counts[matched.id] || 0) + 1;
    });
    return ranges.map((r) => ({ ...r, days: counts[r.id] || 0, yards: (counts[r.id] || 0) * yardsPerRow }));
  }, [dailyLog, ranges]);

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    const temp = dailyLog[key] ? parseFloat(dailyLog[key]) : null;
    return { date: key, temp, color: temp !== null ? getColorForTemp(temp) : '#333' };
  });

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#E86A58]" />
            <span className="text-[#746454] text-sm font-medium uppercase tracking-wider">Temperature Ranges</span>
          </div>
          <div className="flex gap-1 bg-[#FAF0E4] rounded-lg p-0.5">
            {(['F', 'C'] as const).map((u) => (
              <button key={u} onClick={() => { setUnit(u); setRanges(makeDefaultRanges(u)); onSave({ tempRanges: makeDefaultRanges(u), unit: u, dailyLog }); }} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${unit === u ? 'bg-[#E86A58] text-[#3D352E]' : 'text-[#746454] hover:text-[#3D352E]'}`}>
                {'\u00B0'}{u}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {ranges.map((r) => (
            <div key={r.id} className="flex items-center gap-3">
              <input type="color" value={r.color} onChange={(e) => updateRangeColor(r.id, e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full h-6 rounded-md" style={{ backgroundColor: r.color + '40' }}>
                  <div className="px-2 text-xs text-[#3D352E]/80 leading-6 truncate">{r.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-[#7FBFA0]" />
          <span className="text-[#746454] text-sm font-medium">Log Temperature</span>
          <span className="text-[#3D352E]/30 text-xs ml-auto">Day {dayOfYear}/365 {'\u00B7'} {loggedDays} logged</span>
        </div>
        <div className="flex gap-2">
          <input type="number" value={todayTemp} onChange={(e) => setTodayTemp(e.target.value)} placeholder={`Today's high (\u00B0${unit})`} className="flex-1 bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg px-3 py-2 text-[#3D352E] text-sm focus:border-[#7FBFA0]/50 focus:outline-none" />
          <motion.button onClick={logToday} className="px-4 py-2 bg-[#7FBFA0] rounded-lg text-[#3D352E] text-sm font-medium" whileTap={{ scale: 0.95 }}>Log</motion.button>
        </div>
        {dailyLog[today] && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorForTemp(parseFloat(dailyLog[today])) }} />
            <span className="text-[#746454] text-xs">Today: {dailyLog[today]}{'\u00B0'}{unit}</span>
          </div>
        )}
      </div>

      <div className="glass-card p-5">
        <span className="text-[#746454] text-xs uppercase tracking-wider block mb-3">Last 30 Days Preview</span>
        <div className="flex gap-0.5">
          {last30.map((d) => (
            <div key={d.date} className="flex-1 h-8 rounded-sm transition-colors" style={{ backgroundColor: d.color }} title={`${d.date}: ${d.temp !== null ? d.temp + '\u00B0' + unit : 'no data'}`} />
          ))}
        </div>
      </div>

      <motion.div className="glass-card overflow-hidden">
        <motion.button onClick={() => setShowLog(!showLog)} className="w-full p-4 flex items-center justify-between text-[#746454] hover:text-[#3D352E] transition-colors">
          <span className="text-sm font-medium">{'\uD83E\uDDF6'} Yarn Estimates by Color</span>
          <motion.span animate={{ rotate: showLog ? 180 : 0 }}><ChevronDown className="w-4 h-4" /></motion.span>
        </motion.button>
        <AnimatePresence>
          {showLog && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[#EDE8E3]">
              <div className="p-4 space-y-2">
                {yarnByColor.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: r.color }} />
                    <span className="text-[#746454] flex-1">{r.label}</span>
                    <span className="text-[#746454]">{r.days}d</span>
                    <span className="text-[#3D352E]/80 font-mono">{r.yards}yd</span>
                  </div>
                ))}
                <div className="border-t border-[#EDE8E3] pt-2 mt-2 flex justify-between text-sm font-bold">
                  <span className="text-[#7FBFA0]">Total</span>
                  <span className="text-[#7FBFA0]">{yarnByColor.reduce((s, r) => s + r.yards, 0)} yards</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
