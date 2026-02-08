import { useRef, useEffect, useCallback } from 'react';
import type { C2CColor } from './c2cAlgorithm';

interface C2CGridProps {
  grid: number[][];
  palette: C2CColor[];
  activeColor: number;
  onCellPaint: (row: number, col: number) => void;
  onPaintEnd: () => void;
}

export function C2CGrid({ grid, palette, activeColor, onCellPaint, onPaintEnd }: C2CGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPainting = useRef(false);
  const cellSizeRef = useRef(24);

  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;

  const getCellSize = useCallback(() => {
    if (!containerRef.current) return 24;
    const containerW = containerRef.current.clientWidth;
    return Math.max(10, Math.min(32, Math.floor(containerW / width)));
  }, [width]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cs = getCellSize();
    cellSizeRef.current = cs;

    canvas.width = width * cs;
    canvas.height = height * cs;

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const color = palette[grid[r][c]];
        ctx.fillStyle = color?.hex ?? '#FFFFFF';
        ctx.fillRect(c * cs, r * cs, cs, cs);

        ctx.strokeStyle = 'rgba(44, 24, 16, 0.12)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(c * cs, r * cs, cs, cs);
      }
    }
  }, [grid, palette, width, height, getCellSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => observer.disconnect();
  }, [draw]);

  const getCellFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cs = cellSizeRef.current;
    const col = Math.floor(x / cs);
    const row = Math.floor(y / cs);
    if (row < 0 || row >= height || col < 0 || col >= width) return null;
    return [row, col];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isPainting.current = true;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const cell = getCellFromEvent(e);
    if (cell) onCellPaint(cell[0], cell[1]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPainting.current) return;
    const cell = getCellFromEvent(e);
    if (cell) onCellPaint(cell[0], cell[1]);
  };

  const handlePointerUp = () => {
    if (isPainting.current) {
      isPainting.current = false;
      onPaintEnd();
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-auto max-h-[60vh] rounded-xl border border-[#2C1810]/10 bg-white"
    >
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}
