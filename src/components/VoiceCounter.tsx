import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth } from '../firebase';
import {
  saveProjectLocal,
  getProjectLocal,
  addPendingSync,
  getPendingSyncs,
  clearPendingSync,
  markProjectSynced,
  isOnline,
} from '../lib/offlineDb';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  FileText,
  Wifi,
  WifiOff,
  Check,
  Loader2,
  X,
  ChevronDown,
  BookOpen,
  Unlink,
  Settings,
} from 'lucide-react';
import { getPattern, linkPatternToProject, unlinkPatternFromProject } from '../services/patternService';
import { PatternPicker } from './PatternPicker';
import type { Pattern } from '../types/pattern';

interface Counter {
  id: string;
  name: string;
  count: number;
  increment: number;
  type: 'row' | 'stitch';
  target: number | null;
}

const DEFAULT_COUNTER: Counter = {
  id: '1',
  name: 'Row',
  count: 0,
  increment: 1,
  type: 'row',
  target: null,
};

// Backward compat: fill missing fields for counters from old data
const normalizeCounter = (c: Record<string, unknown>): Counter => ({
  id: (c.id as string) ?? '1',
  name: (c.name as string) ?? 'Row',
  count: (c.count as number) ?? 0,
  increment: (c.increment as number) ?? 1,
  type: (c.type as 'row' | 'stitch') ?? 'row',
  target: (c.target as number | null) ?? null,
});

interface VoiceCounterProps {
  projectId?: string;
}

