/**
 * Voice Control Button Component
 * 
 * Microphone toggle with listening animation and transcript display
 */

import { Mic, MicOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVoiceControl } from '@/hooks/useVoiceControl';

interface VoiceControlButtonProps {
  onCommand: (command: { command: string; transcript: string }) => void;
}

export function VoiceControlButton({ onCommand }: VoiceControlButtonProps) {
  const { isListening, transcript, error, startListening, stopListening, isSupported } = 
    useVoiceControl({ onCommand, continuous: true });
  
  // Don't render if browser doesn't support speech recognition
  if (!isSupported) {
    return null;
  }
  
  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-4">
      <div className="flex flex-col items-end gap-2">
        {/* Transcript Display */}
        {transcript && (
          <div className="max-w-xs rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
            "{transcript}"
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="max-w-xs rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800 shadow-lg dark:bg-red-900/30 dark:text-red-200">
            {error}
          </div>
        )}
        
        {/* Microphone Button - FIXED: 44px minimum tap target (WCAG) */}
        <button
          onClick={handleToggle}
          className={`
            tap-target relative
            h-[56px] w-[56px]
            sm:h-14 sm:w-14
            rounded-full
            shadow-lg
            transition-all
            flex items-center justify-center
            ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }
          `}
          aria-label={isListening ? 'Stop voice control' : 'Start voice control'}
          title={isListening ? 'Stop voice control' : 'Start voice control'}
        >
          {isListening ? (
            <>
              <MicOff className="h-6 w-6 sm:h-6 sm:w-6" />
              {/* Pulsing animation */}
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-400 opacity-75" />
            </>
          ) : (
            <Mic className="h-6 w-6 sm:h-6 sm:w-6" />
          )}
        </button>
        
        {/* Help Text */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          {isListening ? (
            <span className="text-red-600 dark:text-red-400 font-bold animate-pulse">Listening...</span>
          ) : (
            <>
              Voice Commands
              <Link 
                to="/voice-help" 
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                title="View Voice Command Guide"
              >
                ?
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
