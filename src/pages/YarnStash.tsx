/**
 * Yarn Stash Page
 * Manage yarn inventory
 */

import { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { useStashStore } from '@/stores/stashStore';
import { AddYarnDialog } from '@/components/AddYarnDialog';
import { YarnCard } from '@/components/YarnCard';
import type { YarnWeight } from '@/types/models';

type FilterWeight = 'all' | YarnWeight;

export default function YarnStash() {
  const stash = useStashStore((state) => state.stash);
  const getLowStock = useStashStore((state) => state.getLowStock);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWeight, setFilterWeight] = useState<FilterWeight>('all');
  const [sortBy, setSortBy] = useState<'brand' | 'colorway' | 'yardage'>('brand');
  
  // Filter yarn
  let filteredStash = stash;
  
  // Apply search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredStash = filteredStash.filter(
      (y) =>
        y.brand.toLowerCase().includes(query) ||
        y.line?.toLowerCase().includes(query) ||
        y.colorway.toLowerCase().includes(query) ||
        y.fiber.toLowerCase().includes(query) ||
        y.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply weight filter
  if (filterWeight !== 'all') {
    filteredStash = filteredStash.filter((y) => y.weight === filterWeight);
  }
  
  // Apply sort
  filteredStash = [...filteredStash].sort((a, b) => {
    switch (sortBy) {
      case 'brand':
        return a.brand.localeCompare(b.brand);
      case 'colorway':
        return a.colorway.localeCompare(b.colorway);
      case 'yardage':
        return b.yardageRemaining - a.yardageRemaining;
      default:
        return 0;
    }
  });
  
  const lowStockYarns = getLowStock();
  const totalYardage = stash.reduce((sum, y) => sum + y.yardageRemaining, 0);
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Yarn Stash
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {stash.length} yarn{stash.length !== 1 ? 's' : ''} • {totalYardage.toFixed(0)} total yards
          </p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="btn-primary"
        >
          Add Yarn
        </button>
      </div>
      
      {/* Low Stock Alert */}
      {lowStockYarns.length > 0 && (
        <div className="card mb-6 border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Low Stock Alert
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {lowStockYarns.length} yarn{lowStockYarns.length > 1 ? 's' : ''} with less than 100 yards remaining
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by brand, colorway, fiber..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterWeight('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filterWeight === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            All Weights
          </button>
          {(['worsted', 'bulky', 'dk', 'fingering'] as YarnWeight[]).map((weight) => (
            <button
              key={weight}
              onClick={() => setFilterWeight(weight)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                filterWeight === weight
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              {weight.replace('-', ' ')}
            </button>
          ))}
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
            <option value="brand">Brand (A-Z)</option>
            <option value="colorway">Colorway (A-Z)</option>
            <option value="yardage">Yardage (High to Low)</option>
          </select>
        </div>
      </div>
      
      {/* Yarn Grid */}
      {filteredStash.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <div className="mb-4 text-6xl">
              {searchQuery.trim() ? '🔍' : '🧵'}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              {searchQuery.trim()
                ? 'No yarn found'
                : 'Your stash is empty'}
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {searchQuery.trim()
                ? 'Try a different search term'
                : 'Start cataloging your yarn collection.'}
            </p>
            {!searchQuery.trim() && (
              <button
                onClick={() => setShowAddDialog(true)}
                className="btn-primary"
              >
                Add Your First Yarn
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStash.map((yarn) => (
            <YarnCard key={yarn.id} yarn={yarn} />
          ))}
        </div>
      )}
      
      {/* Add Yarn Dialog */}
      <AddYarnDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
