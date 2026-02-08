import { useState } from 'react';
import { Plus, Trash2, Eraser, PaintBucket } from 'lucide-react';
import type { C2CColor } from './c2cAlgorithm';

interface C2CControlsProps {
  width: number;
  height: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  palette: C2CColor[];
  activeColor: number;
  onActiveColorChange: (index: number) => void;
  onAddColor: (color: C2CColor) => void;
  onRemoveColor: (index: number) => void;
  onClear: () => void;
  onFill: () => void;
}

export function C2CControls({
  width,
  height,
  onWidthChange,
  onHeightChange,
  palette,
  activeColor,
  onActiveColorChange,
  onAddColor,
  onRemoveColor,
  onClear,
  onFill,
}: C2CControlsProps) {
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#6366F1');

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    onAddColor({ name: newColorName.trim(), hex: newColorHex });
    setNewColorName('');
    setNewColorHex('#6366F1');
    setShowAddColor(false);
  };

  const clamp = (val: number) => Math.max(1, Math.min(50, val));

  return (
    <div className="space-y-4">
      {/* Dimensions */}
      <div>
        <label className="text-sm font-medium text-[#2C1810] mb-1.5 block">Grid Size</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={50}
            value={width}
            onChange={(e) => onWidthChange(clamp(Number(e.target.value) || 1))}
            className="w-20 px-3 py-2 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
          />
          <span className="text-[#2C1810]/50 text-sm">×</span>
          <input
            type="number"
            min={1}
            max={50}
            value={height}
            onChange={(e) => onHeightChange(clamp(Number(e.target.value) || 1))}
            className="w-20 px-3 py-2 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
          />
          <span className="text-[#2C1810]/40 text-xs ml-1">max 50×50</span>
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="text-sm font-medium text-[#2C1810] mb-1.5 block">Colors</label>
        <div className="flex flex-wrap gap-2">
          {palette.map((color, i) => (
            <button
              key={i}
              onClick={() => onActiveColorChange(i)}
              className={`relative group w-10 h-10 rounded-xl border-2 transition-all ${
                i === activeColor
                  ? 'border-[#E86A58] ring-2 ring-[#E86A58]/30 scale-110'
                  : 'border-[#2C1810]/10 hover:border-[#2C1810]/30'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {/* Remove button */}
              {palette.length > 2 && i !== activeColor && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveColor(i);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          ))}

          {/* Add color button */}
          <button
            onClick={() => setShowAddColor(!showAddColor)}
            className="w-10 h-10 rounded-xl border-2 border-dashed border-[#2C1810]/20 hover:border-[#E86A58]/50 flex items-center justify-center text-[#2C1810]/40 hover:text-[#E86A58] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Active color name */}
        <p className="text-xs text-[#2C1810]/50 mt-1.5">
          Selected: <span className="font-medium text-[#2C1810]/70">{palette[activeColor]?.name}</span>
        </p>

        {/* Add color form */}
        {showAddColor && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Color name"
              className="flex-1 px-3 py-2 bg-[#FFF8F0] rounded-xl text-[#2C1810] text-sm focus:outline-none focus:ring-2 focus:ring-[#E86A58]/50 border border-[#2C1810]/10"
              onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
            />
            <button
              onClick={handleAddColor}
              disabled={!newColorName.trim()}
              className="px-3 py-2 bg-[#E86A58] text-white text-sm rounded-xl font-medium disabled:opacity-40"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#FFF8F0] text-[#2C1810]/70 hover:bg-[#F5E6E0] rounded-xl text-sm transition-colors border border-[#2C1810]/10"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>
        <button
          onClick={onFill}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#FFF8F0] text-[#2C1810]/70 hover:bg-[#F5E6E0] rounded-xl text-sm transition-colors border border-[#2C1810]/10"
        >
          <PaintBucket className="w-3.5 h-3.5" />
          Fill All
        </button>
      </div>
    </div>
  );
}
