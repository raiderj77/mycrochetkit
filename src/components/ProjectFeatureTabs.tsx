import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Clock,
  Thermometer,
  Grid3X3,
  FileText,
  Repeat,
  CircleDot,
  Hash,
  ChevronDown,
  ExternalLink,
  Crown,
  Sparkles,
} from 'lucide-react';
import { ProGate } from './ProGate';
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
  ravelryUrl?: string;
  onRavelryUrlChange?: (url: string) => void;
}

type ToolKey =
  | 'notes'
  | 'timer'
  | 'temperature'
  | 'granny'
  | 'yarnsub'
  | 'hat'
  | 'multiples'
  | 'ravelry';

interface ToolDef {
  key: ToolKey;
  label: string;
  icon: typeof Clock;
  free: boolean;
}

const TOOLS: ToolDef[] = [
  { key: 'notes', label: 'Notes', icon: FileText, free: true },
  { key: 'ravelry', label: 'Ravelry', icon: ExternalLink, free: true },
  { key: 'yarnsub', label: 'Yarn Sub', icon: Repeat, free: false },
  { key: 'hat', label: 'Hat Calc', icon: CircleDot, free: false },
  { key: 'multiples', label: 'Multiples', icon: Hash, free: false },
  { key: 'timer', label: 'Timer', icon: Clock, free: false },
  { key: 'temperature', label: 'Temp', icon: Thermometer, free: false },
  { key: 'granny', label: 'Layout', icon: Grid3X3, free: false },
];

