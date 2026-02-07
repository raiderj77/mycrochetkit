import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  Mic,
  MicOff,
  StickyNote,
  AlertTriangle,
  List,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import type { Pattern, PatternProgress, StepAnnotation, InlineCounter } from '../../types/pattern';
import { DEFAULT_ABBREVIATIONS } from '../../types/pattern';

interface PatternTrackerProps {
  pattern: Pattern;
  progress: PatternProgress;
  annotations: Record<string, StepAnnotation>;
  onProgressChange: (progress: Partial<PatternProgress>) => void;
  onAnnotationChange: (key: string, annotation: Partial<StepAnnotation>) => void;
  onBack: () => void;
}

export function PatternTracker({
  pattern,
  progress,
  annotations,
  onProgressChange,
  onAnnotationChange,
  onBack,
}: PatternTrackerProps) {
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [expandedAbbrev, setExpandedAbbrev] = useState<string | null>(null);
  const [showAddCounter, setShowAddCounter] = useState(false);
  const [newCounterLabel, setNewCounterLabel] = useState('Stitch counter');
  const [newCounterTarget, setNewCounterTarget] = useState('');
  const [newCounterReset, setNewCounterReset] = useState(true);

  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  // ── Derived values ──────────────────────────────────────

  const currentSection = pattern.sections[progress.currentSectionIndex];
  const currentStep = currentSection?.steps[progress.currentStepIndex];
  const annotationKey = `${progress.currentSectionIndex}-${progress.currentStepIndex}`;
  const currentAnnotation = annotations[annotationKey] || {};
  const currentRepeat = progress.sectionRepeatCounts[progress.currentSectionIndex] || 1;

  // Total steps accounting for section repeats
  const totalSteps = pattern.sections.reduce(
    (sum, s) => sum + s.steps.length * s.repeatCount,
    0
  );

  // Completed steps accounting for section repeats
  const completedSteps =
    pattern.sections
      .slice(0, progress.currentSectionIndex)
      .reduce((sum, s) => sum + s.steps.length * s.repeatCount, 0) +
    (currentRepeat - 1) * (currentSection?.steps.length || 0) +
    progress.currentStepIndex;

  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const canGoBack = progress.currentStepIndex > 0 || currentRepeat > 1 || progress.currentSectionIndex > 0;

  const isLastSection = progress.currentSectionIndex >= pattern.sections.length - 1;
  const isLastStep = progress.currentStepIndex >= (currentSection?.steps.length || 1) - 1;
  const isLastRepeat = currentRepeat >= (currentSection?.repeatCount || 1);
  const canGoForward = !(isLastSection && isLastStep && isLastRepeat);

  // ── Navigation ──────────────────────────────────────────

  const goToNextStep = useCallback(() => {
    if (!currentSection) return;

    // Auto-reset counters with resetOnAdvance
    const counters = currentAnnotation.inlineCounters;
    if (counters?.some((c) => c.resetOnAdvance && c.current > 0)) {
      const resetCounters = counters.map((c) =>
        c.resetOnAdvance ? { ...c, current: 0 } : c
      );
      onAnnotationChange(annotationKey, { inlineCounters: resetCounters });
    }

    if (progress.currentStepIndex < currentSection.steps.length - 1) {
      // Next step within section
      onProgressChange({ currentStepIndex: progress.currentStepIndex + 1 });
    } else if (currentRepeat < currentSection.repeatCount) {
      // Loop back for next repeat of this section
      onProgressChange({
        currentStepIndex: 0,
        sectionRepeatCounts: {
          ...progress.sectionRepeatCounts,
          [progress.currentSectionIndex]: currentRepeat + 1,
        },
      });
    } else if (progress.currentSectionIndex < pattern.sections.length - 1) {
      // Move to next section, mark current as completed
      const sectionKey = String(progress.currentSectionIndex);
      const completedSections = progress.completedSections.includes(sectionKey)
        ? progress.completedSections
        : [...progress.completedSections, sectionKey];
      onProgressChange({
        currentSectionIndex: progress.currentSectionIndex + 1,
        currentStepIndex: 0,
        completedSections,
      });
    }
  }, [
    currentSection,
    currentRepeat,
    currentAnnotation.inlineCounters,
    annotationKey,
    progress,
    pattern.sections.length,
    onProgressChange,
    onAnnotationChange,
  ]);

  const goToPrevStep = useCallback(() => {
    if (progress.currentStepIndex > 0) {
      // Previous step within section
      onProgressChange({ currentStepIndex: progress.currentStepIndex - 1 });
    } else if (currentRepeat > 1) {
      // Go back to last step of same section, previous repeat
      onProgressChange({
        currentStepIndex: currentSection.steps.length - 1,
        sectionRepeatCounts: {
          ...progress.sectionRepeatCounts,
          [progress.currentSectionIndex]: currentRepeat - 1,
        },
      });
    } else if (progress.currentSectionIndex > 0) {
      // Go back to previous section's last step at max repeat
      const prevSection = pattern.sections[progress.currentSectionIndex - 1];
      onProgressChange({
        currentSectionIndex: progress.currentSectionIndex - 1,
        currentStepIndex: prevSection.steps.length - 1,
        sectionRepeatCounts: {
          ...progress.sectionRepeatCounts,
          [progress.currentSectionIndex - 1]: prevSection.repeatCount,
        },
      });
    }
  }, [progress, currentRepeat, currentSection, pattern.sections, onProgressChange]);

  const goToStep = (sectionIndex: number, stepIndex: number) => {
    onProgressChange({ currentSectionIndex: sectionIndex, currentStepIndex: stepIndex });
    setShowAllSteps(false);
  };

  const resetProgress = () => {
    if (confirm('Reset progress to the beginning?')) {
      onProgressChange({
        currentSectionIndex: 0,
        currentStepIndex: 0,
        completedSections: [],
        sectionRepeatCounts: {},
      });
    }
  };

  // ── Counter functions ───────────────────────────────────

  const updateCounter = useCallback(
    (counterId: string, delta: number) => {
      const counters = currentAnnotation.inlineCounters || [];
      const updated = counters.map((c) =>
        c.id === counterId ? { ...c, current: Math.max(0, c.current + delta) } : c
      );
      onAnnotationChange(annotationKey, { inlineCounters: updated });
    },
    [currentAnnotation.inlineCounters, annotationKey, onAnnotationChange]
  );

  const addCounter = useCallback(() => {
    const counter: InlineCounter = {
      id: `ic_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: newCounterLabel.trim() || 'Counter',
      current: 0,
      target: newCounterTarget ? parseInt(newCounterTarget) : null,
      resetOnAdvance: newCounterReset,
      voiceEnabled: false,
    };
    const counters = [...(currentAnnotation.inlineCounters || []), counter];
    onAnnotationChange(annotationKey, { inlineCounters: counters });
    setShowAddCounter(false);
    setNewCounterLabel('Stitch counter');
    setNewCounterTarget('');
    setNewCounterReset(true);
  }, [
    newCounterLabel,
    newCounterTarget,
    newCounterReset,
    currentAnnotation.inlineCounters,
    annotationKey,
    onAnnotationChange,
  ]);

  const removeCounter = useCallback(
    (counterId: string) => {
      const counters = (currentAnnotation.inlineCounters || []).filter(
        (c) => c.id !== counterId
      );
      onAnnotationChange(annotationKey, { inlineCounters: counters });
    },
    [currentAnnotation.inlineCounters, annotationKey, onAnnotationChange]
  );

  // ── Voice recognition ───────────────────────────────────

  useEffect(() => {
    if (!voiceEnabled || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window))
      return;
    const SpeechRecognitionCtor = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.toLowerCase().trim();
      if (text.includes('next') || text.includes('done')) goToNextStep();
      else if (text.includes('back') || text.includes('previous')) goToPrevStep();
    };
    recognition.onerror = () => {
      voiceEnabledRef.current = false;
      setVoiceEnabled(false);
    };
    recognition.onend = () => {
      if (voiceEnabledRef.current)
        try {
          recognition.start();
        } catch {
          /* speech API unavailable */
        }
    };
    recognition.start();
    return () => recognition.stop();
  }, [voiceEnabled, goToNextStep, goToPrevStep]);

  // ── Render helpers ──────────────────────────────────────

  const renderInstruction = (instruction: string) => {
    const abbrevs = { ...DEFAULT_ABBREVIATIONS, ...pattern.abbreviations };
    const words = instruction.split(/(\s+|,|\.|;|\(|\))/);
    return words.map((word, i) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const definition = abbrevs[cleanWord] || abbrevs[cleanWord.replace(/\d/g, '')];
      if (definition) {
        return (
          <span
            key={i}
            onClick={() => setExpandedAbbrev(expandedAbbrev === cleanWord ? null : cleanWord)}
            className="text-[#E86A58] font-medium cursor-pointer hover:underline"
          >
            {word}
            {expandedAbbrev === cleanWord && (
              <span className="ml-1 text-xs text-[#2C1810]/60 font-normal">({definition})</span>
            )}
          </span>
        );
      }
      return <span key={i}>{word}</span>;
    });
  };

  // ── Guards ──────────────────────────────────────────────

  if (!currentSection || !currentStep) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <p className="text-[#2C1810]/70">Pattern has no steps</p>
      </div>
    );
  }

  const counters = currentAnnotation.inlineCounters || [];

  // ── Render ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/90 backdrop-blur-xl border-b border-[#2C1810]/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-1 text-[#2C1810]/60">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-semibold text-[#2C1810] truncate max-w-[50%]">
            {pattern.name}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg ${voiceEnabled ? 'bg-[#E86A58] text-white' : 'text-[#2C1810]/65'}`}
            >
              {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button onClick={() => setShowAllSteps(true)} className="p-2 text-[#2C1810]/65">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-1 bg-[#2C1810]/10">
          <motion.div
            className="h-full bg-[#7FBFA0]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-4">
        {/* Section name + repeat info */}
        <div className="text-center mb-2">
          <span className="text-sm text-[#2C1810]/70">
            {currentSection.name}
            {currentSection.repeatCount > 1 && (
              <span className="ml-1 text-[#B8A9C9] font-medium">
                · Repeat {currentRepeat} of {currentSection.repeatCount}
              </span>
            )}
          </span>
        </div>

        {/* Section notes */}
        {currentSection.notes && (
          <div className="mx-auto mb-3 px-4 py-2 bg-white/80 border border-[#2C1810]/5 rounded-xl max-w-md flex items-start gap-2">
            <StickyNote className="w-4 h-4 text-[#B8A9C9] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#2C1810]/70">{currentSection.notes}</p>
          </div>
        )}

        {/* Step label + stitch count */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm">
            <span className="font-semibold text-[#2C1810]">
              {currentStep.label || `Step ${progress.currentStepIndex + 1}`}
            </span>
            {currentStep.stitchCountEnd && (
              <span className="text-sm text-[#2C1810]/70">
                ({currentStep.stitchCountEnd} sts)
              </span>
            )}
            {currentStep.repeat && (
              <span className="text-sm text-[#B8A9C9]">
                × {currentStep.repeat.times} {currentStep.repeat.unit}
              </span>
            )}
          </span>
        </div>

        {/* Tricky step warning */}
        {currentAnnotation.isDifficult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-4 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-700">You marked this step as tricky</span>
          </motion.div>
        )}

        {/* Instruction card */}
        <motion.div
          key={annotationKey}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 relative">
            <p className="text-xl leading-relaxed text-[#2C1810] text-center">
              {currentAnnotation.modification
                ? renderInstruction(currentAnnotation.modification)
                : renderInstruction(currentStep.instruction)}
            </p>
            {currentAnnotation.modification && (
              <div className="mt-3 text-center">
                <span className="text-xs text-[#B8A9C9]">✏️ Modified</span>
              </div>
            )}
            {currentAnnotation.userNote && (
              <div className="mt-4 p-3 bg-[#FFF8F0] rounded-xl">
                <p className="text-sm text-[#2C1810]/70">
                  <StickyNote className="w-4 h-4 inline mr-1 text-[#7FBFA0]" />
                  {currentAnnotation.userNote}
                </p>
              </div>
            )}
            <button
              onClick={() => setShowAnnotationPanel(true)}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white border border-[#2C1810]/10 rounded-full text-sm text-[#2C1810]/70 shadow-sm hover:shadow-md transition-shadow"
            >
              + Add note
            </button>
          </div>
        </motion.div>

        {/* Inline counters */}
        {(counters.length > 0 || showAddCounter) && (
          <div className="mt-6 w-full max-w-md mx-auto space-y-3">
            {counters.map((counter) => {
              const reachedTarget =
                counter.target !== null && counter.current >= counter.target;
              return (
                <div
                  key={counter.id}
                  className={`bg-white rounded-2xl p-3 shadow-sm border ${reachedTarget ? 'border-[#7FBFA0]' : 'border-[#2C1810]/10'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#2C1810]">
                      {counter.label}
                      {counter.resetOnAdvance && (
                        <span className="ml-1 text-xs text-[#2C1810]/40">· resets on next</span>
                      )}
                    </span>
                    <button
                      onClick={() => removeCounter(counter.id)}
                      className="text-[#2C1810]/30 hover:text-red-400 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateCounter(counter.id, -1)}
                      disabled={counter.current <= 0}
                      className="w-12 h-12 rounded-xl bg-[#FFF8F0] text-[#2C1810]/70 flex items-center justify-center disabled:opacity-30"
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    <div className="text-center">
                      <span
                        className={`text-2xl font-bold ${reachedTarget ? 'text-[#7FBFA0]' : 'text-[#2C1810]'}`}
                      >
                        {counter.current}
                      </span>
                      {counter.target !== null && (
                        <span className="text-lg text-[#2C1810]/40"> / {counter.target}</span>
                      )}
                      {reachedTarget && (
                        <div className="text-xs text-[#7FBFA0] font-medium mt-0.5">
                          <Check className="w-3 h-3 inline" /> Target reached
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateCounter(counter.id, 1)}
                      className="w-12 h-12 rounded-xl bg-[#E86A58]/10 text-[#E86A58] flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add counter form / button */}
        <div className="mt-4 w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {showAddCounter ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C1810]/10 overflow-hidden"
              >
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newCounterLabel}
                    onChange={(e) => setNewCounterLabel(e.target.value)}
                    placeholder="Counter name"
                    className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl text-sm text-[#2C1810] placeholder:text-[#2C1810]/50"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-[#2C1810]/60 mb-1 block">
                        Target (optional)
                      </label>
                      <input
                        type="number"
                        value={newCounterTarget}
                        onChange={(e) => setNewCounterTarget(e.target.value)}
                        placeholder="--"
                        min={1}
                        className="w-full px-3 py-2 bg-[#FFF8F0] rounded-xl text-sm text-[#2C1810] placeholder:text-[#2C1810]/50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-[#2C1810]/60 mb-1 block">Reset on next</label>
                      <button
                        onClick={() => setNewCounterReset(!newCounterReset)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm ${newCounterReset ? 'bg-[#7FBFA0]/15 text-[#7FBFA0]' : 'bg-[#FFF8F0] text-[#2C1810]/60'}`}
                      >
                        <span>{newCounterReset ? 'Yes' : 'No'}</span>
                        <div
                          className={`w-8 h-5 rounded-full transition-colors ${newCounterReset ? 'bg-[#7FBFA0]' : 'bg-[#2C1810]/20'}`}
                        >
                          <div
                            className={`w-3.5 h-3.5 bg-white rounded-full mt-[3px] transition-transform ${newCounterReset ? 'translate-x-[14px]' : 'translate-x-[3px]'}`}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addCounter}
                      className="flex-1 py-2 bg-[#E86A58] text-white rounded-xl text-sm font-medium"
                    >
                      Add Counter
                    </button>
                    <button
                      onClick={() => setShowAddCounter(false)}
                      className="px-4 py-2 text-[#2C1810]/60 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddCounter(true)}
                className="w-full py-2.5 text-[#2C1810]/50 text-sm hover:text-[#E86A58] transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add counter
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Step position info */}
        <div className="text-center mt-4 text-sm text-[#2C1810]/65">
          Step {progress.currentStepIndex + 1} of {currentSection.steps.length}
          {pattern.sections.length > 1 && (
            <span>
              {' '}
              · Section {progress.currentSectionIndex + 1} of {pattern.sections.length}
            </span>
          )}
          {currentSection.repeatCount > 1 && (
            <span>
              {' '}
              · Repeat {currentRepeat}/{currentSection.repeatCount}
            </span>
          )}
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="sticky bottom-0 bg-white border-t border-[#2C1810]/5 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevStep}
            disabled={!canGoBack}
            className="w-14 h-14 rounded-2xl bg-[#FFF8F0] text-[#2C1810]/70 flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={goToNextStep}
            disabled={!canGoForward}
            className="flex-1 mx-4 h-14 rounded-2xl bg-[#E86A58] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#E86A58]/25 disabled:opacity-50"
          >
            {canGoForward ? (
              <>
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Done!</span>
              </>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetProgress}
            className="w-14 h-14 rounded-2xl bg-[#FFF8F0] text-[#2C1810]/70 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
        {voiceEnabled && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-2 text-sm text-[#E86A58]">
              <span className="w-2 h-2 bg-[#E86A58] rounded-full animate-pulse" />
              Listening... say "next" or "back"
            </span>
          </div>
        )}
      </footer>

      {/* All Steps sidebar */}
      <AnimatePresence>
        {showAllSteps && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllSteps(false)}
            className="fixed inset-0 bg-black/50 z-50"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-[#2C1810]/10 px-4 py-3 flex items-center justify-between">
                <h2 className="font-semibold text-[#2C1810]">All Steps</h2>
                <button
                  onClick={() => setShowAllSteps(false)}
                  className="p-2 text-[#2C1810]/65"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {pattern.sections.map((section, sIdx) => {
                  const isSectionCompleted =
                    progress.completedSections.includes(String(sIdx)) ||
                    sIdx < progress.currentSectionIndex;
                  const isSectionCurrent = sIdx === progress.currentSectionIndex;
                  const sectionRepeat =
                    isSectionCurrent ? currentRepeat : undefined;

                  return (
                    <div key={sIdx}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-[#2C1810]/70 flex items-center gap-1.5">
                          {isSectionCompleted && (
                            <Check className="w-3.5 h-3.5 text-[#7FBFA0]" />
                          )}
                          {section.name}
                        </h3>
                        <span className="text-xs text-[#2C1810]/50">
                          {section.steps.length} steps
                          {section.repeatCount > 1 && ` × ${section.repeatCount}`}
                          {isSectionCurrent && section.repeatCount > 1 && (
                            <span className="ml-1 text-[#B8A9C9] font-medium">
                              (rep {sectionRepeat}/{section.repeatCount})
                            </span>
                          )}
                        </span>
                      </div>
                      {section.notes && (
                        <p className="text-xs text-[#2C1810]/50 mb-2 px-1 line-clamp-2">{section.notes}</p>
                      )}
                      <div className="space-y-1">
                        {section.steps.map((step, stepIdx) => {
                          const isCurrent =
                            sIdx === progress.currentSectionIndex &&
                            stepIdx === progress.currentStepIndex;
                          const isPast =
                            sIdx < progress.currentSectionIndex ||
                            (sIdx === progress.currentSectionIndex &&
                              stepIdx < progress.currentStepIndex);
                          return (
                            <button
                              key={stepIdx}
                              onClick={() => goToStep(sIdx, stepIdx)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                isCurrent
                                  ? 'bg-[#E86A58] text-white'
                                  : isPast
                                    ? 'bg-[#7FBFA0]/10 text-[#7FBFA0]'
                                    : 'bg-[#FFF8F0] text-[#2C1810]/70 hover:bg-[#F5E6E0]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isPast && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                                <span className="font-medium">
                                  {step.label || `Step ${stepIdx + 1}`}
                                </span>
                                {step.stitchCountEnd && (
                                  <span className="ml-auto opacity-60">
                                    ({step.stitchCountEnd})
                                  </span>
                                )}
                                {step.repeat && (
                                  <span className="opacity-50 text-xs">
                                    × {step.repeat.times}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Annotation panel */}
      <AnimatePresence>
        {showAnnotationPanel && (
          <AnnotationPanelInline
            annotation={currentAnnotation}
            originalInstruction={currentStep.instruction}
            onSave={(updates) => {
              onAnnotationChange(annotationKey, updates);
              setShowAnnotationPanel(false);
            }}
            onClose={() => setShowAnnotationPanel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Annotation Panel ────────────────────────────────────

interface AnnotationPanelInlineProps {
  annotation: StepAnnotation;
  originalInstruction: string;
  onSave: (updates: Partial<StepAnnotation>) => void;
  onClose: () => void;
}

function AnnotationPanelInline({
  annotation,
  originalInstruction,
  onSave,
  onClose,
}: AnnotationPanelInlineProps) {
  const [note, setNote] = useState(annotation.userNote || '');
  const [isDifficult, setIsDifficult] = useState(annotation.isDifficult || false);
  const [modification, setModification] = useState(annotation.modification || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[#2C1810]/10 px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#2C1810]">Annotate Step</h2>
          <button onClick={onClose} className="text-[#2C1810]/65">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-2">
              <StickyNote className="w-4 h-4 inline mr-1" /> Personal Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Use stitch marker here..."
              rows={3}
              className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/60 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-2">
              <AlertTriangle className="w-4 h-4 inline mr-1" /> Mark as Tricky
            </label>
            <button
              onClick={() => setIsDifficult(!isDifficult)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${isDifficult ? 'bg-amber-50 border-amber-200' : 'bg-[#FFF8F0] border-transparent'}`}
            >
              <span className="text-[#2C1810]">
                {isDifficult ? '⚠️ Marked as tricky' : 'Not marked'}
              </span>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${isDifficult ? 'bg-amber-400' : 'bg-[#2C1810]/20'}`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${isDifficult ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </div>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-2">
              ✏️ Modify Instruction
            </label>
            <div className="p-3 bg-[#2C1810]/5 rounded-xl mb-2">
              <p className="text-xs text-[#2C1810]/70 mb-1">Original:</p>
              <p className="text-sm text-[#2C1810]">{originalInstruction}</p>
            </div>
            <textarea
              value={modification}
              onChange={(e) => setModification(e.target.value)}
              placeholder="Your modified version..."
              rows={3}
              className="w-full px-4 py-3 bg-[#FFF8F0] rounded-xl text-[#2C1810] placeholder:text-[#2C1810]/60 resize-none"
            />
          </div>
          <button
            onClick={() =>
              onSave({
                userNote: note || undefined,
                isDifficult,
                modification: modification || null,
                originalInstruction: modification ? originalInstruction : null,
              })
            }
            className="w-full py-3 bg-[#E86A58] text-white rounded-xl font-semibold"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
