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
  phase: 'increase' | 'maintain' | 'decrease';
  side: 'RS' | 'WS';
  direction: '↙' | '↗';
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
  const H = grid.length;
  const W = H > 0 ? grid[0].length : 0;
  const totalDiagonals = W + H - 1;
  const usedColors = new Set<number>();
  const diagonals: C2CDiagonal[] = [];

  const minDim = Math.min(W, H);
  const maxDim = Math.max(W, H);

  for (let d = 1; d <= totalDiagonals; d++) {
    // Anti-diagonal sum: d=1 → bottom-right, d=totalDiagonals → top-left
    const s = H + W - 1 - d;
    const rowMin = Math.max(0, s - (W - 1));
    const rowMax = Math.min(H - 1, s);

    // Direction alternation
    const isOdd = d % 2 === 1;
    const side: 'RS' | 'WS' = isOdd ? 'RS' : 'WS';
    const direction: '↙' | '↗' = isOdd ? '↙' : '↗';

    // Phase
    let phase: 'increase' | 'maintain' | 'decrease';
    if (d <= minDim) {
      phase = 'increase';
    } else if (d <= maxDim) {
      phase = 'maintain';
    } else {
      phase = 'decrease';
    }

    // Collect cells in traversal order
    const cells: Array<{ row: number; col: number }> = [];
    if (isOdd) {
      // RS ↙: rowMin → rowMax (top-right to bottom-left)
      for (let r = rowMin; r <= rowMax; r++) {
        cells.push({ row: r, col: s - r });
      }
    } else {
      // WS ↗: rowMax → rowMin (bottom-left to top-right)
      for (let r = rowMax; r >= rowMin; r--) {
        cells.push({ row: r, col: s - r });
      }
    }

    // Run-length encoding
    const blocks: C2CBlock[] = [];
    let currentColorIdx = -1;
    let currentCount = 0;

    for (const cell of cells) {
      const colorIdx = grid[cell.row][cell.col];
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

    if (currentCount > 0) {
      blocks.push({
        colorName: palette[currentColorIdx]?.name ?? `Color ${currentColorIdx}`,
        count: currentCount,
      });
    }

    diagonals.push({
      number: d,
      totalTiles: cells.length,
      blocks,
      phase,
      side,
      direction,
    });
  }

  const colors = Array.from(usedColors).map(
    (i) => palette[i] ?? { name: `Color ${i}`, hex: '#888888' }
  );

  return { width: W, height: H, colors, diagonals };
}

// ─── Text formatter ─────────────────────────────────────

export function formatC2CText(instructions: C2CInstructions): string {
  const lines: string[] = [];
  const { width: W, height: H, diagonals } = instructions;
  const totalRows = diagonals.length;
  const minDim = Math.min(W, H);
  const maxDim = Math.max(W, H);

  lines.push(`C2C Pattern — ${W} × ${H}`);
  lines.push(`Total rows: ${totalRows}`);
  lines.push('');
  lines.push('Each block = ch 6, dc in 4th ch from hook, dc in next 2 ch.');
  lines.push(
    'Color changes: Always change color on the last yarn over of the previous block\'s last dc.'
  );
  lines.push('');

  // Row 1 stitch instruction
  lines.push('Row 1: Ch 6, dc in 4th ch from hook, dc in next 2 ch.');
  lines.push(
    'Increase rows: Turn. Ch 6, dc in 4th ch from hook, dc in next 2 ch, [sl st in next ch-3 sp, ch 3, 3 dc in same sp] for remaining blocks.'
  );
  lines.push(
    'Decrease rows: Turn. Sl st across first block, sl st into ch-3 sp, ch 3, 3 dc in same sp, [sl st in next ch-3 sp, ch 3, 3 dc in same sp] for remaining blocks.'
  );
  lines.push('');

  // Group by phase
  const phases: Array<{ label: string; start: number; end: number }> = [];
  phases.push({ label: 'Increase', start: 1, end: minDim });
  if (minDim < maxDim) {
    phases.push({ label: 'Maintain', start: minDim + 1, end: maxDim });
  }
  phases.push({ label: 'Decrease', start: maxDim + 1, end: totalRows });

  for (const phase of phases) {
    if (phase.start > phase.end) continue;
    lines.push(`--- ${phase.label} rows (${phase.start}–${phase.end}) ---`);

    for (const diag of diagonals) {
      if (diag.number < phase.start || diag.number > phase.end) continue;

      const blocksStr = diag.blocks
        .map((b) => `(${b.colorName}) x ${b.count}`)
        .join(', ');

      lines.push(
        `${diag.direction} Row ${diag.number} [${diag.side}]: ${blocksStr} (${diag.totalTiles} block${diag.totalTiles !== 1 ? 's' : ''})`
      );
    }
    lines.push('');
  }

  // Summary
  lines.push('--- Summary ---');
  lines.push(`Total rows: ${totalRows}`);
  lines.push(`Increase: rows 1–${minDim}`);
  if (minDim < maxDim) {
    lines.push(`Maintain: rows ${minDim + 1}–${maxDim}`);
  }
  if (maxDim + 1 <= totalRows) {
    lines.push(`Decrease: rows ${maxDim + 1}–${totalRows}`);
  }

  // Blocks per color
  const colorCounts: Record<string, number> = {};
  for (const diag of diagonals) {
    for (const block of diag.blocks) {
      colorCounts[block.colorName] = (colorCounts[block.colorName] || 0) + block.count;
    }
  }
  lines.push('');
  lines.push('Blocks per color:');
  for (const [name, count] of Object.entries(colorCounts)) {
    lines.push(`  ${name}: ${count} block${count !== 1 ? 's' : ''}`);
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
      .map((b) => `(${b.colorName}) x ${b.count}`)
      .join(', ');

    return {
      kind: 'row' as const,
      label: `${diag.direction} Row ${diag.number} [${diag.side}]`,
      instruction: blocksStr,
      stitchCountEnd: diag.totalTiles,
      repeat: null,
      trackable: true,
    };
  });

  const { width: W, height: H } = instructions;
  const minDim = Math.min(W, H);
  const maxDim = Math.max(W, H);
  const totalRows = instructions.diagonals.length;

  let phaseNote = `Increase: rows 1–${minDim}`;
  if (minDim < maxDim) phaseNote += `, Maintain: rows ${minDim + 1}–${maxDim}`;
  if (maxDim + 1 <= totalRows) phaseNote += `, Decrease: rows ${maxDim + 1}–${totalRows}`;

  const sections: PatternSection[] = [
    {
      name: 'C2C Pattern',
      repeatCount: 1,
      notes: `${W} × ${H} grid (${totalRows} rows). ${phaseNote}. Each block = ch 6, dc in 4th ch from hook, dc in next 2 ch. Color changes on last yo of previous block's last dc.`,
      steps,
    },
  ];

  const abbreviations: Record<string, string> = {
    C2C: 'Corner to Corner (diagonal box stitch)',
    ch: 'chain',
    dc: 'double crochet',
    'sl st': 'slip stitch',
    RS: 'Right Side',
    WS: 'Wrong Side',
    yo: 'yarn over',
    sp: 'space',
  };

  return { sections, abbreviations };
}

// ─── Helpers ────────────────────────────────────────────

export function createEmptyGrid(width: number, height: number): number[][] {
  return Array.from({ length: height }, () => Array(width).fill(0));
}
