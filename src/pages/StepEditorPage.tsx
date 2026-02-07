import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import { StepEditor } from '../components/patterns/StepEditor';
import { getPattern, updatePattern, getPatternVersions, restorePatternVersion } from '../services/patternService';
import { getPatternLocally, savePatternsPendingSync } from '../db/patternDB';
import type { Pattern, PatternSection } from '../types/pattern';

export function StepEditorPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<PatternSection[]>([]);
  const [abbreviations, setAbbreviations] = useState<Record<string, string>>({});
  const [localPattern, setLocalPattern] = useState<Pattern | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/');
        return;
      }
      if (patternId) {
        // Try Firestore first, fall back to IndexedDB
        let loaded: Pattern | null = null;
        if (navigator.onLine) {
          try {
            loaded = await getPattern(currentUser.uid, patternId);
          } catch {
            // Firestore failed, will try IndexedDB below
          }
        }
        if (!loaded) {
          const local = await getPatternLocally(patternId);
          if (local) loaded = local;
        }
        if (loaded) {
          setSections(loaded.sections);
          setAbbreviations(loaded.abbreviations || {});
          setLocalPattern(loaded);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, patternId]);

  const handleLoadVersions = async () => {
    if (!user || !patternId) return [];
    return getPatternVersions(user.uid, patternId);
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!user || !patternId) return;
    await restorePatternVersion(user.uid, patternId, versionId);
    // Reload pattern data
    const reloaded = await getPattern(user.uid, patternId);
    if (reloaded) {
      setSections(reloaded.sections);
      setAbbreviations(reloaded.abbreviations || {});
      setLocalPattern(reloaded);
    }
  };

  const handleSave = async () => {
    if (!user || !patternId) return;
    setSaving(true);
    try {
      if (navigator.onLine) {
        await updatePattern(user.uid, patternId, { sections, abbreviations }, true);
      } else {
        // Offline: save to IndexedDB with pending sync
        const base = localPattern || (await getPatternLocally(patternId));
        if (base) {
          const updated: Pattern = { ...base, sections, abbreviations, updatedAt: new Date() };
          await savePatternsPendingSync(updated);
        }
      }
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
      abbreviations={abbreviations}
      onAbbreviationsChange={setAbbreviations}
      onSave={handleSave}
      onCancel={() => navigate('/patterns')}
      saving={saving}
      onLoadVersions={handleLoadVersions}
      onRestoreVersion={handleRestoreVersion}
    />
  );
}