export function ProjectFeatureTabs({
  projectId,
  userId,
  isPro,
  currentRow,
  proData = {},
  ravelryUrl = '',
  onRavelryUrlChange,
}: ProjectFeatureTabsProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const [localRavelryUrl, setLocalRavelryUrl] = useState(ravelryUrl);
  const [ravelrySaved, setRavelrySaved] = useState(false);

  const saveProData = useCallback(
    async (key: string, data: unknown) => {
      try {
        await setDoc(
          doc(db, 'users', userId, 'projects', projectId),
          { proFeatures: { [key]: data } },
          { merge: true }
        );
      } catch (e) {
        console.error('Failed to save feature data:', e);
      }
    },
    [userId, projectId]
  );

  const handleToolClick = (key: ToolKey) => {
    setActiveTool(activeTool === key ? null : key);
  };

  const saveRavelryUrl = async () => {
    try {
      await setDoc(
        doc(db, 'users', userId, 'projects', projectId),
        { ravelryUrl: localRavelryUrl },
        { merge: true }
      );
      onRavelryUrlChange?.(localRavelryUrl);
      setRavelrySaved(true);
      setTimeout(() => setRavelrySaved(false), 2000);
    } catch (e) {
      console.error('Failed to save Ravelry URL:', e);
    }
  };

  const renderToolContent = () => {
    if (!activeTool) return null;
    const tool = TOOLS.find((t) => t.key === activeTool)!;

    if (activeTool === 'ravelry') {
      return (
        <motion.div
          key="ravelry"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3"
        >
          <div className="bg-white border border-[#EDE8E3] rounded-xl p-4">
            <p className="text-xs text-[#746454] mb-2 font-medium">
              Link your Ravelry pattern or project
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={localRavelryUrl}
                onChange={(e) => {
                  setLocalRavelryUrl(e.target.value);
                  setRavelrySaved(false);
                }}
                placeholder="https://www.ravelry.com/patterns/..."
                className="flex-1 px-3 py-2 bg-[#FAF0E4] border border-[#EDE8E3] rounded-lg text-sm text-[#3D352E] placeholder-[#8D7B6A] focus:outline-none focus:border-[#5E8A5E]/50"
                onKeyDown={(e) => e.key === 'Enter' && saveRavelryUrl()}
              />
              <button
                onClick={saveRavelryUrl}
                className="px-4 py-2 bg-[#5E8A5E] text-white text-sm font-medium rounded-lg hover:bg-[#4A6F4A] transition-colors"
              >
                {ravelrySaved ? '✓' : 'Save'}
              </button>
            </div>
            {localRavelryUrl && (
              <a              
                href={localRavelryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-[#5E8A5E] hover:underline"
              >
                Open in Ravelry <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>
      );
    }

    const content = (() => {
      switch (activeTool) {
        case 'notes':
          return (
            <PatternNotes
              projectId={projectId}
              currentRow={currentRow}
              initialNotes={(proData?.notes as any) || []}
              onSave={(data) => saveProData('notes', data)}
            />
          );
        case 'yarnsub':
          return (
            <YarnSubstitution
              projectId={projectId}
              initialData={proData?.yarn as any}
              onSave={(data) => saveProData('yarn', data)}
            />
          );
        case 'hat':
          return (
            <HatCalculator
              projectId={projectId}
              initialData={proData?.hat as any}
              onSave={(data) => saveProData('hat', data)}
            />
          );
        case 'multiples':
          return (
            <StitchMultiples
              projectId={projectId}
              initialData={proData?.multiples as any}
              onSave={(data) => saveProData('multiples', data)}
            />
          );
        case 'timer':
          return (
            <ProjectTimer
              projectId={projectId}
              initialSeconds={(proData?.timer as any)?.timerSeconds || 0}
              initialPricing={(proData?.timer as any)?.pricing}
              onSave={(data) => saveProData('timer', data)}
            />
          );
        case 'temperature':
          return (
            <TemperaturePlanner
              projectId={projectId}
              initialRanges={(proData?.temperature as any)?.tempRanges}
              initialUnit={(proData?.temperature as any)?.unit}
              initialLog={(proData?.temperature as any)?.dailyLog}
              onSave={(data) => saveProData('temperature', data)}
            />
          );
        case 'granny':
          return (
            <GrannySquareLayout
              projectId={projectId}
              initialConfig={proData?.granny as any}
              onSave={(data) => saveProData('granny', data)}
            />
          );
        default:
          return null;
      }
    })();

    if (!tool.free) {
      return (
        <ProGate isPro={isPro} featureName={tool.label}>
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            {content}
          </motion.div>
        </ProGate>
      );
    }

    return (
      <motion.div
        key={activeTool}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-3"
      >
        {content}
      </motion.div>
    );
  };

  const proToolCount = TOOLS.filter((t) => !t.free).length;

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
          expanded
            ? 'bg-white border-[#5E8A5E]/30 shadow-sm'
            : 'bg-gradient-to-r from-white to-[#FAF0E4] border-[#EDE8E3] hover:border-[#5E8A5E]/30'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#5E8A5E]/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#5E8A5E]" />
          </div>
          <span className="text-[#3D352E] text-sm font-semibold">
            Project Tools
          </span>
          {!isPro && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5E8A5E]/10 text-[#5E8A5E] text-[10px] font-bold uppercase tracking-wider">
              <Crown className="w-2.5 h-2.5" />
              {proToolCount} Pro tools
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[#8D7B6A]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 mt-3">
              {TOOLS.map((tool) => {
                const isActive = activeTool === tool.key;
                const isLocked = !tool.free && !isPro;
                return (
                  <button
                    key={tool.key}
                    onClick={() => handleToolClick(tool.key)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#5E8A5E] text-white shadow-sm'
                        : isLocked
                          ? 'bg-[#FAF0E4] border border-[#EDE8E3] text-[#8D7B6A] hover:border-[#5E8A5E]/30'
                          : 'bg-white border border-[#EDE8E3] text-[#3D352E] hover:border-[#5E8A5E]/30'
                    }`}
                  >
                    <tool.icon className="w-3.5 h-3.5" />
                    {tool.label}
                    {isLocked && (
                      <Crown className="w-3 h-3 text-[#5E8A5E] ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {!isPro && !activeTool && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#5E8A5E]/5 to-[#FAF0E4] border border-[#5E8A5E]/15"
              >
                <p className="text-xs text-[#3D352E]">
                  <span className="font-semibold">Unlock {proToolCount} Pro tools</span>{' '}
                  <span className="text-[#746454]">
                    — timer, yarn sub, hat calc, multiples, temp planner & layout designer.
                  </span>
                </p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {renderToolContent()}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
