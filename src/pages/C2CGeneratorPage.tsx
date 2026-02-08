import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import { C2CGenerator } from '../components/c2c/C2CGenerator';

export function C2CGeneratorPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="w-12 h-12 rounded-full border-3 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
      </div>
    );
  }

  return <C2CGenerator uid={user.uid} onBack={() => navigate('/')} />;
}
