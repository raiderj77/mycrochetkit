import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Shuffle, Palette, Plus, X } from 'lucide-react';

interface LayoutConfig {
  rows: number;
  cols: number;
  colors: string[];
  grid: string[][];
}

interface GrannySquareLayoutProps {
  projectId: string;
  onSave: (data: LayoutConfig) => void;
  initialConfig?: LayoutConfig;
}

const PRESET_PALETTES: { name: string; colors: string[] }[] = [
  { name: 'Autumn', colors: ['#8B4513', '#D2691E', '#DAA520', '#B8860B', '#F4A460', '#CD853F'] },
  { name: 'Ocean', colors: ['#0c4a6e', '#0369a1', '#0ea5e9', '#67e8f9', '#ecfeff', '#164e63'] },
  { name: 'Garden', colors: ['#166534', '#22c55e', '#a3e635', '#fbbf24', '#f472b6', '#7c3aed'] },
  { name: 'Berry', colors: ['#581c87', '#9333ea', '#c084fc', '#f0abfc', '#fda4af', '#fb7185'] },
  { name: 'Retro', colors: ['#ea580c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa', '#f472b6'] },
  { name: 'Neutral', colors: ['#292524', '#57534e', '#a8a29e', '#d6d3d1', '#f5f5f4', '#78716c'] },
];

function makeGrid(rows: number, cols: number, colors: string[]): string[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)])
  );
}

export function GrannySquareLayout({ projectId: _projectId, onSave, initialConfig }: GrannySquareLayoutProps) {
  const [rows, setRows] = useState(initialConfig?.rows || 6);
  const [cols, setCols] = useState(initialConfig?.cols || 8);
  const [colors, setColors] = useState<string[]>(initialConfig?.colors || PRESET_PALETTES[0].colors);
  const [grid, setGrid] = useState<string[][]>(initialConfig?.grid || makeGrid(6, 8, PRESET_PALETTES[0].colors));
  const [activeColor, setActiveColor] = useState<string>(colors[0]);
  const [newColor, setNewColor] = useState('#e86a58');

  const save = useCallback((g: string[][], c: string[]) => {
    onSave({ rows, cols, colors: c, grid: g });
  }, [rows, cols, onSave]);

  const randomize = () => { const g = makeGrid(rows, cols, colors); setGrid(g); save(g, colors); };

  const paintSquare = (r: number, c: number) => {
    const g = grid.map((row) => [...row]);
    g[r][c] = activeColor;
    setGrid(g);
    save(g, colors);
  };

  const resizeGrid = (newRows: number, newCols: number) => {
    const g = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) => grid[r]?.[c] || colors[Math.floor(Math.random() * colors.length)])
    );
    setRows(newRows); setCols(newCols); setGrid(g); save(g, colors);
  };

  const addColor = () => {
    if (colors.includes(newColor)) return;
    const next = [...colors, newColor]; setColors(next); save(grid, next);
  };

  const removeColor = (hex: string) => {
    if (colors.length <= 2) return;
    const next = colors.filter((c) => c !== hex); setColors(next);
    if (activeColor === hex) setActiveColor(next[0]);
    save(grid, next);
  };

  const applyPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setColors(preset.colors); setActiveColor(preset.colors[0]);
    const g = makeGrid(rows, cols, preset.colors); setGrid(g); save(g, preset.colors);
  };

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    grid.forEach((row) => row.forEach((c) => { counts[c] = (counts[c] || 0) + 1; }));
    return counts;
  }, [grid]);

  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-[#B8A9C9]" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wider">Blanket Layout</span>
          </div>
          <motion.button onClick={randomize} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-white/60 hover:text-white text-xs font-medium" whileTap={{ scale: 0.95 }}>
            <Shuffle className="w-3.5 h-3.5" /> Randomize
          </motion.button>
        </div>
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: Math.min(cols * 48, 400) }}>
          {grid.map((row, ri) => row.map((color, ci) => (
            <motion.button key={`${ri}-${ci}`} className="aspect-square rounded-md border border-white/10 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color }} onClick={() => paintSquare(ri, ci)} whileTap={{ scale: 0.85 }} title={`Row ${ri + 1}, Col ${ci + 1}`} />
          )))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/40">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: activeColor }} />
          Tap a square to paint with selected color
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-[#E86A58]" />
          <span className="text-white/70 text-sm font-medium">Color Palette</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {colors.map((c) => (
            <motion.button key={c} onClick={() => setActiveColor(c)} className={`relative w-10 h-10 rounded-xl border-2 transition-all ${activeColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: c }} whileTap={{ scale: 0.9 }}>
              {activeColor === c && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />}
              <button onClick={(e) => { e.stopPropagation(); removeColor(c); }} className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </motion.button>
          ))}
          <div className="flex items-center gap-1">
            <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent" />
            <motion.button onClick={addColor} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white" whileTap={{ scale: 0.9 }}><Plus className="w-4 h-4" /></motion.button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_PALETTES.map((p) => (
            <button key={p.name} onClick={() => applyPreset(p)} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex">{p.colors.slice(0, 4).map((c) => (<div key={c} className="w-3 h-3 -ml-0.5 first:ml-0 rounded-sm" style={{ backgroundColor: c }} />))}</div>
              <span className="text-white/50 text-[10px]">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-white/50 text-xs mb-1 block">Rows</label>
            <input type="number" min={2} max={20} value={rows} onChange={(e) => resizeGrid(Math.max(2, Math.min(20, parseInt(e.target.value) || 2)), cols)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-white/50 text-xs mb-1 block">Columns</label>
            <input type="number" min={2} max={20} value={cols} onChange={(e) => resizeGrid(rows, Math.max(2, Math.min(20, parseInt(e.target.value) || 2)))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
          </div>
        </div>
        <div className="text-xs text-white/40">{rows * cols} total squares {'\u00B7'} {colors.length} colors</div>
        <div className="mt-3 space-y-1">
          {colors.map((c) => (
            <div key={c} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: c }} />
              <span className="text-white/50">{colorCounts[c] || 0} squares</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
