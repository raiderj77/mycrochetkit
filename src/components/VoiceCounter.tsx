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

export function VoiceCounter() {
  const [user, setUser] = useState<User | null>(null);
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
  const [pendingChanges, setPendingChanges] = useState(false);
  
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
        const [userId, projectId] = item.id.split('_');
        const docRef = doc(db, 'users', userId, 'projects', projectId);
        
        await setDoc(docRef, {
          counters: item.data.counters,
          activeId: item.data.activeId,
          updatedAt: new Date().toISOString()
        });
        
        await clearPendingSync(item.id);
        await markProjectSynced(userId, projectId);
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
        const localData = await getProjectLocal(user.uid, 'default');
        
        if (localData) {
          setCounters(localData.counters);
          setActiveId(localData.activeId);
          setPendingChanges(!localData.synced);
        }
        
        if (isOnline()) {
          const docRef = doc(db, 'users', user.uid, 'projects', 'default');
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data();
            
            if (cloudData.counters && cloudData.counters.length > 0) {
              const cloudTime = new Date(cloudData.updatedAt).getTime();
              const localTime = localData ? new Date(localData.updatedAt).getTime() : 0;
              
              if (cloudTime > localTime) {
                setCounters(cloudData.counters);
                setActiveId(cloudData.activeId || cloudData.counters[0].id);
                await saveProjectLocal(
                  user.uid,
                  'default',
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
  }, [user, syncPendingChanges]);

  useEffect(() => {
    if (!user || loading) return;
    
    const saveCounters = async () => {
      setSaving(true);
      try {
        await saveProjectLocal(user.uid, 'default', counters, activeId, false);
        
        if (isOnline()) {
          const docRef = doc(db, 'users', user.uid, 'projects', 'default');
          await setDoc(docRef, {
            counters,
            activeId,
            updatedAt: new Date().toISOString()
          });
          
          await markProjectSynced(user.uid, 'default');
          setPendingChanges(false);
        } else {
          await addPendingSync(user.uid, 'default', counters, activeId);
          setPendingChanges(true);
        }
      } catch (error) {
        console.error('Error saving counters:', error);
        await addPendingSync(user.uid, 'default', counters, activeId);
        setPendingChanges(true);
      } finally {
        setSaving(false);
      }
    };
    
    const timeout = setTimeout(saveCounters, 500);
    return () => clearTimeout(timeout);
  }, [counters, activeId, user, loading]);

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

  const setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Only process final results
      if (!event.results[0].isFinal) return;
      
      const now = Date.now();
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      // Debounce: ignore if same transcript within 1.5 seconds
      if (transcript === lastTranscriptRef.current && now - lastProcessedRef.current < 1500) {
        return;
      }
      
      // Also ignore if ANY command within 800ms
      if (now - lastProcessedRef.current < 800) {
        return;
      }
      
      lastProcessedRef.current = now;
      lastTranscriptRef.current = transcript;
      setLastHeard(transcript);
      
      const currentActiveId = activeIdRef.current;
      
      // Only respond to exact commands: next, back, reset
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white' }}>
        Loading your counters...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Sign in to save your progress</h2>
        <p style={{ opacity: 0.7, marginBottom: '24px' }}>Your counters will be saved automatically.</p>
        <a href="/" style={{ padding: '12px 24px', background: '#4ade80', color: '#1a1a2e', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>Go to Sign In</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px', color: 'white' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>Back</a>
        <h1 style={{ fontSize: '1.1rem', margin: 0 }}>Voice Counter</h1>
        <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <span style={{ opacity: 0.5 }}>{saving ? 'Saving...' : 'Saved'}</span>
          <span style={{ color: online ? '#4ade80' : '#fbbf24', fontSize: '0.7rem' }}>
            {online ? 'Online' : 'Offline'}{pendingChanges && ' (pending)'}
          </span>
        </div>
      </header>

      {!online && (
        <div style={{ background: 'rgba(251, 191, 36, 0.2)', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '0.85rem', textAlign: 'center' }}>
          You are offline. Changes will sync when you reconnect.
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {counters.map(counter => (
          <button
            key={counter.id}
            onClick={() => setActiveId(counter.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: activeId === counter.id ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.2)',
              background: activeId === counter.id ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {counter.name}: {counter.count}
          </button>
        ))}
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '2px dashed rgba(255,255,255,0.3)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          + Add
        </button>
      </div>

      {showAddForm && (
        <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          <input
            type="text"
            value={newCounterName}
            onChange={(e) => setNewCounterName(e.target.value)}
            placeholder="Counter name (e.g., Pattern Repeat)"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', marginBottom: '12px', fontSize: '1rem', boxSizing: 'border-box' }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addCounter} style={{ flex: 1, padding: '10px', background: '#4ade80', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add Counter</button>
            <button onClick={() => setShowAddForm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '1rem' }}>{activeCounter.name}</p>
        <div style={{ fontSize: 'clamp(100px, 25vw, 180px)', fontWeight: '700', lineHeight: 1 }}>
          {activeCounter.count}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-block',
          padding: '10px 24px',
          borderRadius: '50px',
          background: isListening ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)',
          border: isListening ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.2)'
        }}>
          {isListening ? 'Listening...' : 'Tap to start'}
        </div>
        {lastHeard && <p style={{ marginTop: '8px', opacity: 0.5, fontSize: '0.85rem' }}>Heard: "{lastHeard}"</p>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <button
          onClick={isListening ? stopListening : startListening}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? '#ef4444' : '#4ade80',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {isListening ? '⏹' : '🎤'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => updateCount(activeId, -1)}
          style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
        >
          -
        </button>
        <button
          onClick={() => resetCount(activeId)}
          style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
        >
          Reset
        </button>
        <button
          onClick={() => updateCount(activeId, 1)}
          style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
        >
          +
        </button>
      </div>

      {counters.length > 1 && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => removeCounter(activeId)}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Delete "{activeCounter.name}" counter
          </button>
        </div>
      )}

      <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0' }}><strong>"next"</strong> = Count up</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0' }}><strong>"back"</strong> = Count down</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0' }}><strong>"reset"</strong> = Back to zero</p>
      </div>
    </div>
  );
}
