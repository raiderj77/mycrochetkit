import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, X } from 'lucide-react';
import { usePatterns } from '../../hooks/usePatterns';
import { PatternCard } from './PatternCard';
import { PatternAddModal } from './PatternAddModal';
import { PatternDetail } from './PatternDetail';
import type { Pattern, PatternType, Difficulty } from '../../types/pattern';

const PATTERN_TYPES: { value: PatternType | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '📚' },
  { value: 'plushie', label: 'Plushie', icon: '🧸' },
  { value: 'amigurumi', label: 'Amigurumi', icon: '🐰' },
  { value: 'applique', label: 'Applique', icon: '🌸' },
  { value: 'blanket', label: 'Blanket', icon: '🛏️' },
  { value: 'garment', label: 'Garment', icon: '👕' },
  { value: 'hat', label: 'Hat', icon: '🎩' },
  { value: 'scarf', label: 'Scarf', icon: '🧣' },
  { value: 'bag', label: 'Bag', icon: '👜' },
  { value: 'other', label: 'Other', icon: '🧶' },
];

const DIFFICULTIES: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'Any Level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'easy', label: 'Easy' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

interface PatternLibraryProps {
  uid: string;
  isPro?: boolean;
  onBack?: () => void;
  onStartProject?: (patternId: string) => void;
}

export function PatternLibrary({
  uid,
  isPro = false,
  onBack,
  onStartProject,
}: PatternLibraryProps) {
  const { patterns, loading, error, loadPatterns, deletePattern, duplicatePattern } =
    usePatterns(uid);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PatternType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const filteredPatterns = useMemo(() => {
    let result = patterns;
    if (typeFilter !== 'all') result = result.filter((p) => p.type === typeFilter);
    if (difficultyFilter !== 'all')
      result = result.filter((p) => p.difficulty === difficultyFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return result;
  }, [patterns, typeFilter, difficultyFilter, searchQuery]);

  const activeFiltersCount = (typeFilter !== 'all' ? 1 : 0) + (difficultyFilter !== 'all' ? 1 : 0);

  const handlePatternAdded = () => {
    setShowAddModal(false);
    loadPatterns();
  };

  const handleDelete = async () => {
    if (selectedPattern) {
      await deletePattern(selectedPattern.id);
      setSelectedPattern(null);
    }
  };

  const handleDuplicate = async () => {
    if (selectedPattern) {
      await duplicatePattern(selectedPattern.id);
      setSelectedPattern(null);
    }
  };

  const handleStartProject = () => {
    if (selectedPattern) {
      onStartProject?.(selectedPattern.id);
      setSelectedPattern(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-10 h-10 flex items-center justify-center text-[#2C1810]/50 hover:text-[#2C1810] text-xl"
                >
                  ←
                </button>
              )}
              <h1 className="text-2xl font-bold text-[#2C1810]">📚 Patterns</h1>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 bg-[#E86A58] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#E86A58]/25"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C1810]/30" />
              <input
                type="text"
                placeholder="Search patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors relative ${showFilters || activeFiltersCount > 0 ? 'bg-[#E86A58] text-white' : 'bg-white text-[#2C1810]/50'}`}
            >
              <Filter className="w-5 h-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B8A9C9] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-3 space-y-3">
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                    {PATTERN_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTypeFilter(t.value)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${typeFilter === t.value ? 'bg-[#E86A58] text-white' : 'bg-white text-[#2C1810]/60'}`}
                      >
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDifficultyFilter(d.value)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${difficultyFilter === d.value ? 'bg-[#7FBFA0] text-white' : 'bg-white text-[#2C1810]/60'}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        setTypeFilter('all');
                        setDifficultyFilter('all');
                      }}
                      className="flex items-center gap-1 text-sm text-[#E86A58]"
                    >
                      <X className="w-4 h-4" />
                      Clear filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="w-12 h-12 rounded-full border-3 border-[#E86A58]/20 border-t-[#E86A58]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-[#2C1810]/50 mb-4">{error}</p>
            <button
              onClick={() => loadPatterns()}
              className="px-4 py-2 bg-[#E86A58] text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredPatterns.length === 0 ? (
          <div className="text-center py-20">
            {patterns.length === 0 ? (
              <>
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-xl font-semibold text-[#2C1810] mb-2">No patterns yet</h2>
                <p className="text-[#2C1810]/50 mb-6">Save your favorite patterns here</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-[#E86A58] text-white rounded-xl font-medium shadow-lg shadow-[#E86A58]/25"
                >
                  + Add First Pattern
                </motion.button>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-lg font-medium text-[#2C1810]/60">No matches</h2>
                <p className="text-[#2C1810]/40">Try adjusting your search or filters</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredPatterns.map((pattern) => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  onClick={() => setSelectedPattern(pattern)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showAddModal && (
          <PatternAddModal
            uid={uid}
            isPro={isPro}
            onClose={() => setShowAddModal(false)}
            onPatternAdded={handlePatternAdded}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPattern && (
          <PatternDetail
            pattern={selectedPattern}
            onClose={() => setSelectedPattern(null)}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onStartProject={handleStartProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
