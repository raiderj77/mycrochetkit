// src/types/pattern.ts
// MyCrochetKit Pattern Library - Data Model Types

// ─── Enums ───────────────────────────────────────────────

export type PatternType =
  | 'plushie'
  | 'applique'
  | 'blanket'
  | 'garment'
  | 'hat'
  | 'scarf'
  | 'bag'
  | 'amigurumi'
  | 'other';

export type Difficulty = 'beginner' | 'easy' | 'intermediate' | 'advanced';

export type YarnWeight =
  | 'lace'
  | 'fingering'
  | 'sport'
  | 'dk'
  | 'worsted'
  | 'bulky'
  | 'super_bulky';

export type PatternSourceType = 'link' | 'pdf' | 'typed' | 'generated';

export type PatternRights = 'personal_use' | 'my_original' | 'public_domain';

export type StepKind = 'round' | 'row' | 'repeat' | 'instruction' | 'note';

export type RepeatUnit = 'stitchGroup' | 'rows' | 'rounds';

export type SyncStatus = 'synced' | 'pending' | 'conflict';

// ─── Inline Counter ──────────────────────────────────────

export interface InlineCounter {
  id: string;
  label: string;
  current: number;
  target: number | null;
  resetOnAdvance: boolean;
  voiceEnabled: boolean;
}

// ─── Step ────────────────────────────────────────────────

export interface PatternStep {
  kind: StepKind;
  label: string;
  instruction: string;
  stitchCountEnd: number | null;
  repeat: {
    times: number;
    unit: RepeatUnit;
  } | null;
  trackable: boolean;
  userNote?: string;
  isDifficult?: boolean;
  inlineCounters?: InlineCounter[];
  modification?: string | null;
  originalInstruction?: string | null;
}

// ─── Section ─────────────────────────────────────────────

export interface PatternSection {
  name: string;
  repeatCount: number;
  notes?: string;
  steps: PatternStep[];
}

// ─── Pattern Source ──────────────────────────────────────

export interface PatternSource {
  type: PatternSourceType;
  url?: string;
  fileRef?: string;
  content?: string;
}

// ─── Pattern Document ────────────────────────────────────

export interface Pattern {
  id: string;
  name: string;
  type: PatternType;
  difficulty?: Difficulty;
  hookSize?: string;
  yarnWeight?: YarnWeight;
  gaugeNotes?: string;
  materials: string[];
  tags: string[];
  source: PatternSource;
  rights?: PatternRights;
  sections: PatternSection[];
  abbreviations: Record<string, string>;
  finishedSize?: string;
  estimatedTime?: string;
  notes?: string;
  isGenerated: boolean;
  generationPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Pattern Version ─────────────────────────────────────

export interface PatternVersion {
  id: string;
  patternId: string;
  sections: PatternSection[];
  abbreviations: Record<string, string>;
  notes?: string;
  savedAt: Date;
  changeDescription?: string;
}

// ─── Form types ──────────────────────────────────────────

export interface PatternFormData {
  name: string;
  type: PatternType;
  difficulty?: Difficulty;
  hookSize?: string;
  yarnWeight?: YarnWeight;
  gaugeNotes?: string;
  materials: string[];
  tags: string[];
  source: PatternSource;
  rights?: PatternRights;
  sections: PatternSection[];
  abbreviations: Record<string, string>;
  finishedSize?: string;
  estimatedTime?: string;
  notes?: string;
}

// ─── Project-Pattern Link ────────────────────────────────

export interface PatternProgress {
  currentSectionIndex: number;
  currentStepIndex: number;
  completedSections: string[];
  sectionRepeatCounts: Record<number, number>;
}

export interface StepAnnotation {
  userNote?: string;
  isDifficult?: boolean;
  modification?: string | null;
  originalInstruction?: string | null;
  inlineCounters?: InlineCounter[];
}

export interface ProjectPatternFields {
  patternId: string | null;
  patternProgress: PatternProgress | null;
  stepAnnotations: Record<string, StepAnnotation>;
  sectionNotes: Record<number, string>;
}

// ─── Default values ──────────────────────────────────────

export const DEFAULT_PATTERN_PROGRESS: PatternProgress = {
  currentSectionIndex: 0,
  currentStepIndex: 0,
  completedSections: [],
  sectionRepeatCounts: {},
};

export const DEFAULT_PROJECT_PATTERN_FIELDS: ProjectPatternFields = {
  patternId: null,
  patternProgress: null,
  stepAnnotations: {},
  sectionNotes: {},
};

// ─── Default abbreviations ───────────────────────────────

export const DEFAULT_ABBREVIATIONS: Record<string, string> = {
  ch: 'chain',
  sl_st: 'slip stitch',
  sc: 'single crochet',
  hdc: 'half double crochet',
  dc: 'double crochet',
  tr: 'treble crochet',
  dtr: 'double treble crochet',
  inc: 'increase (2 stitches in one)',
  dec: 'decrease (2 stitches together)',
  sc2tog: 'single crochet 2 together',
  dc2tog: 'double crochet 2 together',
  MR: 'magic ring',
  FO: 'fasten off',
  BLO: 'back loop only',
  FLO: 'front loop only',
  sk: 'skip',
  sp: 'space',
  st: 'stitch',
  sts: 'stitches',
  rnd: 'round',
  RS: 'right side',
  WS: 'wrong side',
  yo: 'yarn over',
  rep: 'repeat',
  tog: 'together',
  prev: 'previous',
  rem: 'remaining',
  beg: 'beginning',
  cont: 'continue',
  alt: 'alternate',
  approx: 'approximately',
  pm: 'place marker',
  sm: 'slip marker',
  tch: 'turning chain',
  fpdc: 'front post double crochet',
  bpdc: 'back post double crochet',
  fpsc: 'front post single crochet',
  bpsc: 'back post single crochet',
  popc: 'popcorn stitch',
  puff: 'puff stitch',
  bob: 'bobble',
  cl: 'cluster',
  lp: 'loop',
};

// ─── IndexedDB offline wrapper type ─────────────────────

export interface OfflinePattern extends Pattern {
  syncStatus: SyncStatus;
  lastSyncedAt: Date | null;
}

export interface OfflineProjectPatternFields extends ProjectPatternFields {
  syncStatus: SyncStatus;
}
