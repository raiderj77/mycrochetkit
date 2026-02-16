import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Plus,
  Minus,
  RotateCcw,
  ChevronDown,
  Settings,
  X,
} from 'lucide-react';

const LS_KEY = 'mycrochetkit-quick-counter';

interface QuickCounterState {
  name: string;
  count: number;
  target: number | null;
  increment: number;
}

const DEFAULT_STATE: QuickCounterState = {
  name: 'Quick Counter',
  count: 0,
  target: null,
  increment: 1,
};

function loadState(): QuickCounterState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}

function saveState(state: QuickCounterState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export function QuickCounterPage() {
  const [state, setState] = useState<QuickCounterState>(loadState);
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [lastAction, setLastAction] = useState<{ type: string; value: number } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [customIncrementInput, setCustomIncrementInput] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const stateRef = useRef(state);
  const lastProcessedRef = useRef<number>(0);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Persist to localStorage on every change
  useEffect(() => { saveState(state); }, [state]);

  const update = useCallback((delta: number) => {
    setState((prev) => ({ ...prev, count: Math.max(0, prev.count + delta) }));
    setLastAction({ type: delta > 0 ? 'up' : 'down', value: delta });
    setTimeout(() => setLastAction(null), 600);
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({ ...prev, count: 0 }));
    setLastAction({ type: 'reset', value: 0 });
    setTimeout(() => setLastAction(null), 600);
  }, []);

  const setupRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (!result.isFinal) return;
      const now = Date.now();
      let transcript = result[0].transcript.toLowerCase().trim();
      if (transcript === lastTranscriptRef.current && now - lastProcessedRef.current < 1000) return;
      if (now - lastProcessedRef.current < 500) return;
      lastProcessedRef.current = now;
      lastTranscriptRef.current = transcript;
      setLastHeard(transcript);

      const wordToNum: Record<string, number> = {
        one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
        eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
      };
      Object.entries(wordToNum).forEach(([word, num]) => {
        transcript = transcript.replace(new RegExp(`\\b${word}\\b`, 'g'), num.toString());
      });

      const inc = stateRef.current.increment;

      if (['stop', 'stop listening', 'pause', 'quit'].includes(transcript)) {
        stopListening();
        return;
      }
      if (['next', 'up', 'plus', 'add', '1', 'plus 1', 'add 1', 'next row', 'row'].includes(transcript)) {
        update(inc);
        return;
      }
      if (['back', 'down', 'minus', 'undo', 'oops', 'minus 1', 'subtract', 'subtract 1', 'go back', 'previous'].includes(transcript)) {
        update(-inc);
        return;
      }
      if (['reset', 'zero', 'start over', 'clear'].includes(transcript)) {
        reset();
        return;
      }
      const addMatch = transcript.match(/^(?:add|plus|up)\s+(\d+)$/);
      if (addMatch) {
        const num = parseInt(addMatch[1], 10);
        if (num > 0 && num <= 100) update(num);
        return;
      }
      const subtractMatch = transcript.match(/^(?:minus|subtract|back|down)\s+(\d+)$/);
      if (subtractMatch) {
        const num = parseInt(subtractMatch[1], 10);
        if (num > 0 && num <= 100) update(-num);
        return;
      }
      const setMatch = transcript.match(/^(?:set|set to|go to|jump to)\s+(\d+)$/);
      if (setMatch) {
        const num = parseInt(setMatch[1], 10);
        if (num >= 0 && num <= 9999) {
          setState((prev) => ({ ...prev, count: num }));
          setLastAction({ type: 'set', value: num });
          setTimeout(() => setLastAction(null), 600);
        }
        return;
      }
      const justNumber = transcript.match(/^(\d+)$/);
      if (justNumber) {
        const num = parseInt(justNumber[1], 10);
        if (num > 0 && num <= 100) update(num);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        setTimeout(() => {
          try { recognitionRef.current?.start(); } catch { /* */ }
        }, 100);
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted')
        console.error('Speech error:', event.error);
      if (isListeningRef.current && event.error !== 'aborted') {
        setTimeout(() => {
          try { recognitionRef.current?.start(); } catch { /* */ }
        }, 500);
      }
    };
    return recognition;
  }, [update, reset]);

  const startListening = () => {
    if (isListening) return;
    const recognition = setupRecognition();
    if (!recognition) {
      alert('Voice recognition not supported. Please use Chrome, Edge, or Safari.');
      return;
    }
    recognitionRef.current = recognition;
    setIsListening(true);
    lastProcessedRef.current = 0;
    lastTranscriptRef.current = '';
    try { recognition.start(); } catch { /* */ }
  };

  const stopListening = () => {
    setIsListening(false);
    try { recognitionRef.current?.stop(); } catch { /* */ }
  };

  useEffect(() => {
    return () => { try { recognitionRef.current?.stop(); } catch { /* */ } };
  }, []);

  const targetReached = state.target !== null && state.count >= state.target;

  return (
    <div className="counter-light min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#3D352E] hover:text-[#3D352E] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <h1 className="display-font text-lg text-[#3D352E] truncate max-w-[50%]">
          {editingName ? (
            <input
              type="text"
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              onBlur={() => {
                if (editNameValue.trim()) setState((p) => ({ ...p, name: editNameValue.trim() }));
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (editNameValue.trim()) setState((p) => ({ ...p, name: editNameValue.trim() }));
                  setEditingName(false);
                }
                if (e.key === 'Escape') setEditingName(false);
              }}
              className="bg-transparent border-b border-white/50 text-[#3D352E] text-lg outline-none text-center w-full"
              autoFocus
            />
          ) : (
            <span
              onClick={() => { setEditNameValue(state.name); setEditingName(true); }}
              className="cursor-pointer"
              title="Tap to rename"
            >
              {state.name}
            </span>
          )}
        </h1>
        <div className="w-20" />
      </header>

      {/* Settings Toggle */}
      <div className="flex justify-center mb-4">
        <motion.button
          onClick={() => setShowSettings(!showSettings)}
          className="light-card px-4 py-2 text-sm text-[#746454] hover:text-[#3D352E] flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4" />
          Settings
        </motion.button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="light-card p-5 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#3D352E] text-sm font-medium">Counter Settings</p>
              <motion.button onClick={() => setShowSettings(false)} className="text-[#746454] hover:text-[#3D352E]" whileTap={{ scale: 0.95 }}>
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Target */}
            <p className="text-[#746454] text-xs uppercase tracking-wider mb-2">Target (optional)</p>
            <input
              type="number"
              min={0}
              value={state.target ?? ''}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : null;
                setState((p) => ({ ...p, target: val && val > 0 ? val : null }));
              }}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 bg-[#FAF0E4] border border-[#EDE8E3] rounded-xl text-[#3D352E] placeholder-[#3D352E]/40 text-sm focus:outline-none focus:border-[#E86A58]/50 mb-4"
            />

            {/* Increment */}
            <p className="text-[#746454] text-xs uppercase tracking-wider mb-2">Increment</p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 5, 10].map((n) => (
                <motion.button
                  key={n}
                  onClick={() => setState((p) => ({ ...p, increment: n }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    state.increment === n
                      ? 'bg-[#E86A58] text-[#3D352E]'
                      : 'bg-[#FAF0E4] border border-[#EDE8E3] text-[#3D352E] hover:bg-[#FAF0E4]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  +{n}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={customIncrementInput}
                onChange={(e) => setCustomIncrementInput(e.target.value)}
                placeholder="Custom..."
                className="flex-1 px-4 py-2.5 bg-[#FAF0E4] border border-[#EDE8E3] rounded-xl text-[#3D352E] placeholder-[#3D352E]/40 text-sm focus:outline-none focus:border-[#E86A58]/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(customIncrementInput, 10);
                    if (val > 0) { setState((p) => ({ ...p, increment: Math.min(100, val) })); setCustomIncrementInput(''); }
                  }
                }}
              />
              <motion.button
                onClick={() => {
                  const val = parseInt(customIncrementInput, 10);
                  if (val > 0) { setState((p) => ({ ...p, increment: Math.min(100, val) })); setCustomIncrementInput(''); }
                }}
                className="px-4 py-2.5 bg-[#E86A58] text-[#3D352E] text-sm font-medium rounded-xl"
                whileTap={{ scale: 0.95 }}
              >
                Set
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Counter Display */}
      <div className="text-center mb-8">
        <motion.div
          className={`counter-display ${targetReached ? '!text-[#7FBFA0]' : ''}`}
          key={state.count}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {state.target ? `${state.count} / ${state.target}` : state.count}
        </motion.div>
        {targetReached && (
          <motion.p
            className="text-[#7FBFA0] text-sm font-medium mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Target reached!
          </motion.p>
        )}
        {state.increment > 1 && (
          <p className="text-[#3D352E]/40 text-sm mt-2">Increment: +{state.increment}</p>
        )}
        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 text-lg font-semibold ${lastAction.type === 'up' ? 'text-[#7FBFA0]' : lastAction.type === 'down' ? 'text-[#B8A9C9]' : 'text-[#E86A58]'}`}
            >
              {lastAction.type === 'up' && `↑ +${lastAction.value}`}
              {lastAction.type === 'down' && `↓ ${lastAction.value}`}
              {lastAction.type === 'reset' && '↺ Reset'}
              {lastAction.type === 'set' && `→ Set to ${lastAction.value}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voice Status */}
      <div className="text-center mb-8">
        <motion.div
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium ${isListening ? 'bg-[#E86A58]/20 border-2 border-[#E86A58] text-[#E86A58]' : 'light-card text-[#3D352E]'}`}
          animate={isListening ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isListening ? (
            <>
              <div className="sound-wave"><span /><span /><span /><span /><span /></div> Listening...
            </>
          ) : (
            <><MicOff className="w-4 h-4" /> Tap mic to start</>
          )}
        </motion.div>
        {lastHeard && (
          <motion.p className="text-[#746454] text-sm mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Heard: "{lastHeard}"
          </motion.p>
        )}
      </div>

      {/* Voice Button */}
      <div className="flex justify-center mb-10">
        <motion.button
          onClick={isListening ? stopListening : startListening}
          className={`voice-button ${isListening ? 'listening' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isListening ? <MicOff className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
        </motion.button>
      </div>

      {/* Manual Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button onClick={() => update(-state.increment)} className="control-button" whileTap={{ scale: 0.9 }}>
          <Minus className="w-6 h-6" />
        </motion.button>
        <motion.button onClick={reset} className="control-button" whileTap={{ scale: 0.9 }}>
          <RotateCcw className="w-5 h-5" />
        </motion.button>
        <motion.button onClick={() => update(state.increment)} className="control-button" whileTap={{ scale: 0.9 }}>
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* New Counter */}
      <div className="text-center mb-8">
        <motion.button
          onClick={() => setState({ ...DEFAULT_STATE })}
          className="text-[#746454] text-sm hover:text-[#3D352E] transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          Start New Counter
        </motion.button>
      </div>

      {/* Help Section */}
      <motion.div className="light-card overflow-hidden">
        <motion.button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full p-4 flex items-center justify-between text-[#746454] hover:text-[#3D352E] transition-colors"
          whileTap={{ scale: 0.99 }}
        >
          <span className="flex items-center gap-2 text-sm font-medium">Voice Commands</span>
          <motion.span animate={{ rotate: showHelp ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </motion.button>
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[#EDE8E3]"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#7FBFA0]/10 flex items-center justify-center">
                      <span className="text-[#7FBFA0] font-bold">+{state.increment}</span>
                    </div>
                    <p className="text-[#3D352E] text-xs">"next"</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#B8A9C9]/10 flex items-center justify-center">
                      <span className="text-[#B8A9C9] font-bold">-{state.increment}</span>
                    </div>
                    <p className="text-[#3D352E] text-xs">"back"</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#E86A58]/10 flex items-center justify-center">
                      <span className="text-[#E86A58] font-bold">0</span>
                    </div>
                    <p className="text-[#3D352E] text-xs">"reset"</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#FAF0E4] flex items-center justify-center">
                      <span className="text-[#3D352E] font-bold">⏹</span>
                    </div>
                    <p className="text-[#3D352E] text-xs">"stop"</p>
                  </div>
                </div>
                <div className="border-t border-[#EDE8E3] pt-4">
                  <p className="text-[#746454] text-xs uppercase tracking-wider mb-3">Advanced</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#FAF0E4] rounded-lg p-3">
                      <span className="text-[#7FBFA0]">"add 5"</span>
                      <span className="text-[#746454] ml-2">→ +5</span>
                    </div>
                    <div className="bg-[#FAF0E4] rounded-lg p-3">
                      <span className="text-[#B8A9C9]">"minus 3"</span>
                      <span className="text-[#746454] ml-2">→ -3</span>
                    </div>
                    <div className="bg-[#FAF0E4] rounded-lg p-3">
                      <span className="text-[#E86A58]">"set 47"</span>
                      <span className="text-[#746454] ml-2">→ jump to 47</span>
                    </div>
                    <div className="bg-[#FAF0E4] rounded-lg p-3">
                      <span className="text-[#3D352E]">"undo"</span>
                      <span className="text-[#746454] ml-2">→ go back</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
