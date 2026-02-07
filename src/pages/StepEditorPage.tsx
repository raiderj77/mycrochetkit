import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import { StepEditor } from '../components/patterns/StepEditor';
import { getPattern, updatePattern } from '../services/patternService';
import type { PatternSection } from '../types/pattern';

export function StepEditorPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<PatternSection[]>([]);
  const [, setPatternName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/');
        return;
      }
      if (patternId) {
        const pattern = await getPattern(currentUser.uid, patternId);
        if (pattern) {
          setSections(pattern.sections);
          setPatternName(pattern.name);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, patternId]);

  const handleSave = async () => {
    if (!user || !patternId) return;
    setSaving(true);
    try {
      await updatePattern(user.uid, patternId, { sections }, true);
      navigate('/patterns');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save pattern');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="w-12 h-12 rounded-full border-3 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
      </div>
    );
  }

  return (
    <StepEditor
      sections={sections}
      onChange={setSections}
      onSave={handleSave}
      onCancel={() => navigate('/patterns')}
      saving={saving}
    />
  );
}
