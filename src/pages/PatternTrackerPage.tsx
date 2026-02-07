import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import { PatternTracker } from '../components/patterns/PatternTracker';
import { getPattern } from '../services/patternService';
import type { Pattern, PatternProgress, StepAnnotation } from '../types/pattern';

export function PatternTrackerPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [progress, setProgress] = useState<PatternProgress>({
    currentSectionIndex: 0,
    currentStepIndex: 0,
    completedSections: [],
    sectionRepeatCounts: {},
  });
  const [annotations, setAnnotations] = useState<Record<string, StepAnnotation>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/');
        return;
      }
      if (patternId) {
        try {
          const p = await getPattern(currentUser.uid, patternId);
          setPattern(p);
          const savedProgress = localStorage.getItem(`pattern-progress-${patternId}`);
          if (savedProgress) setProgress(JSON.parse(savedProgress));
          const savedAnnotations = localStorage.getItem(`pattern-annotations-${patternId}`);
          if (savedAnnotations) setAnnotations(JSON.parse(savedAnnotations));
        } catch (err) {
          console.error('Failed to load pattern:', err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, patternId]);

  const handleProgressChange = (updates: Partial<PatternProgress>) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    localStorage.setItem(`pattern-progress-${patternId}`, JSON.stringify(newProgress));
  };

  const handleAnnotationChange = (key: string, annotation: Partial<StepAnnotation>) => {
    const newAnnotations = { ...annotations, [key]: { ...annotations[key], ...annotation } };
    setAnnotations(newAnnotations);
    localStorage.setItem(`pattern-annotations-${patternId}`, JSON.stringify(newAnnotations));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="w-12 h-12 rounded-full border-3 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
      </div>
    );

  if (!pattern)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <p className="text-[#2C1810]/50 mb-4">Pattern not found</p>
          <button onClick={() => navigate('/patterns')} className="text-[#E86A58]">
            Back to Patterns
          </button>
        </div>
      </div>
    );

  if (pattern.sections.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-[#2C1810] mb-2">No steps yet</h2>
          <p className="text-[#2C1810]/50 mb-6">Add steps to this pattern to start tracking</p>
          <button
            onClick={() => navigate(`/patterns/${patternId}/edit`)}
            className="px-6 py-3 bg-[#E86A58] text-white rounded-xl font-medium"
          >
            Add Steps
          </button>
        </div>
      </div>
    );

  return (
    <PatternTracker
      pattern={pattern}
      progress={progress}
      annotations={annotations}
      onProgressChange={handleProgressChange}
      onAnnotationChange={handleAnnotationChange}
      onBack={() => navigate('/patterns')}
    />
  );
}
