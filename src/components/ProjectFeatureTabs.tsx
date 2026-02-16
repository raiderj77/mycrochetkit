import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Clock, Thermometer, Grid3X3, FileText, Repeat, CircleDot, Hash, ChevronDown, Wrench } from 'lucide-react';
import { ProGate, ProBadge } from './ProGate';
import { ProjectTimer } from './ProjectTimer';
import { TemperaturePlanner } from './TemperaturePlanner';
import { GrannySquareLayout } from './GrannySquareLayout';
import { PatternNotes } from './PatternNotes';
import { YarnSubstitution } from './YarnSubstitution';
import { HatCalculator } from './HatCalculator';
import { StitchMultiples } from './StitchMultiples';

interface ProjectFeatureTabsProps {
  projectId: string;
  userId: string;
  isPro: boolean;
  currentRow: number;
  proData?: Record<string, unknown>;
}

type ToolKey = 'notes' | 'timer' | 'temperature' | 'granny' | 'yarnsub' | 'hat' | 'multiples';

interface ToolDef {
  key: ToolKey;
  label: string;
  icon: typeof Clock;
  free: boolean;
}

const TOOLS: ToolDef[] = [
  { key: 'notes', label: 'Notes', icon: FileText, free: true },
  { key: 'yarnsub', label: 'Yarn Sub', icon: Repeat, free: true },
  { key: 'hat', label: 'Hat Calc', icon: CircleDot, free: true },
  { key: 'multiples', label: 'Multiples', icon: Hash, free: true },
  { key: 'timer', label: 'Timer', icon: Clock, free: false },
  { key: 'temperature', label: 'Temp', icon: Thermometer, free: false },
  { key: 'granny', label: 'Layout', icon: Grid3X3, free: false },
];

export function ProjectFeatureTabs({ projectId, userId, isPro, currentRow, proData = {} }: ProjectFeatureTabsProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);

  const saveProData = useCallback(
    async (key: string, data: unknown) => {
      try {
        await setDoc(doc(db, 'users', userId, 'projects', projectId), { proFeatures: { [key]: data } }, { merge: true });
      } catch (e) {
        console.error('Failed to save feature data:', e);
      }
    },
    [userId, projectId]
  );

  const handleToolClick = (key: ToolKey) => {
    setActiveTool(activeTool === key ? null : key);
  };

  const renderToolContent = () => {
    if (!activeTool) return null;
    const tool = TOOLS.find((t) => t.key === activeTool)!;
    const content = (() => {
      switch (activeTool) {
        case 'notes':
          return <PatternNotes projectId={projectId} currentRow={currentRow} initialNotes={(proData?.notes as any) || []} onSave={(data) => saveProData('notes', data)} />;
        case 'yarnsub':
          return <YarnSubstitution projectId={projectId} initialData={proData?.yarn as any} onSave={(data) => saveProData('yarn', data)} />;
        case 'hat':
          return <HatCalculator projectId={projectId} initialData={proData?.hat as any} onSave={(data) => saveProData('hat', data)} />;
        case 'multiples':
          return <StitchMultiples projectId={projectId} initialData={proData?.multiples as any} onSave={(data) => saveProData('multiples', data)} />;
        case 'timer':
          return <ProjectTimer projectId={projectId} initialSeconds={(proData?.timer as any)?.timerSeconds || 0} initialPricing={(proData?.timer as any)?.pricing} onSave={(data) => saveProData('timer', data)} />;
        case 'temperature':
          return <TemperaturePlanner projectId={projectId} initialRanges={(proData?.temperature as any)?.tempRanges} initialUnit={(proData?.temperature as any)?.unit} initialLog={(proData?.temperature as any)?.dailyLog} onSave={(data) => saveProData('temperature', data)} />;
        case 'granny':
          return <GrannySquareLayout projectId={projectId} initialConfig={proData?.granny as any} onSave={(data) => saveProData('granny', data)} />;
        default:
          return null;
      }
    })();
    if (!tool.free) {
      return (
        <ProGate isPro={isPro} featureName={tool.label}>
          <motion.div key={activeTool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4">{content}</motion.div>
        </ProGate>
      );
    }
    return (
      <motion.div key={activeTool} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4">{content}</motion.div>
    );
  };

  return (
    <div className="mt-6">
      <motion.button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors" whileTap={{ scale: 0.99 }}>
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#B8A9C9]" />
          <span className="text-[#746454] text-sm font-medium">Project Tools</span>
          <span className="text-[#3D352E]/25 text-xs">{TOOLS.length} tools</span>
        </div>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-[#3D352E]/40" />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="grid grid-cols-4 gap-2 mt-3 px-1">
              {TOOLS.map((tool) => {
                const isActive = activeTool === tool.key;
                return (
                  <motion.button key={tool.key} onClick={() => handleToolClick(tool.key)} className={`relative flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-center transition-all ${isActive ? 'bg-[#FAF0E4] text-[#3D352E] border border-[#EDE8E3]' : 'bg-white/[0.02] text-[#3D352E]/40 border border-transparent hover:bg-white/[0.05] hover:text-[#746454]'}`} whileTap={{ scale: 0.92 }}>
                    <tool.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium leading-tight">{tool.label}</span>
                    {!tool.free && !isPro && (
                      <div className="absolute -top-1 -right-1"><ProBadge /></div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">{renderToolContent()}</AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
