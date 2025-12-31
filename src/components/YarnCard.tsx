/**
 * Yarn Card Component
 * 
 * Display yarn stash entry with photo
 */


import { Trash2, MapPin } from 'lucide-react';
import { useStashStore } from '@/stores/stashStore';
import type { YarnStash } from '@/types/models';

interface YarnCardProps {
  yarn: YarnStash;
}

const weightColors = {
  lace: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  fingering: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  sport: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  dk: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  worsted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  aran: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  bulky: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'super-bulky': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  jumbo: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
};

export function YarnCard({ yarn }: YarnCardProps) {
  const deleteYarn = useStashStore((state) => state.deleteYarn);
  
  const handleDelete = async () => {
    const confirmed = confirm(
      `Delete ${yarn.brand} ${yarn.colorway}? This cannot be undone.`
    );
    
    if (confirmed) {
      await deleteYarn(yarn.id);
    }
  };
  
  const isLowStock = yarn.yardageRemaining < 100;
  
  return (
    <div className="card group overflow-hidden">
      {/* Photo */}
      {yarn.photo ? (
        <div className="relative -mx-6 -mt-6 mb-4 h-48 overflow-hidden">
          <img
            src={yarn.photo}
            alt={`${yarn.brand} ${yarn.colorway}`}
            className="h-full w-full object-cover"
          />
          {isLowStock && (
            <div className="absolute right-2 top-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              Low Stock
            </div>
          )}
        </div>
      ) : (
        <div className="relative -mx-6 -mt-6 mb-4 flex h-48 items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
          <span className="text-6xl">🧵</span>
          {isLowStock && (
            <div className="absolute right-2 top-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              Low Stock
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
            {yarn.brand}
          </h3>
          {yarn.line && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {yarn.line}
            </p>
          )}
          <p className="font-medium text-neutral-800 dark:text-neutral-200">
            {yarn.colorway}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleDelete}
            className="tap-target rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/30"
            aria-label="Delete yarn"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
      
      {/* Weight Badge */}
      <div className="mb-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
            weightColors[yarn.weight]
          }`}
        >
          {yarn.weight.replace('-', ' ')}
        </span>
      </div>
      
      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">Fiber:</span>
          <span className="text-neutral-900 dark:text-neutral-50">
            {yarn.fiber}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">Skeins:</span>
          <span className="text-neutral-900 dark:text-neutral-50">
            {yarn.skeinsOwned}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-neutral-600 dark:text-neutral-400">Yardage:</span>
          <span className={`font-medium ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-900 dark:text-neutral-50'}`}>
            {yarn.yardageRemaining.toFixed(0)} yds
          </span>
        </div>
        
        {yarn.storageLocation && (
          <div className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4 text-neutral-400" />
            <span className="text-neutral-600 dark:text-neutral-400">
              {yarn.storageLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
