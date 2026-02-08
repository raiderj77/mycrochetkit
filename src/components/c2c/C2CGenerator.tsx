import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Check, Save, Sparkles } from 'lucide-react';
import { C2CGrid } from './C2CGrid';
import { C2CControls } from './C2CControls';
import {
  DEFAULT_PALETTE,
  createEmptyGrid,
  generateC2CInstructions,
  formatC2CText,
  c2cToPatternSections,
} from './c2cAlgorithm';
import type { C2CColor, C2CInstructions } from './c2cAlgorithm';
import { usePatterns } from '../../hooks/usePatterns';
import type { PatternFormData } from '../../types/pattern';

interface C2CGeneratorProps {
  uid: string;
  onBack: () => void;
}

export function C2CGenerator({ uid, onBack }: C2CGeneratorProps) {
  const navigate = useNavigate();
  const { createPattern } = usePatterns(uid);

  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(10, 10));
  const [palette, setPalette] = useState<C2CColor[]>([...DEFAULT_PALETTE]);
  const [activeColor, setActiveColor] = useState(0);
  const [instructions, setInstructions] = useState<C2CInstructions | null>(null);
  const [formattedText, setFormattedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [patternName, setPatternName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  // Mutable grid ref for drag-painting performance
  const gridRef = useRef(grid);
  gridRef.current = grid;

  const handleWidthChange = (w: number) => {
    setWidth(w);
    setGrid((prev) => {
      const newGrid = Array.from({ length: height }, (_, r) =>
        Array.from({ length: w }, (_, c) => (r < prev.length && c < (prev[0]?.length ?? 0) ? prev[r][c] : 0))
      );
      return newGrid;
    });
    setInstructions(null);
    setSavedId(null);
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    setGrid((prev) => {
      const newGrid = Array.from({ length: h }, (_, r) =>
        Array.from({ length: width }, (_, c) => (r < prev.length && c < (prev[0]?.length ?? 0) ? prev[r][c] : 0))
      );
      return newGrid;
    });
    setInstructions(null);
    setSavedId(null);
  };

  const handleCellPaint = useCallback((row: number, col: number) => {
    setGrid((prev) => {
      if (prev[row][col] === activeColor) return prev;
      const next = prev.map((r, ri) =>
        ri === row ? r.map((c, ci) => (ci === col ? activeColor : c)) : r
      );
      return next;
    });
  }, [activeColor]);

  const handlePaintEnd = useCallback(() => {
    // Instructions are stale after painting
    setInstructions(null);
    setSavedId(null);
  }, []);

  const handleAddColor = (color: C2CColor) => {
    setPalette((prev) => [...prev, color]);
  };

  const handleRemoveColor = (index: number) => {
    // Remap grid cells that used this color to 0
    setGrid((prev) =>
      prev.map((row) =>
        row.map((c) => {
          if (c === index) return 0;
          if (c > index) return c - 1;
          return c;
        })
      )
    );
    setPalette((prev) => prev.filter((_, i) => i !== index));
    if (activeColor >= index && activeColor > 0) {
      setActiveColor(activeColor - 1);
    }
    setInstructions(null);
    setSavedId(null);
  };

  const handleClear = () => {
    setGrid(createEmptyGrid(width, height));
    setInstructions(null);
    setSavedId(null);
  };

  const handleFill = () => {
    setGrid(Array.from({ length: height }, () => Array(width).fill(activeColor)));
    setInstructions(null);
    setSavedId(null);
  };

  const handleGenerate = () => {
    const result = generateC2CInstructions(grid, palette);
    setInstructions(result);
    setFormattedText(formatC2CText(result));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = formattedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    if (!patternName.trim()) {
      setSaveError('Please enter a pattern name.');
      return;
    }
    if (!instructions) return;

    setSaving(true);
    setSaveError('');

    try {
      const { sections, abbreviations } = c2cToPatternSections(instructions);
      const formData: PatternFormData = {
        name: patternName.trim(),
        type: 'blanket',
        materials: [],
        tags: ['c2c', 'generated'],
        source: { type: 'generated' },
        sections,
        abbreviations,
        notes: `Generated C2C pattern — ${width} × ${height} grid.`,
      };

      const pattern = await createPattern(formData);
      if (pattern) {
        setSavedId(pattern.id);
      } else {
        setSaveError('Failed to save pattern. Check your connection or pattern limit.');
      }
    } catch {
      setSaveError('Failed to save pattern.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#2C1810]/5">
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-[#2C1810]/10 flex items-center justify-center text-[#2C1810]/60 hover:text-[#2C1810] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-semibold text-[#2C1810] text-lg tracking-tight">
            C2C Pattern Generator
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Controls + Grid */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#2C1810]/5 p-5">
              <C2CControls
                width={width}
                height={height}
                onWidthChange={handleWidthChange}
                onHeightChange={handleHeightChange}
                palette={palette}
                activeColor={activeColor}
                onActiveColorChange={setActiveColor}
                onAddColor={handleAddColor}
                onRemoveColor={handleRemoveColor}
                onClear={handleClear}
                onFill={handleFill}
              />
            </div>

            <C2CGrid
              grid={grid}
              palette={palette}
              onCellPaint={handleCellPaint}
              onPaintEnd={handlePaintEnd}
            />

            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E86A58] hover:bg-[#D35A4A] text-white font-medium rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate C2C Instructions
            </button>
          </div>

          {/* Right Column: Output */}
          <AnimatePresence mode="wait">
            {instructions ? (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Instructions */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#2C1810]/5 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#2C1810]">Instructions</h2>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F0] text-[#2C1810]/70 hover:bg-[#F5E6E0] rounded-lg text-sm transition-colors border border-[#2C1810]/10"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#7FBFA0]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-sm text-[#2C1810]/80 whitespace-pre-wrap font-mono bg-[#FFF8F0] rounded-xl p-4 max-h-[50vh] overflow-auto border border-[#2C1810]/5">
                    {formattedText}
                  </pre>
                </div>

                {/* Save as Pattern */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#2C1810]/5 p-5">
                  <h2 className="font-semibold text-[#2C1810] mb-3">Save as Pattern</h2>

                  {savedId ? (
                    <div className="space-y-3">
                      <p className="text-sm text-[#7FBFA0] font-medium">
                        Pattern saved successfully!
                      </p>
                      <button
                        onClick={() => navigate(`/patterns/${savedId}/edit`)}
                        className="w-full px-4 py-2.5 bg-[#E86A58] hover:bg-[#D35A4A] text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        Open in Step Editor
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={patternName}
                        onChange={(e) => {
                          setPatternName(e.target.value);
                          setSaveError('');
                        }}
                        placeholder="Pattern name"
                        className="w-full px-4 py-2.5 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm placeholder:text-[#2C1810]/40 focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
                      />
                      {saveError && (
                        <p className="text-sm text-red-500">{saveError}</p>
                      )}
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#B8A9C9] hover:bg-[#A899B9] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save to Pattern Library'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex items-center justify-center h-full"
              >
                <div className="text-center text-[#2C1810]/40">
                  <div className="text-4xl mb-3">🎨</div>
                  <p className="text-sm">Paint your grid, then generate instructions</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
