import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Save, X, BookOpen, StickyNote, History, RotateCcw, Repeat } from 'lucide-react';
import type { PatternSection, PatternStep, PatternVersion, StepKind, RepeatUnit } from '../../types/pattern';
import { DEFAULT_ABBREVIATIONS } from '../../types/pattern';

const STEP_KINDS: { value: StepKind; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'row', label: 'Row' },
  { value: 'instruction', label: 'Instruction' },
  { value: 'repeat', label: 'Repeat' },
  { value: 'note', label: 'Note' },
];

const REPEAT_UNITS: { value: RepeatUnit; label: string }[] = [
  { value: 'stitchGroup', label: 'stitch groups' },
  { value: 'rows', label: 'rows' },
  { value: 'rounds', label: 'rounds' },
];

interface StepEditorProps {
  sections: PatternSection[];
  onChange: (sections: PatternSection[]) => void;
  abbreviations?: Record<string, string>;
  onAbbreviationsChange?: (abbreviations: Record<string, string>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  onLoadVersions?: () => Promise<PatternVersion[]>;
  onRestoreVersion?: (versionId: string) => Promise<void>;
}

export function StepEditor({
  sections,
  onChange,
  abbreviations = {},
  onAbbreviationsChange,
  onSave,
  onCancel,
  saving,
  onLoadVersions,
  onRestoreVersion,
}: StepEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [showAbbreviations, setShowAbbreviations] = useState(false);
  const [showBuiltins, setShowBuiltins] = useState(false);
  const [newAbbrevCode, setNewAbbrevCode] = useState('');
  const [newAbbrevDef, setNewAbbrevDef] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<PatternVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);
  const [sectionNotesOpen, setSectionNotesOpen] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    const next = new Set(expandedSections);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedSections(next);
  };

  const addSection = () => {
    const newSection: PatternSection = {
      name: `Section ${sections.length + 1}`,
      repeatCount: 1,
      steps: [],
    };
    onChange([...sections, newSection]);
    setExpandedSections(new Set([...expandedSections, sections.length]));
  };

  const updateSection = (index: number, updates: Partial<PatternSection>) => {
    const updated = sections.map((s, i) => (i === index ? { ...s, ...updates } : s));
    onChange(updated);
  };

  const deleteSection = (index: number) => {
    if (confirm('Delete this section and all its steps?')) {
      onChange(sections.filter((_, i) => i !== index));
    }
  };

  const addStep = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const stepNumber = section.steps.length + 1;
    const newStep: PatternStep = {
      kind: 'round',
      label: `Rnd ${stepNumber}`,
      instruction: '',
      stitchCountEnd: null,
      repeat: null,
      trackable: true,
    };
    const updatedSteps = [...section.steps, newStep];
    updateSection(sectionIndex, { steps: updatedSteps });
  };

  const updateStep = (sectionIndex: number, stepIndex: number, updates: Partial<PatternStep>) => {
    const section = sections[sectionIndex];
    const updatedSteps = section.steps.map((step, i) =>
      i === stepIndex ? { ...step, ...updates } : step
    );
    updateSection(sectionIndex, { steps: updatedSteps });
  };

  const deleteStep = (sectionIndex: number, stepIndex: number) => {
    const section = sections[sectionIndex];
    const updatedSteps = section.steps.filter((_, i) => i !== stepIndex);
    updateSection(sectionIndex, { steps: updatedSteps });
  };

  const reorderSteps = (sectionIndex: number, newOrder: PatternStep[]) => {
    updateSection(sectionIndex, { steps: newOrder });
  };

  const addAbbreviation = () => {
    const code = newAbbrevCode.trim().toLowerCase();
    const def = newAbbrevDef.trim();
    if (!code || !def || !onAbbreviationsChange) return;
    if (DEFAULT_ABBREVIATIONS[code]) return; // Don't override built-ins
    onAbbreviationsChange({ ...abbreviations, [code]: def });
    setNewAbbrevCode('');
    setNewAbbrevDef('');
  };

  const removeAbbreviation = (code: string) => {
    if (!onAbbreviationsChange) return;
    const updated = { ...abbreviations };
    delete updated[code];
    onAbbreviationsChange(updated);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onCancel} className="flex items-center gap-1 text-[#2C1810]/60">
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <h1 className="text-lg font-semibold text-[#2C1810]">Edit Steps</h1>
          <div className="flex items-center gap-2">
            {onLoadVersions && (
              <button
                onClick={async () => {
                  setShowVersionHistory(true);
                  setLoadingVersions(true);
                  try {
                    const v = await onLoadVersions();
                    setVersions(v);
                  } catch {
                    /* ignore */
                  } finally {
                    setLoadingVersions(false);
                  }
                }}
                className="p-1.5 text-[#2C1810]/60 hover:text-[#2C1810]"
              >
                <History className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1 text-[#E86A58] font-medium disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24">
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-lg font-medium text-[#2C1810] mb-2">No sections yet</h2>
            <p className="text-[#2C1810]/70 mb-6">Add a section to start building your pattern</p>
            <button
              onClick={addSection}
              className="px-6 py-3 bg-[#E86A58] text-white rounded-xl font-medium"
            >
              + Add First Section
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-white rounded-2xl border border-[#2C1810]/10 overflow-hidden"
              >
                {/* Section Header */}
                <div
                  className="flex items-center gap-3 px-4 py-3 bg-[#FFF8F0] cursor-pointer"
                  onClick={() => toggleSection(sectionIndex)}
                >
                  <button className="text-[#2C1810]/60">
                    {expandedSections.has(sectionIndex) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSection(sectionIndex, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent font-medium text-[#2C1810] focus:outline-none"
                    placeholder="Section name"
                  />
                  <span className="text-xs text-[#2C1810]/65">
                    {section.steps.length} step{section.steps.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(sectionIndex);
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Section Content */}
                <AnimatePresence>
                  {expandedSections.has(sectionIndex) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-2">
                        {/* Repeat count */}
                        <div className="flex items-center gap-2 px-2 py-1 text-sm">
                          <span className="text-[#2C1810]/70">Repeat section</span>
                          <input
                            type="number"
                            min={1}
                            value={section.repeatCount}
                            onChange={(e) =>
                              updateSection(sectionIndex, {
                                repeatCount: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-16 px-2 py-1 bg-[#FFF8F0] rounded-lg text-center text-[#2C1810]"
                          />
                          <span className="text-[#2C1810]/70">
                            time{section.repeatCount !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Section notes */}
                        {(section.notes || sectionNotesOpen.has(sectionIndex)) ? (
                          <div className="px-2 py-1">
                            <label className="flex items-center gap-1 text-xs text-[#2C1810]/60 mb-1">
                              <StickyNote className="w-3 h-3" />
                              Section notes
                            </label>
                            <textarea
                              value={section.notes || ''}
                              onChange={(e) =>
                                updateSection(sectionIndex, {
                                  notes: e.target.value || undefined,
                                })
                              }
                              placeholder="Notes for this section..."
                              rows={2}
                              className="w-full px-3 py-2 bg-[#FFF8F0] rounded-lg text-sm text-[#2C1810] placeholder:text-[#2C1810]/40 resize-none"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setSectionNotesOpen(new Set([...sectionNotesOpen, sectionIndex]))}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-[#2C1810]/40 hover:text-[#2C1810]/70 transition-colors"
                          >
                            <StickyNote className="w-3 h-3" />
                            + Add section notes
                          </button>
                        )}

                        {/* Steps */}
                        <Reorder.Group
                          axis="y"
                          values={section.steps}
                          onReorder={(newOrder) => reorderSteps(sectionIndex, newOrder)}
                          className="space-y-2"
                        >
                          {section.steps.map((step, stepIndex) => (
                            <Reorder.Item
                              key={`${sectionIndex}-${stepIndex}`}
                              value={step}
                              className="bg-[#FFF8F0] rounded-xl p-3"
                            >
                              <div className="flex items-start gap-2">
                                <div className="mt-2 cursor-grab active:cursor-grabbing text-[#2C1810]/60">
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                <div className="flex-1 space-y-2">
                                  {/* Kind + Label row */}
                                  <div className="flex gap-2">
                                    <select
                                      value={step.kind}
                                      onChange={(e) =>
                                        updateStep(sectionIndex, stepIndex, {
                                          kind: e.target.value as StepKind,
                                        })
                                      }
                                      className="px-2 py-1.5 bg-white rounded-lg text-sm text-[#2C1810] border border-[#2C1810]/10"
                                    >
                                      {STEP_KINDS.map((k) => (
                                        <option key={k.value} value={k.value}>
                                          {k.label}
                                        </option>
                                      ))}
                                    </select>
                                    <input
                                      type="text"
                                      value={step.label}
                                      onChange={(e) =>
                                        updateStep(sectionIndex, stepIndex, {
                                          label: e.target.value,
                                        })
                                      }
                                      placeholder="Label (e.g. Rnd 1)"
                                      className="flex-1 px-3 py-1.5 bg-white rounded-lg text-sm text-[#2C1810] border border-[#2C1810]/10"
                                    />
                                  </div>

                                  {/* Instruction */}
                                  <textarea
                                    value={step.instruction}
                                    onChange={(e) =>
                                      updateStep(sectionIndex, stepIndex, {
                                        instruction: e.target.value,
                                      })
                                    }
                                    placeholder="Instructions (e.g. 6 sc in magic ring)"
                                    rows={2}
                                    className="w-full px-3 py-2 bg-white rounded-lg text-sm text-[#2C1810] border border-[#2C1810]/10 resize-none"
                                  />

                                  {/* Stitch count */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#2C1810]/70">Stitch count:</span>
                                    <input
                                      type="number"
                                      value={step.stitchCountEnd ?? ''}
                                      onChange={(e) =>
                                        updateStep(sectionIndex, stepIndex, {
                                          stitchCountEnd: e.target.value
                                            ? parseInt(e.target.value)
                                            : null,
                                        })
                                      }
                                      placeholder="—"
                                      className="w-16 px-2 py-1 bg-white rounded-lg text-center text-sm text-[#2C1810] border border-[#2C1810]/10"
                                    />
                                  </div>

                                  {/* Step repeat config */}
                                  {step.repeat ? (
                                    <div className="flex items-center gap-2">
                                      <Repeat className="w-3.5 h-3.5 text-[#B8A9C9]" />
                                      <span className="text-xs text-[#2C1810]/70">Repeat</span>
                                      <input
                                        type="number"
                                        min={1}
                                        value={step.repeat.times}
                                        onChange={(e) =>
                                          updateStep(sectionIndex, stepIndex, {
                                            repeat: {
                                              ...step.repeat!,
                                              times: parseInt(e.target.value) || 1,
                                            },
                                          })
                                        }
                                        className="w-14 px-2 py-1 bg-white rounded-lg text-center text-sm text-[#2C1810] border border-[#2C1810]/10"
                                      />
                                      <select
                                        value={step.repeat.unit}
                                        onChange={(e) =>
                                          updateStep(sectionIndex, stepIndex, {
                                            repeat: {
                                              ...step.repeat!,
                                              unit: e.target.value as RepeatUnit,
                                            },
                                          })
                                        }
                                        className="px-2 py-1 bg-white rounded-lg text-sm text-[#2C1810] border border-[#2C1810]/10"
                                      >
                                        {REPEAT_UNITS.map((u) => (
                                          <option key={u.value} value={u.value}>
                                            {u.label}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        onClick={() =>
                                          updateStep(sectionIndex, stepIndex, { repeat: null })
                                        }
                                        className="text-[#2C1810]/30 hover:text-red-400 p-0.5"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        updateStep(sectionIndex, stepIndex, {
                                          repeat: { times: 2, unit: 'rounds' },
                                        })
                                      }
                                      className="flex items-center gap-1 text-xs text-[#2C1810]/40 hover:text-[#B8A9C9] transition-colors"
                                    >
                                      <Repeat className="w-3 h-3" />
                                      + Repeat
                                    </button>
                                  )}
                                </div>

                                <button
                                  onClick={() => deleteStep(sectionIndex, stepIndex)}
                                  className="mt-2 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>

                        {/* Add step button */}
                        <button
                          onClick={() => addStep(sectionIndex)}
                          className="w-full py-2 text-[#E86A58] text-sm font-medium hover:bg-[#E86A58]/5 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Step
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Pattern Abbreviations */}
            {onAbbreviationsChange && (
              <div className="bg-white rounded-2xl border border-[#2C1810]/10 overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 bg-[#FFF8F0] cursor-pointer"
                  onClick={() => setShowAbbreviations(!showAbbreviations)}
                >
                  <button className="text-[#2C1810]/60">
                    {showAbbreviations ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <BookOpen className="w-4 h-4 text-[#B8A9C9]" />
                  <span className="flex-1 font-medium text-[#2C1810]">
                    Pattern Abbreviations
                  </span>
                  {Object.keys(abbreviations).length > 0 && (
                    <span className="text-xs text-[#B8A9C9] font-medium">
                      {Object.keys(abbreviations).length} custom
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {showAbbreviations && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        {/* Add new abbreviation */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newAbbrevCode}
                            onChange={(e) => setNewAbbrevCode(e.target.value)}
                            placeholder="Abbrev"
                            className="w-24 px-3 py-2 bg-[#FFF8F0] rounded-lg text-sm text-[#2C1810] placeholder:text-[#2C1810]/50 font-mono"
                          />
                          <input
                            type="text"
                            value={newAbbrevDef}
                            onChange={(e) => setNewAbbrevDef(e.target.value)}
                            placeholder="Definition"
                            onKeyDown={(e) => e.key === 'Enter' && addAbbreviation()}
                            className="flex-1 px-3 py-2 bg-[#FFF8F0] rounded-lg text-sm text-[#2C1810] placeholder:text-[#2C1810]/50"
                          />
                          <button
                            onClick={addAbbreviation}
                            disabled={!newAbbrevCode.trim() || !newAbbrevDef.trim()}
                            className="px-3 py-2 bg-[#E86A58] text-white rounded-lg text-sm font-medium disabled:opacity-40"
                          >
                            Add
                          </button>
                        </div>

                        {/* Custom abbreviations list */}
                        {Object.keys(abbreviations).length > 0 && (
                          <div className="space-y-1">
                            {Object.entries(abbreviations).map(([code, def]) => (
                              <div
                                key={code}
                                className="flex items-center gap-2 px-3 py-2 bg-[#FFF8F0] rounded-lg"
                              >
                                <span className="font-mono font-medium text-[#E86A58] text-sm w-20 flex-shrink-0">
                                  {code}
                                </span>
                                <span className="flex-1 text-sm text-[#2C1810]/70 truncate">
                                  {def}
                                </span>
                                <button
                                  onClick={() => removeAbbreviation(code)}
                                  className="text-[#2C1810]/30 hover:text-red-400 p-1 flex-shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Built-in abbreviations reference */}
                        <div className="border-t border-[#2C1810]/10 pt-3">
                          <button
                            onClick={() => setShowBuiltins(!showBuiltins)}
                            className="flex items-center gap-1 text-xs text-[#2C1810]/50 hover:text-[#2C1810]/70"
                          >
                            {showBuiltins ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                            Built-in abbreviations ({Object.keys(DEFAULT_ABBREVIATIONS).length})
                          </button>
                          {showBuiltins && (
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
                              {Object.entries(DEFAULT_ABBREVIATIONS).map(([code, def]) => (
                                <div key={code} className="flex gap-1.5 text-xs py-0.5">
                                  <span className="font-mono text-[#E86A58] font-medium w-12 flex-shrink-0">
                                    {code}
                                  </span>
                                  <span className="text-[#2C1810]/50 truncate">{def}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Add section button */}
            <button
              onClick={addSection}
              className="w-full py-3 bg-white border-2 border-dashed border-[#2C1810]/20 text-[#2C1810]/60 rounded-xl font-medium hover:border-[#E86A58] hover:text-[#E86A58] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Section
            </button>
          </div>
        )}
      </main>

      {/* Version History sidebar */}
      <AnimatePresence>
        {showVersionHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVersionHistory(false)}
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
                <h2 className="font-semibold text-[#2C1810]">Version History</h2>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="p-2 text-[#2C1810]/65"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {loadingVersions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-2 border-[#E86A58]/20 border-t-[#E86A58] animate-spin" />
                  </div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-8 h-8 text-[#2C1810]/20 mx-auto mb-2" />
                    <p className="text-sm text-[#2C1810]/50">No versions saved yet</p>
                    <p className="text-xs text-[#2C1810]/40 mt-1">Versions are auto-saved when you edit</p>
                  </div>
                ) : (
                  versions.map((version) => (
                    <div
                      key={version.id}
                      className="bg-[#FFF8F0] rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#2C1810]">
                          {version.savedAt.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-xs text-[#2C1810]/50">
                          {version.sections.length} section{version.sections.length !== 1 ? 's' : ''},
                          {' '}{version.sections.reduce((s, sec) => s + sec.steps.length, 0)} steps
                        </span>
                      </div>
                      {version.changeDescription && (
                        <p className="text-xs text-[#2C1810]/60">{version.changeDescription}</p>
                      )}
                      {onRestoreVersion && (
                        <button
                          onClick={async () => {
                            if (!confirm('Restore this version? Your current changes will be auto-saved first.')) return;
                            setRestoringVersionId(version.id);
                            try {
                              await onRestoreVersion(version.id);
                              setShowVersionHistory(false);
                            } catch {
                              alert('Failed to restore version');
                            } finally {
                              setRestoringVersionId(null);
                            }
                          }}
                          disabled={restoringVersionId === version.id}
                          className="flex items-center gap-1 text-sm text-[#E86A58] font-medium hover:text-[#D35A4A] disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {restoringVersionId === version.id ? 'Restoring...' : 'Restore'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
