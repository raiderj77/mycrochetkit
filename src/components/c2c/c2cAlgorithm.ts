import type { PatternSection, PatternStep } from '../../types/pattern';

// ─── Types ──────────────────────────────────────────────

export interface C2CColor {
  name: string;
  hex: string;
}

export interface C2CBlock {
  colorName: string;
  count: number;
}

export interface C2CDiagonal {
  number: number; // 1-indexed row number
  totalTiles: number;
  blocks: C2CBlock[];
}

export interface C2CInstructions {
  width: number;
  height: number;
  colors: C2CColor[];
  diagonals: C2CDiagonal[];
}

// ─── Default palette ────────────────────────────────────

export const DEFAULT_PALETTE: C2CColor[] = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Coral', hex: '#E86A58' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#7FBFA0' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Purple', hex: '#B8A9C9' },
  { name: 'Pink', hex: '#F9A8D4' },
];

// ─── Algorithm ──────────────────────────────────────────

export function generateC2CInstructions(
  grid: number[][],
  palette: C2CColor[]
): C2CInstructions {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  const totalDiagonals = width + height - 1;
  const usedColors = new Set<number>();
  const diagonals: C2CDiagonal[] = [];

  for (let d = 0; d < totalDiagonals; d++) {
    const rowMax = Math.min(d, height - 1);
    const rowMin = Math.max(0, d - width + 1);

    const blocks: C2CBlock[] = [];
    let currentColorIdx = -1;
    let currentCount = 0;

    // Traverse diagonal: top-right to bottom-left
    // In C2C, we work from the starting corner along each diagonal
    for (let row = rowMax; row >= rowMin; row--) {
      const col = d - row;
      const colorIdx = grid[row][col];
      usedColors.add(colorIdx);

      if (colorIdx === currentColorIdx) {
        currentCount++;
      } else {
        if (currentCount > 0) {
          blocks.push({
            colorName: palette[currentColorIdx]?.name ?? `Color ${currentColorIdx}`,
            count: currentCount,
          });
        }
        currentColorIdx = colorIdx;
        currentCount = 1;
      }
    }

    // Push last group
    if (currentCount > 0) {
      blocks.push({
        colorName: palette[currentColorIdx]?.name ?? `Color ${currentColorIdx}`,
        count: currentCount,
      });
    }

    diagonals.push({
      number: d + 1,
      totalTiles: rowMax - rowMin + 1,
      blocks,
    });
  }

  const colors = Array.from(usedColors).map((i) => palette[i] ?? { name: `Color ${i}`, hex: '#888888' });

  return { width, height, colors, diagonals };
}

// ─── Text formatter ─────────────────────────────────────

export function formatC2CText(instructions: C2CInstructions): string {
  const lines: string[] = [];
  const { width, height, diagonals } = instructions;
  const maxDiag = Math.min(width, height);

  lines.push(`C2C Pattern — ${width} × ${height}`);
  lines.push('');
  lines.push('Each "tile" = ch 6, dc in 4th ch from hook, dc in next 2 ch.');
  lines.push('Join tiles with sl st to adjacent tile, then ch 3 to start next tile.');
  lines.push('');

  for (const diag of diagonals) {
    const phase = diag.number <= maxDiag ? 'increase' : 'decrease';
    const blocksStr = diag.blocks
      .map((b) => `${b.count} ${b.colorName}`)
      .join(', ');
    lines.push(
      `Row ${diag.number} (${diag.totalTiles} tile${diag.totalTiles !== 1 ? 's' : ''}, ${phase}): ${blocksStr}`
    );
  }

  lines.push('');
  lines.push('Color Key:');
  for (const color of instructions.colors) {
    lines.push(`  ${color.name}: ${color.hex}`);
  }

  return lines.join('\n');
}

// ─── Convert to PatternSection[] for saving ─────────────

export function c2cToPatternSections(
  instructions: C2CInstructions
): { sections: PatternSection[]; abbreviations: Record<string, string> } {
  const steps: PatternStep[] = instructions.diagonals.map((diag) => {
    const blocksStr = diag.blocks
      .map((b) => `${b.count} ${b.colorName}`)
      .join(', ');

    return {
      kind: 'row' as const,
      label: `Row ${diag.number}`,
      instruction: blocksStr,
      stitchCountEnd: diag.totalTiles,
      repeat: null,
      trackable: true,
    };
  });

  const sections: PatternSection[] = [
    {
      name: 'C2C Pattern',
      repeatCount: 1,
      notes: `${instructions.width} × ${instructions.height} grid. Each tile = ch 6, dc in 4th ch from hook, dc in next 2 ch. Join tiles with sl st, ch 3 for next tile.`,
      steps,
    },
  ];

  const abbreviations: Record<string, string> = {
    C2C: 'Corner to Corner (diagonal box stitch)',
    ch: 'chain',
    dc: 'double crochet',
    'sl st': 'slip stitch',
  };

  return { sections, abbreviations };
}

// ─── Helpers ────────────────────────────────────────────

export function createEmptyGrid(width: number, height: number): number[][] {
  return Array.from({ length: height }, () => Array(width).fill(0));
}
