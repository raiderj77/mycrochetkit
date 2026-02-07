import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Link, Edit3, Sparkles } from 'lucide-react';
import { usePatterns } from '../../hooks/usePatterns';
import type {
  PatternFormData,
  PatternType,
  Difficulty,
  YarnWeight,
  PatternSourceType,
} from '../../types/pattern';

const SOURCE_OPTIONS: {
  type: PatternSourceType;
  icon: React.ReactNode;
  label: string;
  desc: string;
}[] = [
  {
    type: 'link',
    icon: <Link className="w-6 h-6" />,
    label: 'Link',
    desc: 'Save a URL to a pattern',
  },
  {
    type: 'typed',
    icon: <Edit3 className="w-6 h-6" />,
    label: 'Type It',
    desc: 'Enter steps manually',
  },
  {
    type: 'generated',
    icon: <Sparkles className="w-6 h-6" />,
    label: 'Vibe Create',
    desc: 'AI generates it',
  },
];

const PATTERN_TYPES: { value: PatternType; label: string; icon: string }[] = [
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

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'easy', label: 'Easy' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const YARN_WEIGHTS: { value: YarnWeight; label: string }[] = [
  { value: 'lace', label: 'Lace' },
  { value: 'fingering', label: 'Fingering' },
  { value: 'sport', label: 'Sport' },
  { value: 'dk', label: 'DK' },
  { value: 'worsted', label: 'Worsted' },
  { value: 'bulky', label: 'Bulky' },
  { value: 'super_bulky', label: 'Super Bulky' },
];

interface PatternAddModalProps {
  uid: string;
  isPro?: boolean;
  onClose: () => void;
  onPatternAdded: (patternId: string) => void;
}

export function PatternAddModal({
  uid,
  isPro = false,
  onClose,
  onPatternAdded,
}: PatternAddModalProps) {
  const { createPattern, checkCanCreate } = usePatterns(uid);

  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [sourceType, setSourceType] = useState<PatternSourceType>('link');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<PatternType>('other');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [hookSize, setHookSize] = useState('');
  const [yarnWeight, setYarnWeight] = useState<YarnWeight | ''>('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  const handleSourceSelect = async (selected: PatternSourceType) => {
    const canCreate = await checkCanCreate(isPro);
    if (!canCreate.allowed) {
      setError(canCreate.reason || 'Pattern limit reached');
      return;
    }

    if (selected === 'generated') {
      alert('Vibe Creator coming soon! 🎉');
      return;
    }

    setSourceType(selected);
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Pattern name is required');
      return;
    }

    if (sourceType === 'link' && !url.trim()) {
      setError('URL is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData: PatternFormData = {
        name: name.trim(),
        type,
        difficulty: difficulty || undefined,
        hookSize: hookSize || undefined,
        yarnWeight: yarnWeight || undefined,
        materials: [],
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        source: sourceType === 'link' ? { type: 'link', url: url.trim() } : { type: 'typed' },
        sections: [],
        abbreviations: {},
        notes: notes || undefined,
      };

      const pattern = await createPattern(formData);

      if (pattern) {
        if (sourceType === 'typed') {
          // Redirect to step editor for typed patterns
          window.location.href = `/patterns/${pattern.id}/edit`;
        } else {
          onPatternAdded(pattern.id);
        }
      }
    } catch (err: unknown) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save pattern');
      setSaving(false);
    }
  };

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
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C1810]/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 'form' && (
              <button
                onClick={() => setStep('choose')}
                className="w-8 h-8 flex items-center justify-center text-[#2C1810]/50 hover:text-[#2C1810] -ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-[#2C1810]">
              {step === 'choose' ? 'Add Pattern' : 'Pattern Details'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#2C1810]/40 hover:text-[#2C1810]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          <AnimatePresence mode="wait">
            {step === 'choose' ? (
              <motion.div
                key="choose"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <p className="text-[#2C1810]/50 text-sm mb-4">
                  How do you want to add this pattern?
                </p>
                {SOURCE_OPTIONS.map((option) => (
                  <motion.button
                    key={option.type}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSourceSelect(option.type)}
                    className="w-full flex items-center gap-4 p-4 bg-[#FFF8F0] hover:bg-[#F5E6E0] rounded-xl text-left transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#E86A58]">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#2C1810]">{option.label}</div>
                      <div className="text-sm text-[#2C1810]/50">{option.desc}</div>
                    </div>
                    {option.type === 'generated' && (
                      <span className="px-2 py-0.5 bg-[#B8A9C9]/20 text-[#B8A9C9] text-xs font-medium rounded-full">
                        SOON
                      </span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                    Pattern Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chonky Frog Plushie"
                    className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                  />
                </div>

                {sourceType === 'link' && (
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                      Pattern URL *
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                    Pattern Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PATTERN_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setType(t.value)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          type === t.value
                            ? 'bg-[#E86A58] text-white'
                            : 'bg-[#FFF8F0] text-[#2C1810]/70 hover:bg-[#F5E6E0]'
                        }`}
                      >
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setDifficulty(difficulty === d.value ? '' : d.value)}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          difficulty === d.value
                            ? 'bg-[#7FBFA0] text-white'
                            : 'bg-[#FFF8F0] text-[#2C1810]/70 hover:bg-[#F5E6E0]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                      Hook Size
                    </label>
                    <input
                      type="text"
                      value={hookSize}
                      onChange={(e) => setHookSize(e.target.value)}
                      placeholder="e.g. 4.0mm"
                      className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                      Yarn Weight
                    </label>
                    <select
                      value={yarnWeight}
                      onChange={(e) => setYarnWeight(e.target.value as YarnWeight | '')}
                      className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                    >
                      <option value="">Select...</option>
                      {YARN_WEIGHTS.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1.5">
                    Tags <span className="font-normal text-[#2C1810]/40">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. cute, gift, quick"
                    className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1.5">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any notes about this pattern..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/30 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === 'form' && (
          <div className="px-5 py-4 border-t border-[#2C1810]/10 flex-shrink-0">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-3 bg-[#E86A58] hover:bg-[#D35A4A] disabled:bg-[#E86A58]/50 text-white font-medium rounded-xl transition-colors"
            >
              {saving ? 'Saving...' : sourceType === 'typed' ? 'Save & Add Steps' : 'Save Pattern'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
