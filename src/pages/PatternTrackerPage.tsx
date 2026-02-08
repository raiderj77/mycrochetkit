import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { PatternTracker } from '../components/patterns/PatternTracker';
import {
  getPattern,
  getPatternTrackerData,
  savePatternProgressDirect,
  savePatternAnnotationsDirect,
} from '../services/patternService';
import { getPatternLocally } from '../db/patternDB';
import type { Pattern, PatternProgress, StepAnnotation } from '../types/pattern';

const SAVE_DEBOUNCE_MS = 2000;

export function PatternTrackerPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [progress, setProgress] = useState<PatternProgress>({
    currentSectionIndex: 0,
    currentStepIndex: 0,
    completedSections: [],
    sectionRepeatCounts: {},
  });
  const [annotations, setAnnotations] = useState<Record<string, StepAnnotation>>({});

  const uidRef = useRef<string | null>(null);
  const progressTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const annotationsTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const pendingProgressRef = useRef<PatternProgress | null>(null);
  const pendingAnnotationsRef = useRef<Record<string, StepAnnotation> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      uidRef.current = currentUser.uid;

      if (patternId) {
        try {
          // Load pattern: Firestore first, IndexedDB fallback
          let loadedPattern: Pattern | null = null;
          if (navigator.onLine) {
            try {
              loadedPattern = await getPattern(currentUser.uid, patternId);
            } catch {
              // Firestore failed, will try IndexedDB below
            }
          }
          if (!loadedPattern) {
            const local = await getPatternLocally(patternId);
            if (local) loadedPattern = local;
          }
          setPattern(loadedPattern);

          // Load progress/annotations: Firestore first, localStorage fallback
          let progressLoaded = false;
          let annotationsLoaded = false;

          if (navigator.onLine && loadedPattern) {
            try {
              const trackerData = await getPatternTrackerData(currentUser.uid, patternId);
              if (trackerData.progress) {
                setProgress(trackerData.progress);
                localStorage.setItem(
                  `pattern-progress-${patternId}`,
                  JSON.stringify(trackerData.progress)
                );
                progressLoaded = true;
              }
              if (trackerData.annotations) {
                setAnnotations(trackerData.annotations);
                localStorage.setItem(
                  `pattern-annotations-${patternId}`,
                  JSON.stringify(trackerData.annotations)
                );
                annotationsLoaded = true;
              }
            } catch {
              // Firestore tracker data failed, fall through to localStorage
            }
          }

          if (!progressLoaded) {
            const savedProgress = localStorage.getItem(`pattern-progress-${patternId}`);
            if (savedProgress) setProgress(JSON.parse(savedProgress));
          }
          if (!annotationsLoaded) {
            const savedAnnotations = localStorage.getItem(`pattern-annotations-${patternId}`);
            if (savedAnnotations) setAnnotations(JSON.parse(savedAnnotations));
          }
        } catch (err) {
          console.error('Failed to load pattern:', err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, patternId]);

  // Flush pending Firestore writes on unmount
  useEffect(() => {
    return () => {
      const uid = uidRef.current;
      if (!uid || !patternId) return;

      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
      if (annotationsTimeoutRef.current) {
        clearTimeout(annotationsTimeoutRef.current);
      }

      if (pendingProgressRef.current && navigator.onLine) {
        savePatternProgressDirect(uid, patternId, pendingProgressRef.current).catch(
          console.error
        );
      }
      if (pendingAnnotationsRef.current && navigator.onLine) {
        savePatternAnnotationsDirect(uid, patternId, pendingAnnotationsRef.current).catch(
          console.error
        );
      }
    };
  }, [patternId]);

  const handleProgressChange = useCallback(
    (updates: Partial<PatternProgress>) => {
      setProgress((prev) => {
        const newProgress = { ...prev, ...updates };

        // Immediate localStorage write
        localStorage.setItem(`pattern-progress-${patternId}`, JSON.stringify(newProgress));

        // Debounced Firestore write
        pendingProgressRef.current = newProgress;
        if (progressTimeoutRef.current) clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = setTimeout(() => {
          const uid = uidRef.current;
          if (uid && patternId && navigator.onLine) {
            savePatternProgressDirect(uid, patternId, newProgress).catch(console.error);
            pendingProgressRef.current = null;
          }
        }, SAVE_DEBOUNCE_MS);

        return newProgress;
      });
    },
    [patternId]
  );

  const handleAnnotationChange = useCallback(
    (key: string, annotation: Partial<StepAnnotation>) => {
      setAnnotations((prev) => {
        const newAnnotations = { ...prev, [key]: { ...prev[key], ...annotation } };

        // Immediate localStorage write
        localStorage.setItem(
          `pattern-annotations-${patternId}`,
          JSON.stringify(newAnnotations)
        );

        // Debounced Firestore write
        pendingAnnotationsRef.current = newAnnotations;
        if (annotationsTimeoutRef.current) clearTimeout(annotationsTimeoutRef.current);
        annotationsTimeoutRef.current = setTimeout(() => {
          const uid = uidRef.current;
          if (uid && patternId && navigator.onLine) {
            savePatternAnnotationsDirect(uid, patternId, newAnnotations).catch(console.error);
            pendingAnnotationsRef.current = null;
          }
        }, SAVE_DEBOUNCE_MS);

        return newAnnotations;
      });
    },
    [patternId]
  );

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
          <p className="text-[#2C1810]/70 mb-4">Pattern not found</p>
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
          <p className="text-[#2C1810]/70 mb-6">Add steps to this pattern to start tracking</p>
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
