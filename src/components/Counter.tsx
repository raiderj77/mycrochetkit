/**
 * Counter Component
 * 
 * Visual counter with large tap-friendly buttons for row/stitch tracking
 */

import { Plus, Minus, RotateCcw, Undo2 } from 'lucide-react';
import { useCounterStore } from '@/stores/counterStore';
import type { Counter as CounterType } from '@/types/models';

interface CounterProps {
  counter: CounterType;
}

export function Counter({ counter }: CounterProps) {
  const { increment, decrement, reset, undo } = useCounterStore();
  
  const progress = counter.target
    ? (counter.current / counter.target) * 100
    : 0;
  
  const canUndo = counter.history.length > 0;
  
  return (
    <div
      className="card-neumorphic relative overflow-hidden p-8 transition-all hover:scale-[1.02]"
    >
      {/* Target Progress Bar (Vertical/Subtle) */}
      {counter.target && (
        <div
          className="absolute left-0 bottom-0 w-1.5 bg-indigo-500/40"
          style={{
            height: `${progress}%`,
          }}
        />
      )}
      
      <div className="relative">
        {/* Counter Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black tracking-tight text-white">
              {counter.name.toUpperCase()}
            </h3>
            {counter.target && (
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Target: {counter.target}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                undo(counter.id);
              }}
              disabled={!canUndo}
              className="p-2.5 text-slate-500 hover:text-white transition-colors disabled:opacity-20"
              title="Undo"
            >
              <Undo2 className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset(counter.id);
              }}
              className="p-2.5 text-slate-500 hover:text-rose-400 transition-colors"
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Main Number Display */}
        <div className="mb-8 text-center py-4">
          <div className="relative text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {counter.current}
            {counter.target && (
              <span className="text-2xl text-slate-600 block mt-1 font-bold">
                of {counter.target}
              </span>
            )}
          </div>
          {counter.target && (
            <div className="mt-4 flex justify-center">
               <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black tracking-widest border border-indigo-500/20">
                {progress.toFixed(0)}% COMPLETE
               </span>
            </div>
          )}
        </div>
        
        {/* Tall Pill-Shaped Buttons */}
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              decrement(counter.id);
            }}
            disabled={counter.current === 0}
            className="btn-pill flex h-20 items-center justify-center bg-slate-800 text-white transition-all hover:bg-slate-700 active:scale-95 disabled:opacity-20 border border-white/5"
          >
            <Minus className="h-8 w-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              increment(counter.id);
            }}
            className="btn-pill flex h-20 items-center justify-center bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:bg-indigo-50 hover:shadow-indigo-500/20 active:scale-95 border border-indigo-400/30"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
        
        {/* Reminders */}
        {counter.reminders
          .filter((r) => !r.completed && r.triggerAt === counter.current)
          .map((reminder) => (
            <div
              key={reminder.id}
              className="mt-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs font-bold text-amber-500 flex items-center gap-3 animate-bounce"
            >
              <span className="text-xl">📌</span>
              {reminder.message.toUpperCase()}
            </div>
          ))}
      </div>
    </div>
  );
}
