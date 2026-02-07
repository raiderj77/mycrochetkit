import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { usePatterns } from '../hooks/usePatterns';
import type { PatternType } from '../types/pattern';

const TYPE_ICONS: Record<PatternType, string> = {
  plushie: '🧸',
  applique: '🌸',
  blanket: '🛏️',
  garment: '👕',
  hat: '🎩',
  scarf: '🧣',
  bag: '👜',
  amigurumi: '🐰',
  other: '🧶',
};

interface PatternPickerProps {
  uid: string;
  onSelect: (patternId: string) => void;
  onClose: () => void;
}

export function PatternPicker({ uid, onSelect, onClose }: PatternPickerProps) {
  const { patterns, loading } = usePatterns(uid);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return patterns;
    const q = search.toLowerCase();
    return patterns.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [patterns, search]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C1810]/10 flex-shrink-0">
          <h2 className="text-lg font-semibold text-[#2C1810]">Link a Pattern</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#2C1810]/60 hover:text-[#2C1810] rounded-full hover:bg-[#FFF8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C1810]/40" />
            <input
              type="text"
              placeholder="Search patterns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#FFF8F0] rounded-xl text-sm text-[#2C1810] placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/30"
              autoFocus
            />
          </div>
        </div>

        {/* Pattern List */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#2C1810]/50 text-sm">
                {patterns.length === 0 ? 'No patterns in your library' : 'No matches found'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => onSelect(pattern.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF8F0] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{TYPE_ICONS[pattern.type]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C1810] truncate">{pattern.name}</p>
                    <p className="text-xs text-[#2C1810]/50">
                      {pattern.sections.length} section{pattern.sections.length !== 1 ? 's' : ''}
                      {' · '}
                      {pattern.sections.reduce((sum, s) => sum + s.steps.length, 0)} steps
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
