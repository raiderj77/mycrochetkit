import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth } from '../firebase';

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
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const activeIdRef = useRef(activeId);

  // Keep refs in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load counters from Firestore when user logs in
  useEffect(() => {
    if (!user) return;
    
    const loadCounters = async () => {
      try {
        const docRef = doc(db, 'users', user.uid, 'projects', 'default');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.counters && data.counters.length > 0) {
            setCounters(data.counters);
            setActiveId(data.activeId || data.counters[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading counters:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCounters();
  }, [user]);

  // Save counters to Firestore whenever they change
  useEffect(() => {
    if (!user || loading) return;
    
    const saveCounters = async () => {
      setSaving(true);
      try {
        const docRef = doc(db, 'users', user.uid, 'projects', 'default');
        await setDoc(docRef, {
          counters,
          activeId,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error saving counters:', error);
      } finally {
        setSaving(false);
      }
    };
    
    // Debounce saves
    const timeout = setTimeout(saveCounters, 500);
    return () => clearTimeout(timeout);
  }, [counters, activeId, user, loading]);

  // Get active counter
  const activeCounter = counters.find(c => c.id === activeId) || counters[0];

  // Update a counter's count
  const updateCount = (id: string, delta: number) => {
    setCounters(prev => prev.map(c => 
      c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c
    ));
  };

  // Reset a counter
  const resetCount = (id: string) => {
    setCounters(prev => prev.map(c => 
      c.id === id ? { ...c, count: 0 } : c
    ));
  };

  // Add new counter
  const addCounter = () => {
    if (!newCounterName.trim()) return;
    const newId = Date.now().toString();
    setCounters(prev => [...prev, { id: newId, name: newCounterName.trim(), count: 0 }]);
    setNewCounterName('');
    setShowAddForm(false);
    setActiveId(newId);
  };

  // Remove counter
  const removeCounter = (id: string) => {
    if (counters.length <= 1) return;
    const newCounters = counters.filter(c => c.id !== id);
    setCounters(newCounters);
    if (activeId === id) {
      setActiveId(newCounters[0].id);
    }
  };

  // Setup speech recognition
  const setupRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setLastHeard(transcript);
      
      const currentActiveId = activeIdRef.current;
      
      if (transcript.includes('next') || transcript.includes('plus') || transcript.includes('add')) {
        updateCount(currentActiveId, 1);
      } else if (transcript.includes('back') || transcript.includes('minus') || transcript.includes('undo')) {
        updateCount(currentActiveId, -1);
      } else if (transcript.includes('reset') || transcript.includes('zero')) {
        resetCount(currentActiveId);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (e) { /* ignore */ }
        }, 100);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('Speech error:', event.error);
    };

    return recognition;
  };

  // Start listening
  const startListening = () => {
    if (isListening) return;
    const recognition = setupRecognition();
    if (!recognition) {
      alert('Voice recognition not supported. Please use Chrome.');
      return;
    }
    recognitionRef.current = recognition;
    setIsListening(true);
    try { recognition.start(); } catch (e) { /* ignore */ }
  };

  // Stop listening
  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white' }}>
        Loading your counters...
      </div>
    );
  }

  // Show sign-in prompt if not logged in
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Sign in to save your progress</h2>
        <p style={{ opacity: 0.7, marginBottom: '24px' }}>Your counters will be saved automatically.</p>
        <a href="/" style={{ padding: '12px 24px', background: '#4ade80', color: '#1a1a2e', borderRadius: '12px', textDecoration: 'none', fontWeight: '600' }}>← Go to Sign In</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px', color: 'white' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>← Back</a>
        <h1 style={{ fontSize: '1.1rem', margin: 0 }}>🧶 Voice Counter</h1>
        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{saving ? 'Saving...' : 'Saved ✓'}</div>
      </header>

      {/* Counter Tabs */}
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

      {/* Add Counter Form */}
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

      {/* Active Counter Display */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ opacity: 0.7, marginBottom: '8px', fontSize: '1rem' }}>{activeCounter.name}</p>
        <div style={{ fontSize: 'clamp(100px, 25vw, 180px)', fontWeight: '700', lineHeight: 1 }}>
          {activeCounter.count}
        </div>
      </div>

      {/* Voice Status */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-block',
          padding: '10px 24px',
          borderRadius: '50px',
          background: isListening ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)',
          border: isListening ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.2)'
        }}>
          {isListening ? '🎤 Listening...' : '🔇 Tap to start'}
        </div>
        {lastHeard && <p style={{ marginTop: '8px', opacity: 0.5, fontSize: '0.85rem' }}>Heard: "{lastHeard}"</p>}
      </div>

      {/* Voice Control Button */}
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

      {/* Manual Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => updateCount(activeId, -1)}
          style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
        >
          −
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

      {/* Delete Counter */}
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

      {/* Voice Commands Help */}
      <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0' }}><strong>"next"</strong> or <strong>"plus"</strong> = Count up</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0' }}><strong>"back"</strong> or <strong>"minus"</strong> = Count down</p>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '4px 0' }}><strong>"reset"</strong> = Back to zero</p>
      </div>
    </div>
  );
}
