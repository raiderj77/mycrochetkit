import { useState, useEffect, useRef, useCallback } from 'react';
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
  isOnline 
} from '../lib/offlineDb';

interface Counter {
  id: string;
  name: string;
  count: number;
}

interface VoiceCounterProps {
  projectId?: string;
}

export function VoiceCounter({ projectId = 'default' }: VoiceCounterProps) {
  const [user, setUser] = useState<User | null>(null);
  const [projectName, setProjectName] = useState('My Project');
  const [counters, setCounters] = useState<Counter[]>([
    { id: '1', name: 'Row', count: 0 }
  ]);
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
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const activeIdRef = useRef(activeId);
  const lastProcessedRef = useRef<number>(0);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

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
  }, []);

  const syncPendingChanges = useCallback(async () => {
    if (!isOnline()) return;
    
    const pending = await getPendingSyncs();
    
    for (const item of pending) {
      try {
        const [userId, projId] = item.id.split('_');
        const docRef = doc(db, 'users', userId, 'projects', projId);
        
        await setDoc(docRef, {
          counters: item.data.counters,
          activeId: item.data.activeId,
          notes: item.data.notes || '',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
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
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const loadCounters = async () => {
      try {
        const localData = await getProjectLocal(user.uid, projectId);
        
        if (localData) {
          setCounters(localData.counters);
          setActiveId(localData.activeId);
          setPendingChanges(!localData.synced);
        }
        
        if (isOnline()) {
          const docRef = doc(db, 'users', user.uid, 'projects', projectId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            setProjectName(cloudData.name || 'My Project');
            setNotes(cloudData.notes || '');
            
            if (cloudData.counters && cloudData.counters.length > 0) {
              const cloudTime = new Date(cloudData.updatedAt).getTime();
              const localTime = localData ? new Date(localData.updatedAt).getTime() : 0;
              
              if (cloudTime > localTime) {
                setCounters(cloudData.counters);
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
            setCounters([{ id: '1', name: 'Row', count: 0 }]);
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
    if (!user || loading) return;
    
    const saveCounters = async () => {
      setSaving(true);
      try {
        await saveProjectLocal(user.uid, projectId, counters, activeId, false);
        
        if (isOnline()) {
          const docRef = doc(db, 'users', user.uid, 'projects', projectId);
          await setDoc(docRef, {
            counters,
            activeId,
            notes,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          
          await markProjectSynced(user.uid, projectId);
          setPendingChanges(false);
        } else {
          await addPendingSync(user.uid, projectId, counters, activeId);
          setPendingChanges(true);
        }
      } catch (error) {
        console.error('Error saving counters:', error);
        await addPendingSync(user.uid, projectId, counters, activeId);
        setPendingChanges(true);
      } finally {
        setSaving(false);
      }
    };
    
    const timeout = setTimeout(saveCounters, 500);
    return () => clearTimeout(timeout);
  }, [counters, activeId, notes, user, loading, projectId]);

  const activeCounter = counters.find(c => c.id === activeId) || counters[0];

  const updateCount = (id: string, delta: number) => {
    setCounters(prev => prev.map(c => 
      c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c
    ));
  };

  const resetCount = (id: string) => {
    setCounters(prev => prev.map(c => 
      c.id === id ? { ...c, count: 0 } : c
    ));
  };

  const addCounter = () => {
    if (!newCounterName.trim()) return;
    const newId = Date.now().toString();
    setCounters(prev => [...prev, { id: newId, name: newCounterName.trim(), count: 0 }]);
    setNewCounterName('');
    setShowAddForm(false);
    setActiveId(newId);
  };

  const removeCounter = (id: string) => {
    if (counters.length <= 1) return;
    const newCounters = counters.filter(c => c.id !== id);
    setCounters(newCounters);
    if (activeId === id) {
      setActiveId(newCounters[0].id);
    }
  };

  const saveNotes = () => {
    setNotes(tempNotes);
    setEditingNotes(false);
  };

  const setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!event.results[0].isFinal) return;
      
      const now = Date.now();
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      if (transcript === lastTranscriptRef.current && now - lastProcessedRef.current < 1500) {
        return;
      }
      
      if (now - lastProcessedRef.current < 800) {
        return;
      }
      
      lastProcessedRef.current = now;
      lastTranscriptRef.current = transcript;
      setLastHeard(transcript);
      
      const currentActiveId = activeIdRef.current;
      
      if (transcript === 'next') {
        updateCount(currentActiveId, 1);
      } else if (transcript === 'back') {
        updateCount(currentActiveId, -1);
      } else if (transcript === 'reset') {
        resetCount(currentActiveId);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) { /* ignore */ }
        }, 400);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('Speech error:', event.error);
    };

    return recognition;
  };

  const startListening = () => {
    if (isListening) return;
    const recognition = setupRecognition();
    if (!recognition) {
      alert('Voice recognition not supported. Please use Chrome.');
      return;
    }
    recognitionRef.current = recognition;
    setIsListening(true);
    lastProcessedRef.current = 0;
    lastTranscriptRef.current = '';
    try { recognition.start(); } catch (e) { /* ignore */ }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin"></div>
          <p className="text-white/50">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] text-white p-5 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in to continue</h2>
        <p className="text-white/60 mb-6">Your counters will be saved automatically.</p>
        <a href="/" className="px-6 py-3 bg-[#4ade80] text-[#0f0f1a] font-semibold rounded-full">Go to Sign In</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] p-4 text-white">
      {/* Header */}
      <header className="flex justify-between items-center mb-5">
        <a href="/" className="text-white/50 hover:text-white text-sm">← Back</a>
        <h1 className="text-lg font-semibold truncate max-w-[50%]">{projectName}</h1>
        <div className="text-right text-xs">
          <div className="text-white/50">{saving ? 'Saving...' : 'Saved'}</div>
          <div className={online ? 'text-[#4ade80]' : 'text-yellow-400'}>
            {online ? '● Online' : '● Offline'}
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      {!online && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-4 text-center text-sm">
          📴 Offline mode - changes sync when reconnected
        </div>
      )}

      {/* Notes Toggle */}
      <button
        onClick={() => { setShowNotes(!showNotes); setTempNotes(notes); }}
        className="w-full mb-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 hover:bg-white/10 transition-colors"
      >
        📝 {notes ? 'View Notes' : 'Add Notes'} {notes && '•'}
      </button>

      {/* Notes Panel */}
      {showNotes && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          {editingNotes ? (
            <>
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Add notes... (e.g., decrease every 4th row)"
                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-[#4ade80]/50"
                maxLength={500}
              />
              <div className="flex gap-2 mt-3">
                <button onClick={saveNotes} className="flex-1 py-2 bg-[#4ade80] text-[#0f0f1a] font-semibold rounded-lg">Save</button>
                <button onClick={() => setEditingNotes(false)} className="px-4 py-2 bg-white/10 rounded-lg">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white/70 text-sm whitespace-pre-wrap">{notes || 'No notes yet'}</p>
              <button
                onClick={() => { setEditingNotes(true); setTempNotes(notes); }}
                className="mt-3 text-[#4ade80] text-sm"
              >
                ✏️ Edit Notes
              </button>
            </>
          )}
        </div>
      )}

      {/* Counter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {counters.map(counter => (
          <button
            key={counter.id}
            onClick={() => setActiveId(counter.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeId === counter.id
                ? 'bg-[#4ade80]/20 border-2 border-[#4ade80] text-white'
                : 'bg-white/5 border-2 border-white/10 text-white/70'
            }`}
          >
            {counter.name}: {counter.count}
          </button>
        ))}
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 rounded-full text-sm border-2 border-dashed border-white/20 text-white/50"
        >
          + Add
        </button>
      </div>

      {/* Add Counter Form */}
      {showAddForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
          <input
            type="text"
            value={newCounterName}
            onChange={(e) => setNewCounterName(e.target.value)}
            placeholder="Counter name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 mb-3"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={addCounter} className="flex-1 py-2 bg-[#4ade80] text-[#0f0f1a] font-semibold rounded-lg">Add</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-white/10 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Main Counter Display */}
      <div className="text-center mb-6">
        <p className="text-white/50 mb-2">{activeCounter.name}</p>
        <div className="text-8xl md:text-9xl font-bold">{activeCounter.count}</div>
      </div>

      {/* Voice Status */}
      <div className="text-center mb-6">
        <div className={`inline-block px-6 py-2 rounded-full text-sm ${
          isListening 
            ? 'bg-[#4ade80]/20 border-2 border-[#4ade80] text-[#4ade80]' 
            : 'bg-white/5 border-2 border-white/10 text-white/50'
        }`}>
          {isListening ? '🎤 Listening...' : 'Tap mic to start'}
        </div>
        {lastHeard && <p className="text-white/30 text-sm mt-2">Heard: "{lastHeard}"</p>}
      </div>

      {/* Voice Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-20 h-20 rounded-full text-3xl shadow-lg transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-[#4ade80] hover:bg-[#22c55e]'
          }`}
        >
          {isListening ? '⏹' : '🎤'}
        </button>
      </div>

      {/* Manual Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => updateCount(activeId, -1)}
          className="w-16 h-16 rounded-full bg-white/5 border-2 border-white/10 text-2xl text-white"
        >
          −
        </button>
        <button
          onClick={() => resetCount(activeId)}
          className="w-16 h-16 rounded-full bg-white/5 border-2 border-white/10 text-sm text-white"
        >
          Reset
        </button>
        <button
          onClick={() => updateCount(activeId, 1)}
          className="w-16 h-16 rounded-full bg-white/5 border-2 border-white/10 text-2xl text-white"
        >
          +
        </button>
      </div>

      {/* Delete Counter */}
      {counters.length > 1 && (
        <div className="text-center mb-6">
          <button
            onClick={() => removeCounter(activeId)}
            className="text-white/30 text-sm hover:text-red-400"
          >
            Delete "{activeCounter.name}"
          </button>
        </div>
      )}

      {/* Help */}
      <div className="bg-white/5 rounded-xl p-4 text-center text-sm text-white/50">
        <p><strong>"next"</strong> = count up</p>
        <p><strong>"back"</strong> = count down</p>
        <p><strong>"reset"</strong> = zero</p>
      </div>
    </div>
  );
}
