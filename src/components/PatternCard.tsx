/**
 * Pattern Card Component
 * 
 * Display pattern with cover image and metadata
 */

import { Star, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePatternStore } from '@/stores/patternStore';
import type { Pattern } from '@/types/models';

interface PatternCardProps {
  pattern: Pattern;
}

const skillColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  easy: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  advanced: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  expert: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function PatternCard({ pattern }: PatternCardProps) {
  const navigate = useNavigate();
  const deletePattern = usePatternStore((state) => state.deletePattern);
  const toggleFavorite = usePatternStore((state) => state.toggleFavorite);
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when deleting
    const confirmed = confirm(
      `Delete pattern "${pattern.title}"? This cannot be undone.`
    );
    
    if (confirmed) {
      await deletePattern(pattern.id);
    }
  };
  
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when favoriting
    toggleFavorite(pattern.id);
  };
  
  const handleCardClick = () => {
    navigate(`/patterns/${pattern.id}`);
  };
  
  return (
    <div
      onClick={handleCardClick}
      className="card group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
    >
      {/* Cover Image */}
      {pattern.coverImage ? (
        <div className="relative -mx-6 -mt-6 mb-4 h-48 overflow-hidden">
          <img
            src={pattern.coverImage}
            alt={pattern.title}
            className="h-full w-full object-cover"
          />
          {pattern.pdfFile && (
            <div className="absolute left-2 top-2 rounded-full bg-primary-600 p-2 text-white">
              <FileText className="h-4 w-4" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative -mx-6 -mt-6 mb-4 flex h-48 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
          <span className="text-6xl">📄</span>
          {pattern.pdfFile && (
            <div className="absolute left-2 top-2 rounded-full bg-primary-600 p-2 text-white">
              <FileText className="h-4 w-4" />
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
            {pattern.title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            by {pattern.author}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleFavorite}
            className={`tap-target rounded p-1 ${
              pattern.isFavorite
                ? 'text-yellow-500'
                : 'text-neutral-400 hover:text-yellow-500'
            }`}
            aria-label="Toggle favorite"
            title="Favorite"
          >
            <Star className={`h-4 w-4 ${pattern.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDelete}
            className="tap-target rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
            aria-label="Delete pattern"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
      
      {/* Skill Level Badge */}
      <div className="mb-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
            skillColors[pattern.skillLevel]
          }`}
        >
          {pattern.skillLevel}
        </span>
      </div>
      
      {/* Details */}
      <div className="space-y-2 text-sm">
        {pattern.category && (
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Category:</span>
            <span className="text-neutral-900 dark:text-neutral-50">
              {pattern.category}
            </span>
          </div>
        )}
        
        {pattern.hookSize && (
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Hook:</span>
            <span className="text-neutral-900 dark:text-neutral-50">
              {pattern.hookSize}
            </span>
          </div>
        )}
        
        {pattern.yarnWeight && (
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Yarn:</span>
            <span className="text-neutral-900 dark:text-neutral-50">
              {pattern.yarnWeight}
            </span>
          </div>
        )}
        
        {pattern.source && (
          <div className="flex justify-between">
            <span className="text-neutral-600 dark:text-neutral-400">Source:</span>
            <span className="truncate text-neutral-900 dark:text-neutral-50">
              {pattern.source}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
