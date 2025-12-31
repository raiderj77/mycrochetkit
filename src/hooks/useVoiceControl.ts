/**
 * Voice Control Hook
 * 
 * Provides voice recognition for hands-free counter operation
 * Uses Web Speech API (Chrome/Edge only)
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Type declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Browser compatibility check
const SpeechRecognition = 
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null;

export const hasSpeechRecognition = !!SpeechRecognition;

interface VoiceCommand {
  command: 'increment' | 'decrement' | 'undo' | 'reset' | 'stop';
  transcript: string;
  counterType?: 'row' | 'stitch' | 'repeat' | 'custom';
}

interface UseVoiceControlOptions {
  onCommand: (command: VoiceCommand) => void;
  continuous?: boolean;
  language?: string;
}

export function useVoiceControl({
  onCommand,
  continuous = true,
  language = 'en-US',
}: UseVoiceControlOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Store onCommand in a ref so it's always the latest version
  const onCommandRef = useRef(onCommand);
  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);
  
  // Command patterns (case-insensitive) - defined outside useCallback
  const commandPatterns = useRef({
    increment: /\b(next|increase|plus|up|add one|one more)\b/i,
    decrement: /\b(back|decrease|minus|down|subtract|reduce)\b/i,
    undo: /\b(undo|oops|mistake|go back|revert)\b/i,
    reset: /\b(reset|restart|clear|start over|zero)\b/i,
    stop: /\b(stop|stop listening|pause|off)\b/i,
  });
  
  // Counter type patterns
  const counterTypePatterns = useRef({
    row: /\b(row|rows)\b/i,
    stitch: /\b(stitch|stitches)\b/i,
    repeat: /\b(repeat|repeats)\b/i,
    custom: /\b(custom|counter)\b/i,
  });
  
  const parseCommand = useCallback((text: string): VoiceCommand | null => {
    const lowerText = text.toLowerCase();
    
    // Find the command
    let detectedCommand: VoiceCommand['command'] | null = null;
    for (const [command, pattern] of Object.entries(commandPatterns.current)) {
      if (pattern.test(lowerText)) {
        detectedCommand = command as VoiceCommand['command'];
        break;
      }
    }
    
    if (!detectedCommand) return null;
    
    // Find the counter type (optional)
    let detectedCounterType: VoiceCommand['counterType'] | undefined;
    for (const [type, pattern] of Object.entries(counterTypePatterns.current)) {
      if (pattern.test(lowerText)) {
        detectedCounterType = type as VoiceCommand['counterType'];
        break;
      }
    }
    
    return {
      command: detectedCommand,
      transcript: text,
      counterType: detectedCounterType,
    };
  }, []);
  
  // Define stopListening BEFORE startListening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      setTranscript('');
    }
  }, []);
  
  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('Voice recognition started');
      };
      
      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // Ignore no-speech errors (common and expected)
          return;
        }
        
        if (event.error === 'not-allowed') {
          setError('Microphone permission denied');
          setIsListening(false);
        } else if (event.error !== 'aborted') {
          setError(`Error: ${event.error}`);
        }
      };
      
      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const result = event.results[last];
        const transcriptText = result[0].transcript;
        
        console.log('Recognized:', transcriptText, 'Final:', result.isFinal);
        setTranscript(transcriptText);
        
        // Only process final results
        if (result.isFinal) {
          const command = parseCommand(transcriptText);
          
          if (command) {
            console.log('Command detected:', command);
            onCommandRef.current(command);  // Use ref to get latest onCommand
            
            // Stop listening if stop command
            if (command.command === 'stop') {
              stopListening();
            }
          }
          
          // Clear transcript after processing
          setTimeout(() => setTranscript(''), 2000);
        }
      };
      
      recognitionRef.current = recognition;
    }
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.log('Recognition already started or error:', err);
    }
  }, [continuous, language, parseCommand, stopListening]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: hasSpeechRecognition,
  };
}
