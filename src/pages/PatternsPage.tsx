import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { linkPatternToProject, getPattern } from '../services/patternService';
import { PatternLibrary } from '../components/patterns/PatternLibrary';

export function PatternsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-3 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
          <p className="text-[#2C1810]/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <PatternLibrary
      uid={user.uid}
      isPro={true}
      onBack={() => navigate('/')}
      onStartProject={async (patternId: string) => {
        if (!user) return;
        try {
          const pattern = await getPattern(user.uid, patternId);
          const projectRef = await addDoc(collection(db, 'users', user.uid, 'projects'), {
            name: pattern?.name || 'New Project',
            notes: '',
            counters: [{ id: '1', name: 'Row', count: 0 }],
            activeId: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          await linkPatternToProject(user.uid, projectRef.id, patternId);
          navigate(`/counter/${projectRef.id}`);
        } catch (err) {
          console.error('Failed to create project with pattern:', err);
        }
      }}
    />
  );
}
