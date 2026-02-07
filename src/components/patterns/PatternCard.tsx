import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Pattern, PatternType, Difficulty } from '../../types/pattern';

const TYPE_COLORS: Record<PatternType, string> = {
  plushie: 'bg-rose-100 text-rose-700',
  applique: 'bg-amber-100 text-amber-700',
  blanket: 'bg-sky-100 text-sky-700',
  garment: 'bg-violet-100 text-violet-700',
  hat: 'bg-teal-100 text-teal-700',
  scarf: 'bg-orange-100 text-orange-700',
  bag: 'bg-lime-100 text-lime-700',
  amigurumi: 'bg-pink-100 text-pink-700',
  other: 'bg-stone-100 text-stone-600',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  easy: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

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

interface PatternCardProps {
  pattern: Pattern;
  projectCount?: number;
  onClick: () => void;
  onLongPress?: () => void;
}

export function PatternCard({ pattern, projectCount = 0, onClick, onLongPress }: PatternCardProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    if (onLongPress) {
      pressTimer.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const displayTags = pattern.tags.slice(0, 3);
  const hasMoreTags = pattern.tags.length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`
        relative bg-white rounded-2xl shadow-sm
        border border-[#2C1810]/10
        overflow-hidden cursor-pointer
        transition-shadow duration-200
        hover:shadow-md active:shadow-sm
        ${isPressed ? 'ring-2 ring-[#E86A58]/50' : ''}
      `}
    >
      <div className="h-28 bg-gradient-to-br from-[#FFF8F0] to-[#F5E6E0] flex items-center justify-center relative">
        <span className="text-5xl">{TYPE_ICONS[pattern.type]}</span>

        {pattern.isGenerated && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#B8A9C9] text-white text-xs font-medium rounded-full shadow-sm">
            ✨ Vibe
          </div>
        )}

        {pattern.source.type === 'pdf' && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
            <span className="text-sm">📄</span>
          </div>
        )}
        {pattern.source.type === 'link' && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
            <span className="text-sm">🔗</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[#2C1810] text-base leading-snug line-clamp-2 mb-2">
          {pattern.name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${TYPE_COLORS[pattern.type]}`}
          >
            {pattern.type}
          </span>
          {pattern.difficulty && (
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${DIFFICULTY_COLORS[pattern.difficulty]}`}
            >
              {pattern.difficulty}
            </span>
          )}
        </div>

        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs text-[#2C1810]/50 bg-[#FFF8F0] rounded-full"
              >
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span className="px-2 py-0.5 text-xs text-[#2C1810]/30">
                +{pattern.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#2C1810]/40">
          {projectCount > 0 ? (
            <div className="flex items-center gap-1">
              <span>📋</span>
              <span>
                {projectCount} project{projectCount !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <span></span>
          )}
          {pattern.hookSize && <span>{pattern.hookSize}</span>}
        </div>
      </div>
    </motion.div>
  );
}
