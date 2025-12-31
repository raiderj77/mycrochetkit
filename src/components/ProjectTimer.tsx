import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, increment, Timestamp } from 'firebase/firestore';

interface ProjectTimerProps {
  projectId: string;
  initialTotalSeconds?: number;
  initialHourlyRate?: number;
  initialMaterialCost?: number;
}

export default function ProjectTimer({ 
  projectId, 
  initialTotalSeconds = 0,
  initialHourlyRate = 0,
  initialMaterialCost = 0
}: ProjectTimerProps) {
  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0); 
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds); 
  
  // Pricing State
  const [hourlyRate, setHourlyRate] = useState(initialHourlyRate);
  const [materialCost, setMaterialCost] = useState(initialMaterialCost);
  const [showSettings, setShowSettings] = useState(false); // Toggle to hide/show inputs

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- CALCULATIONS ---
  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate live value: Materials + ( (TotalTime + CurrentSession) / 3600 * Rate )
  const currentTotalSeconds = totalSeconds + sessionSeconds;
  const timeValue = (currentTotalSeconds / 3600) * hourlyRate;
  const totalValue = materialCost + timeValue;

  // --- ACTIONS ---
  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = async () => {
    if (!isRunning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);

    const duration = sessionSeconds;
    const newTotal = totalSeconds + duration;
    setTotalSeconds(newTotal);
    setSessionSeconds(0);

    try {
      await updateDoc(doc(db, "projects", projectId), {
        totalSeconds: increment(duration),
        sessions: arrayUnion({
          date: Timestamp.now(),
          durationSeconds: duration,
        })
      });
    } catch (error) {
      console.error("Error saving time:", error);
    }
  };

  // Save Pricing Settings when user changes them
  const savePricing = async () => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        hourlyRate: Number(hourlyRate),
        materialCost: Number(materialCost)
      });
      setShowSettings(false);
      alert("Pricing updated!");
    } catch (error) {
      console.error("Error saving pricing:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="card p-6 mb-8">
      {/* Header & Settings Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 font-display">Project Timer & Pricing</h3>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
        >
          {showSettings ? 'Close Settings' : 'Edit Pricing Rules'}
        </button>
      </div>

      {/* PRICING INPUTS */}
      {showSettings && (
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl mb-6 border border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">Hourly Rate ($)</label>
              <input 
                type="number" 
                value={hourlyRate || ''}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1">Materials ($)</label>
              <input 
                type="number" 
                value={materialCost || ''}
                onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
              />
            </div>
          </div>
          <button 
            onClick={savePricing}
            className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors"
          >
            Save Pricing Rules
          </button>
        </div>
      )}

      {/* MAIN DISPLAY */}
      <div className="flex flex-col items-center">
        
        {/* DOLLAR VALUE DISPLAY */}
        <div className="text-center mb-6">
          <span className="text-sm text-neutral-500 font-medium">Estimated Value</span>
          <div className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
            ${totalValue.toFixed(2)}
          </div>
          <div className="mt-1 flex gap-2 text-xs text-neutral-500">
            <span>Time: ${timeValue.toFixed(2)}</span>
            <span>+ Materials: ${materialCost.toFixed(2)}</span>
          </div>
        </div>

        {/* TIME DISPLAY */}
        <div className="text-2xl font-mono mb-6 dark:text-white">
          {formatTime(currentTotalSeconds)}
        </div>

        {/* CONTROLS */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Start Working
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              Stop & Save
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}