export function VoiceCounter({ projectId = 'default' }: VoiceCounterProps) {
  const [user, setUser] = useState<User | null>(null);
  const [projectName, setProjectName] = useState('My Project');
  const [counters, setCounters] = useState<Counter[]>([{ ...DEFAULT_COUNTER }]);
  const [activeId, setActiveId] = useState('1');
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [newCounterName, setNewCounterName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [, setPendingChanges] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [lastAction, setLastAction] = useState<{ type: string; value: number } | null>(null);
  const [linkedPatternId, setLinkedPatternId] = useState<string | null>(null);
  const [linkedPattern, setLinkedPattern] = useState<Pattern | null>(null);
  const [showPatternPicker, setShowPatternPicker] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [customIncrementInput, setCustomIncrementInput] = useState('');
  const [newCounterType, setNewCounterType] = useState<'row' | 'stitch'>('row');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const activeIdRef = useRef(activeId);
  const countersRef = useRef(counters);
  const lastProcessedRef = useRef<number>(0);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);
  useEffect(() => {
    countersRef.current = counters;
  }, [counters]);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      syncPendingChanges();
    };
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- syncPendingChanges is stable (empty deps useCallback)
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (!isOnline()) return;
    const pending = await getPendingSyncs();
    for (const item of pending) {
      try {
        const [userId, projId] = item.id.split('_');
        await setDoc(
          doc(db, 'users', userId, 'projects', projId),
          {
            counters: item.data.counters,
            activeId: item.data.activeId,
            notes: item.data.notes || '',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        await clearPendingSync(item.id);
        await markProjectSynced(userId, projId);
        setPendingChanges(false);
      } catch (error) {
        console.error('Error syncing:', error);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadCounters = async () => {
      try {
        const localData = await getProjectLocal(user.uid, projectId);
        if (localData) {
          setCounters(localData.counters.map(normalizeCounter));
          setActiveId(localData.activeId);
          setPendingChanges(!localData.synced);
        }
        if (isOnline()) {
          const docSnap = await getDoc(doc(db, 'users', user.uid, 'projects', projectId));
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            setProjectName(cloudData.name || 'My Project');
            setNotes(cloudData.notes || '');
            if (cloudData.patternId) {
              setLinkedPatternId(cloudData.patternId);
            }
            if (cloudData.counters?.length > 0) {
              const cloudTime = new Date(cloudData.updatedAt).getTime();
              const localTime = localData ? new Date(localData.updatedAt).getTime() : 0;
              if (cloudTime > localTime) {
                setCounters(cloudData.counters.map(normalizeCounter));
                setActiveId(cloudData.activeId || cloudData.counters[0].id);
                await saveProjectLocal(
                  user.uid,
                  projectId,
                  cloudData.counters,
                  cloudData.activeId,
                  true
                );
              }
            }
          } else if (!localData) {
            setCounters([{ ...DEFAULT_COUNTER }]);
            setActiveId('1');
          }
          syncPendingChanges();
        }
      } catch (error) {
        console.error('Error loading counters:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCounters();
  }, [user, projectId, syncPendingChanges]);

  useEffect(() => {
    if (!user || !linkedPatternId) {
      setLinkedPattern(null);
      return;
    }
    getPattern(user.uid, linkedPatternId)
      .then((p) => setLinkedPattern(p))
      .catch(() => setLinkedPattern(null));
  }, [user, linkedPatternId]);

  useEffect(() => {
    if (!user || loading) return;
    const saveCounters = async () => {
      setSaving(true);
      try {
        await saveProjectLocal(user.uid, projectId, counters, activeId, false);
        if (isOnline()) {
          await setDoc(
            doc(db, 'users', user.uid, 'projects', projectId),
            { counters, activeId, notes, updatedAt: new Date().toISOString() },
            { merge: true }
          );
          await markProjectSynced(user.uid, projectId);
          setPendingChanges(false);
        } else {
          await addPendingSync(user.uid, projectId, counters, activeId);
          setPendingChanges(true);
        }
      } catch (error) {
        console.error('Error saving:', error);
        await addPendingSync(user.uid, projectId, counters, activeId);
        setPendingChanges(true);
      } finally {
        setSaving(false);
      }
    };
    const timeout = setTimeout(saveCounters, 500);
    return () => clearTimeout(timeout);
  }, [counters, activeId, notes, user, loading, projectId]);

  const activeCounter = counters.find((c) => c.id === activeId) || counters[0];

  const updateCount = (id: string, delta: number) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c))
    );
    setLastAction({ type: delta > 0 ? 'up' : 'down', value: delta });
    setTimeout(() => setLastAction(null), 600);
  };

  const resetCount = (id: string) => {
    setCounters((prev) => prev.map((c) => (c.id === id ? { ...c, count: 0 } : c)));
    setLastAction({ type: 'reset', value: 0 });
    setTimeout(() => setLastAction(null), 600);
  };

  const addCounter = () => {
    if (!newCounterName.trim()) return;
    const newId = Date.now().toString();
    setCounters((prev) => [
      ...prev,
      { id: newId, name: newCounterName.trim(), count: 0, increment: 1, type: newCounterType, target: null },
    ]);
    setNewCounterName('');
    setNewCounterType('row');
    setShowAddForm(false);
    setActiveId(newId);
  };

  const startRename = (counter: Counter) => {
    setEditingNameId(counter.id);
    setEditingNameValue(counter.name);
  };

  const saveRename = () => {
    if (!editingNameId) return;
    const trimmed = editingNameValue.trim();
    if (trimmed) {
      setCounters((prev) =>
        prev.map((c) => (c.id === editingNameId ? { ...c, name: trimmed } : c))
      );
    }
    setEditingNameId(null);
  };

  const cancelRename = () => {
    setEditingNameId(null);
  };

  const setCounterIncrement = (id: string, inc: number) => {
    const val = Math.max(1, Math.min(100, inc));
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, increment: val } : c))
    );
  };

  const setCounterTarget = (id: string, target: number | null) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, target } : c))
    );
  };

  const setCounterType = (id: string, type: 'row' | 'stitch') => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, type } : c))
    );
  };

  const removeCounter = (id: string) => {
    if (counters.length <= 1) return;
    const newCounters = counters.filter((c) => c.id !== id);
    setCounters(newCounters);
    if (activeId === id) setActiveId(newCounters[0].id);
  };

  const saveNotes = () => {
    setNotes(tempNotes);
    setEditingNotes(false);
  };

  const setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
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
      const currentActiveId = activeIdRef.current;

      // Convert spoken numbers to digits
      const wordToNum: Record<string, number> = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
        thirteen: 13,
        fourteen: 14,
        fifteen: 15,
        sixteen: 16,
        seventeen: 17,
        eighteen: 18,
        nineteen: 19,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50,
      };

      // Replace word numbers with digits in transcript
      Object.entries(wordToNum).forEach(([word, num]) => {
        transcript = transcript.replace(new RegExp(`\\b${word}\\b`, 'g'), num.toString());
      });

      // Stop/pause commands
      if (['stop', 'stop listening', 'pause', 'quit'].includes(transcript)) {
        stopListening();
        return;
      }

      // Get the active counter's configured increment
      const activeInc = countersRef.current.find((c) => c.id === currentActiveId)?.increment ?? 1;

      // Increment commands — use configured increment
      if (
        ['next', 'up', 'plus', 'add', '1', 'plus 1', 'add 1', 'next row', 'row'].includes(
          transcript
        )
      ) {
        updateCount(currentActiveId, activeInc);
        return;
      }

      // Decrement commands — use configured increment
      if (
        [
          'back',
          'down',
          'minus',
          'undo',
          'oops',
          'minus 1',
          'subtract',
          'subtract 1',
          'go back',
          'previous',
        ].includes(transcript)
      ) {
        updateCount(currentActiveId, -activeInc);
        return;
      }

      // Reset commands
      if (['reset', 'zero', 'start over', 'clear'].includes(transcript)) {
        resetCount(currentActiveId);
        return;
      }

      // Number commands: "add 5", "plus 10", "minus 3", etc.
      const addMatch = transcript.match(/^(?:add|plus|up)\s+(\d+)$/);
      if (addMatch) {
        const num = parseInt(addMatch[1], 10);
        if (num > 0 && num <= 100) updateCount(currentActiveId, num);
        return;
      }

      const subtractMatch = transcript.match(/^(?:minus|subtract|back|down)\s+(\d+)$/);
      if (subtractMatch) {
        const num = parseInt(subtractMatch[1], 10);
        if (num > 0 && num <= 100) updateCount(currentActiveId, -num);
        return;
      }

      // Set to specific number: "set 47", "go to 50"
      const setMatch = transcript.match(/^(?:set|set to|go to|jump to)\s+(\d+)$/);
      if (setMatch) {
        const num = parseInt(setMatch[1], 10);
        if (num >= 0 && num <= 9999) {
          setCounters((prev) =>
            prev.map((c) => (c.id === currentActiveId ? { ...c, count: num } : c))
          );
          setLastAction({ type: 'set', value: num });
          setTimeout(() => setLastAction(null), 600);
        }
        return;
      }

      // Just a number by itself: "5" adds 5
      const justNumber = transcript.match(/^(\d+)$/);
      if (justNumber) {
        const num = parseInt(justNumber[1], 10);
        if (num > 0 && num <= 100) updateCount(currentActiveId, num);
        return;
      }
    };
    recognition.onend = () => {
      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {
            // If start fails, create a new recognition instance
            const newRecognition = setupRecognition();
            if (newRecognition) {
              recognitionRef.current = newRecognition;
              try {
                newRecognition.start();
              } catch {
                /* speech API unavailable */
              }
            }
          }
        }, 100);
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted')
        console.error('Speech error:', event.error);
      // On error, try to restart if we should still be listening
      if (isListeningRef.current && event.error !== 'aborted') {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {
            /* speech API unavailable */
          }
        }, 500);
      }
    };
    return recognition;
  };

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
    try {
      recognition.start();
    } catch {
      /* speech API unavailable */
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current)
      try {
        recognitionRef.current.stop();
      } catch {
        /* already stopped */
      }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current)
        try {
          recognitionRef.current.stop();
        } catch {
          /* already stopped */
        }
    };
  }, []);

  if (loading) {
    return (
      <div className="counter-background min-h-screen flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#E86A58] to-[#B8A9C9] flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">🧶</span>
          </motion.div>
          <p className="text-white/70 text-lg">Loading project...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="counter-background min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="glass-card p-10 text-center max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/10 flex items-center justify-center">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="display-font text-2xl text-white mb-4">Sign in to continue</h2>
          <p className="text-white/60 mb-8">Your counters will be saved automatically.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Go to Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="counter-background min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <h1 className="display-font text-lg text-white truncate max-w-[40%]">{projectName}</h1>
        <div className="flex items-center gap-4 text-xs">
          <span
            className={`flex items-center gap-1.5 ${online ? 'text-[#7FBFA0]' : 'text-[#B8A9C9]'}`}
          >
            {online ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{online ? 'Online' : 'Offline'}</span>
          </span>
          <span className="text-white/65 flex items-center gap-1.5">
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Saved
              </>
            )}
          </span>
        </div>
      </header>

      {/* Offline Banner */}
      <AnimatePresence>
        {!online && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-3 mb-4 flex items-center justify-center gap-2 text-sm text-[#B8A9C9]"
          >
            <WifiOff className="w-4 h-4" /> Offline — changes sync when reconnected
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Button */}
      <motion.button
        onClick={() => {
          setShowNotes(!showNotes);
          setTempNotes(notes);
        }}
        className="w-full mb-4 py-3 glass-card text-sm text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
        whileTap={{ scale: 0.99 }}
      >
        <FileText className="w-4 h-4" />
        {notes ? 'View Notes' : 'Add Notes'}
        {notes && <span className="w-2 h-2 bg-[#E86A58] rounded-full" />}
      </motion.button>

      {/* Notes Panel */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            className="glass-card p-5 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {editingNotes ? (
              <>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:border-[#E86A58]/50"
                  maxLength={500}
                  autoFocus
                />
                <div className="flex gap-3 mt-4">
                  <motion.button
                    onClick={saveNotes}
                    className="btn-primary flex-1 !py-3"
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Notes
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingNotes(false)}
                    className="px-5 py-3 bg-white/5 border border-white/10 rounded-full text-white/70"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white/70 text-sm whitespace-pre-wrap min-h-[2rem]">
                  {notes || 'No notes yet.'}
                </p>
                <motion.button
                  onClick={() => {
                    setEditingNotes(true);
                    setTempNotes(notes);
                  }}
                  className="mt-4 text-[#E86A58] text-sm font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  ✏️ Edit Notes
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Linked Pattern Card */}
      {linkedPattern ? (
        <motion.div
          className="glass-card p-4 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{linkedPattern.name}</p>
              <p className="text-white/50 text-xs">
                {linkedPattern.sections.length} section{linkedPattern.sections.length !== 1 ? 's' : ''}
                {' · '}
                {linkedPattern.sections.reduce((sum, s) => sum + s.steps.length, 0)} steps
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/patterns/${linkedPatternId}/track`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#E86A58]/20 border border-[#E86A58]/30 text-[#E86A58] text-sm font-medium rounded-xl hover:bg-[#E86A58]/30 transition-colors"
            >
              Continue Pattern
            </Link>
            <motion.button
              onClick={async () => {
                if (!user) return;
                try {
                  await unlinkPatternFromProject(user.uid, projectId);
                  setLinkedPatternId(null);
                  setLinkedPattern(null);
                } catch (err) {
                  console.error('Failed to unlink pattern:', err);
                }
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 border border-white/10 text-white/60 text-sm rounded-xl hover:text-white/80 hover:border-white/20 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Unlink className="w-3.5 h-3.5" />
              Unlink
            </motion.button>
          </div>
        </motion.div>
      ) : !loading && user && (
        <motion.button
          onClick={() => setShowPatternPicker(true)}
          className="w-full mb-4 py-3 glass-card text-sm text-white/50 hover:text-white/70 transition-colors flex items-center justify-center gap-2"
          whileTap={{ scale: 0.99 }}
        >
          <BookOpen className="w-4 h-4" />
          Link a Pattern
        </motion.button>
      )}

      {/* Pattern Picker Modal */}
      <AnimatePresence>
        {showPatternPicker && user && (
          <PatternPicker
            uid={user.uid}
            onSelect={async (selectedPatternId) => {
              try {
                await linkPatternToProject(user.uid, projectId, selectedPatternId);
                setLinkedPatternId(selectedPatternId);
                setShowPatternPicker(false);
              } catch (err) {
                console.error('Failed to link pattern:', err);
              }
            }}
            onClose={() => setShowPatternPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* Counter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {counters.map((counter) => (
          <motion.button
            key={counter.id}
            onClick={() => setActiveId(counter.id)}
            className={`counter-tab ${activeId === counter.id ? 'active' : ''}`}
            whileTap={{ scale: 0.95 }}
          >
            {editingNameId === counter.id ? (
              <input
                type="text"
                value={editingNameValue}
                onChange={(e) => setEditingNameValue(e.target.value)}
                onBlur={saveRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-b border-white/50 text-white text-sm w-16 outline-none text-center"
                autoFocus
              />
            ) : (
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startRename(counter);
                }}
                title="Double-tap to rename"
              >
                {counter.type === 'stitch' && <span className="text-[#B8A9C9] mr-1">•</span>}
                {counter.name}
              </span>
            )}
            : {counter.count}
            {counter.increment > 1 && (
              <span className="ml-1 text-[10px] text-[#7FBFA0] opacity-70">+{counter.increment}</span>
            )}
          </motion.button>
        ))}
        <motion.button
          onClick={() => setShowSettings(!showSettings)}
          className="counter-tab !border-white/10 !text-white/50 hover:!text-white/80"
          whileTap={{ scale: 0.95 }}
          title="Counter settings"
        >
          <Settings className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="counter-tab !border-dashed !border-white/20 !text-white/65 hover:!border-white/40"
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Increment Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="glass-card p-5 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/70 text-sm font-medium">
                Settings for "{activeCounter.name}"
              </p>
              <motion.button
                onClick={() => setShowSettings(false)}
                className="text-white/50 hover:text-white/80"
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Counter Type */}
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Type</p>
            <div className="flex gap-2 mb-4">
              {(['row', 'stitch'] as const).map((t) => (
                <motion.button
                  key={t}
                  onClick={() => setCounterType(activeId, t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeCounter.type === t
                      ? 'bg-[#E86A58] text-white'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {t === 'row' ? 'Row' : 'Stitch'}
                </motion.button>
              ))}
            </div>

            {/* Target (for stitch counters) */}
            {activeCounter.type === 'stitch' && (
              <div className="mb-4">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Target</p>
                <input
                  type="number"
                  min={0}
                  value={activeCounter.target ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    setCounterTarget(activeId, val && val > 0 ? val : null);
                  }}
                  placeholder="e.g. 18 stitches"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#E86A58]/50"
                />
              </div>
            )}

            {/* Increment */}
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Increment</p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 5, 10].map((n) => (
                <motion.button
                  key={n}
                  onClick={() => setCounterIncrement(activeId, n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeCounter.increment === n
                      ? 'bg-[#E86A58] text-white'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
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
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#E86A58]/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(customIncrementInput, 10);
                    if (val > 0) {
                      setCounterIncrement(activeId, val);
                      setCustomIncrementInput('');
                    }
                  }
                }}
              />
              <motion.button
                onClick={() => {
                  const val = parseInt(customIncrementInput, 10);
                  if (val > 0) {
                    setCounterIncrement(activeId, val);
                    setCustomIncrementInput('');
                  }
                }}
                className="px-4 py-2.5 bg-[#E86A58] text-white text-sm font-medium rounded-xl"
                whileTap={{ scale: 0.95 }}
              >
                Set
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Counter Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="glass-card p-5 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex gap-2 mb-4">
              {(['row', 'stitch'] as const).map((t) => (
                <motion.button
                  key={t}
                  onClick={() => setNewCounterType(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    newCounterType === t
                      ? 'bg-[#E86A58] text-white'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {t === 'row' ? 'Row Counter' : 'Stitch Counter'}
                </motion.button>
              ))}
            </div>
            <input
              type="text"
              value={newCounterName}
              onChange={(e) => setNewCounterName(e.target.value)}
              placeholder={newCounterType === 'stitch' ? 'e.g. Round 3 stitches' : 'Counter name'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 mb-4 focus:outline-none focus:border-[#E86A58]/50"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && addCounter()}
            />
            <div className="flex gap-3">
              <motion.button
                onClick={addCounter}
                className="btn-primary flex-1 !py-3"
                whileTap={{ scale: 0.98 }}
              >
                Add Counter
              </motion.button>
              <motion.button
                onClick={() => setShowAddForm(false)}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/70"
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Counter Display */}
      <div className="text-center mb-8">
        <p className="text-white/70 mb-4 text-lg">
          {activeCounter.name}
          {activeCounter.type === 'stitch' && (
            <span className="ml-2 text-sm text-[#B8A9C9]">(stitch)</span>
          )}
        </p>
        <motion.div
          className={`counter-display ${
            activeCounter.type === 'stitch' && activeCounter.target && activeCounter.count >= activeCounter.target
              ? '!text-[#7FBFA0]'
              : ''
          }`}
          key={activeCounter.count}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {activeCounter.type === 'stitch' && activeCounter.target
            ? `${activeCounter.count} / ${activeCounter.target}`
            : activeCounter.count}
        </motion.div>
        {activeCounter.type === 'stitch' && activeCounter.target && activeCounter.count >= activeCounter.target && (
          <motion.p
            className="text-[#7FBFA0] text-sm font-medium mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Target reached!
          </motion.p>
        )}
        <AnimatePresence>
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 text-lg font-semibold ${lastAction.type === 'up' ? 'text-[#7FBFA0]' : lastAction.type === 'down' ? 'text-[#B8A9C9]' : lastAction.type === 'set' ? 'text-[#E86A58]' : 'text-[#E86A58]'}`}
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
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium ${isListening ? 'bg-[#E86A58]/20 border-2 border-[#E86A58] text-[#E86A58]' : 'glass-card text-white/70'}`}
          animate={isListening ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isListening ? (
            <>
              <div className="sound-wave">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>{' '}
              Listening...
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4" /> Tap mic to start
            </>
          )}
        </motion.div>
        {lastHeard && (
          <motion.p
            className="text-white/60 text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
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
          {isListening ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </motion.button>
      </div>

      {/* Manual Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          onClick={() => updateCount(activeId, -activeCounter.increment)}
          className="control-button"
          whileTap={{ scale: 0.9 }}
        >
          <Minus className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => resetCount(activeId)}
          className="control-button"
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={() => updateCount(activeId, activeCounter.increment)}
          className="control-button"
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Delete Counter */}
      {counters.length > 1 && (
        <div className="text-center mb-8">
          <motion.button
            onClick={() => removeCounter(activeId)}
            className="text-white/60 text-sm hover:text-red-400 transition-colors flex items-center gap-2 mx-auto"
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete "{activeCounter.name}"
          </motion.button>
        </div>
      )}

      {/* Help Section */}
      <motion.div className="glass-card overflow-hidden">
        <motion.button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full p-4 flex items-center justify-between text-white/60 hover:text-white transition-colors"
          whileTap={{ scale: 0.99 }}
        >
          <span className="flex items-center gap-2 text-sm font-medium">🎤 Voice Commands</span>
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
              className="border-t border-white/10"
            >
              <div className="p-6 space-y-6">
                {/* Basic commands */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#7FBFA0]/10 flex items-center justify-center">
                      <span className="text-[#7FBFA0] font-bold">+1</span>
                    </div>
                    <p className="text-white/70 text-xs">"next"</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#B8A9C9]/10 flex items-center justify-center">
                      <span className="text-[#B8A9C9] font-bold">-1</span>
                    </div>
                    <p className="text-white/70 text-xs">"back"</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#E86A58]/10 flex items-center justify-center">
                      <span className="text-[#E86A58] font-bold">0</span>
                    </div>
                    <p className="text-white/70 text-xs">"reset"</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/10 flex items-center justify-center">
                      <span className="text-white/70 font-bold">⏹</span>
                    </div>
                    <p className="text-white/70 text-xs">"stop"</p>
                  </div>
                </div>

                {/* Advanced commands */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/65 text-xs uppercase tracking-wider mb-3">Advanced</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-[#7FBFA0]">"add 5"</span>
                      <span className="text-white/65 ml-2">→ +5</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-[#B8A9C9]">"minus 3"</span>
                      <span className="text-white/65 ml-2">→ -3</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-[#E86A58]">"set 47"</span>
                      <span className="text-white/65 ml-2">→ jump to 47</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <span className="text-white/70">"undo"</span>
                      <span className="text-white/65 ml-2">→ go back 1</span>
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
