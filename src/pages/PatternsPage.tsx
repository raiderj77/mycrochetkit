import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
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
          <p className="text-[#2C1810]/50">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <PatternLibrary
      uid={user.uid}
      isPro={false}
      onBack={() => navigate('/')}
      onStartProject={() => {
        // TODO: Create project with pattern linked
        navigate('/');
      }}
    />
  );
}
