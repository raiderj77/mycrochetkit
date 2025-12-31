/**
 * Pattern Library Page
 * Browse and manage crochet patterns
 */

import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { usePatternStore } from '@/stores/patternStore';
import { AddPatternDialog } from '@/components/AddPatternDialog';
import { PatternCard } from '@/components/PatternCard';
import type { SkillLevel } from '@/types/models';

type FilterSkill = 'all' | SkillLevel;

export default function PatternLibrary() {
  const patterns = usePatternStore((state) => state.patterns);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState<FilterSkill>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'added'>('added');
  
  // Filter patterns
  let filteredPatterns = patterns;
  
  // Apply search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPatterns = filteredPatterns.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.author?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply skill level filter
  if (filterSkill !== 'all') {
    filteredPatterns = filteredPatterns.filter((p) => p.skillLevel === filterSkill);
  }
  
  // Apply favorites filter
  if (showFavoritesOnly) {
    filteredPatterns = filteredPatterns.filter((p) => p.isFavorite);
  }
  
  // Apply sort
  filteredPatterns = [...filteredPatterns].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return (a.author || '').localeCompare(b.author || '');
      case 'added':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      default:
        return 0;
    }
  });
  
  const favoritesCount = patterns.filter((p) => p.isFavorite).length;
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Pattern Library
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {patterns.length} pattern{patterns.length !== 1 ? 's' : ''} 
            {favoritesCount > 0 && ` • ${favoritesCount} favorite${favoritesCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="btn-primary"
        >
          Add Pattern
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search patterns by title, author, category..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterSkill('all')}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              filterSkill === 'all'
                ? 'bg-primary-600 text-white dark:bg-primary-500 active-toggle'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            All Levels
          </button>
          {(['beginner', 'easy', 'intermediate', 'advanced'] as SkillLevel[]).map((skill) => (
            <button
              key={skill}
              onClick={() => setFilterSkill(skill)}
              className={`rounded-full px-4 py-1 text-sm font-medium capitalize transition-colors ${
                filterSkill === skill
                  ? 'bg-primary-600 text-white dark:bg-primary-500 active-toggle'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {skill}
            </button>
          ))}
          
          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              showFavoritesOnly
                ? 'bg-yellow-500 text-white dark:bg-yellow-600 active-toggle'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites
          </button>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-neutral-600 dark:text-neutral-400">
            Sort by:
          </label>
          <select
            id="sort"
            className="input w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="added">Date Added (Newest First)</option>
            <option value="title">Title (A-Z)</option>
            <option value="author">Author (A-Z)</option>
          </select>
        </div>
      </div>
      
      {/* Pattern Grid */}
      {filteredPatterns.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">
              {searchQuery.trim() || showFavoritesOnly ? '🔍' : '📚'}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              {searchQuery.trim()
                ? 'No patterns found'
                : showFavoritesOnly
                ? 'No favorite patterns yet'
                : 'Your pattern library is empty'}
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {searchQuery.trim()
                ? 'Try a different search term'
                : showFavoritesOnly
                ? 'Click the star icon on patterns to add them to favorites'
                : 'Start building your pattern collection.'}
            </p>
            {!searchQuery.trim() && !showFavoritesOnly && (
              <button
                onClick={() => setShowAddDialog(true)}
                className="btn-primary"
              >
                Add Your First Pattern
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPatterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      )}
      
      {/* Add Pattern Dialog */}
      <AddPatternDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
