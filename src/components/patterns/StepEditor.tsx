import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import type { PatternSection, PatternStep, StepKind } from '../../types/pattern';

const STEP_KINDS: { value: StepKind; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'row', label: 'Row' },
  { value: 'instruction', label: 'Instruction' },
  { value: 'repeat', label: 'Repeat' },
  { value: 'note', label: 'Note' },
];

interface StepEditorProps {
  sections: PatternSection[];
  onChange: (sections: PatternSection[]) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function StepEditor({ sections, onChange, onSave, onCancel, saving }: StepEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

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
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1 text-[#E86A58] font-medium disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
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
    </div>
  );
}
