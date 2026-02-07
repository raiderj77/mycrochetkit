import { motion } from 'framer-motion';
import { X, ExternalLink, Edit3, Trash2, Copy, Play, Clock, Ruler } from 'lucide-react';
import type { Pattern, PatternType, Difficulty } from '../../types/pattern';

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

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  easy: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

interface PatternDetailProps {
  pattern: Pattern;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onStartProject?: () => void;
}

export function PatternDetail({ pattern, onClose, onDelete, onDuplicate }: PatternDetailProps) {
  const handleDelete = () => {
    if (confirm('Delete this pattern? This cannot be undone.')) {
      onDelete?.();
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
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="relative h-32 bg-gradient-to-br from-[#FFF8F0] to-[#F5E6E0] flex items-center justify-center flex-shrink-0">
          <span className="text-6xl">{TYPE_ICONS[pattern.type]}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#2C1810]/50 hover:text-[#2C1810]"
          >
            <X className="w-5 h-5" />
          </button>
          {pattern.isGenerated && (
            <div className="absolute top-4 left-4 px-2 py-0.5 bg-[#B8A9C9] text-white text-xs font-medium rounded-full">
              ✨ Vibe Generated
            </div>
          )}
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1">
          <h2 className="text-xl font-semibold text-[#2C1810] mb-2">{pattern.name}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[#FFF8F0] text-[#2C1810]/70 text-sm rounded-full capitalize">
              {pattern.type}
            </span>
            {pattern.difficulty && (
              <span
                className={`px-3 py-1 text-sm rounded-full capitalize ${DIFFICULTY_COLORS[pattern.difficulty]}`}
              >
                {pattern.difficulty}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {pattern.hookSize && (
              <div className="flex items-center gap-2 text-sm text-[#2C1810]/60">
                <span>🪝</span>
                <span>Hook: {pattern.hookSize}</span>
              </div>
            )}
            {pattern.yarnWeight && (
              <div className="flex items-center gap-2 text-sm text-[#2C1810]/60">
                <span>🧶</span>
                <span className="capitalize">{pattern.yarnWeight.replace('_', ' ')}</span>
              </div>
            )}
            {pattern.estimatedTime && (
              <div className="flex items-center gap-2 text-sm text-[#2C1810]/60">
                <Clock className="w-4 h-4" />
                <span>{pattern.estimatedTime}</span>
              </div>
            )}
            {pattern.finishedSize && (
              <div className="flex items-center gap-2 text-sm text-[#2C1810]/60">
                <Ruler className="w-4 h-4" />
                <span>{pattern.finishedSize}</span>
              </div>
            )}
          </div>

          {pattern.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pattern.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs text-[#2C1810]/50 bg-[#FFF8F0] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {pattern.source.type === 'link' && pattern.source.url && (
            <a
              href={pattern.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#E86A58] text-sm hover:bg-[#F5E6E0] transition-colors mb-4"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="truncate">{pattern.source.url}</span>
            </a>
          )}

          {pattern.notes && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#2C1810] mb-1">Notes</h3>
              <p className="text-sm text-[#2C1810]/60">{pattern.notes}</p>
            </div>
          )}

          {pattern.sections.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-[#2C1810] mb-2">
                Sections ({pattern.sections.length})
              </h3>
              <div className="space-y-1">
                {pattern.sections.slice(0, 5).map((section, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-[#FFF8F0] rounded-lg text-sm"
                  >
                    <span className="text-[#2C1810]">{section.name}</span>
                    <span className="text-[#2C1810]/40">
                      {section.steps.length} steps
                      {section.repeatCount > 1 && ` × ${section.repeatCount}`}
                    </span>
                  </div>
                ))}
                {pattern.sections.length > 5 && (
                  <p className="text-xs text-[#2C1810]/40 text-center py-1">
                    +{pattern.sections.length - 5} more sections
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#2C1810]/10">
            <button
              onClick={() => (window.location.href = `/patterns/${pattern.id}/edit`)}
              className="flex flex-col items-center gap-1 py-3 text-[#2C1810]/60 hover:text-[#2C1810] hover:bg-[#FFF8F0] rounded-xl transition-colors"
            >
              <Edit3 className="w-5 h-5" />
              <span className="text-xs">Edit</span>
            </button>
            <button
              onClick={onDuplicate}
              className="flex flex-col items-center gap-1 py-3 text-[#2C1810]/60 hover:text-[#2C1810] hover:bg-[#FFF8F0] rounded-xl transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span className="text-xs">Duplicate</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex flex-col items-center gap-1 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-xs">Delete</span>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#2C1810]/10 flex-shrink-0">
          <button
            onClick={() => (window.location.href = `/patterns/${pattern.id}/track`)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-medium rounded-xl transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Project with Pattern
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
