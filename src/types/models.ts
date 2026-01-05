/**
 * Core Data Models for CrochetFlow
 * 
 * These TypeScript interfaces define the shape of all data stored in IndexedDB
 * and synced to Firebase. Following the specification from the master doc.
 */

// ============================================================================
// YARN & MATERIALS
// ============================================================================

export type YarnWeight = 
  | 'lace' 
  | 'fingering' 
  | 'sport' 
  | 'dk' 
  | 'worsted' 
  | 'aran' 
  | 'bulky' 
  | 'super-bulky' 
  | 'jumbo';

export interface YarnStash {
  id: string;
  brand: string;
  line?: string; // e.g., "Simply Soft" within Caron brand
  colorway: string;
  colorHex?: string; // extracted from photo
  weight: YarnWeight;
  fiber: string; // e.g., "100% Acrylic", "Wool Blend"
  yardagePerSkein: number;
  gramsPerSkein: number;
  skeinsOwned: number;
  yardageRemaining: number; // calculated or manual
  dyeLot?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  purchaseLocation?: string;
  storageLocation?: string; // e.g., "Bin 3, Shelf 2, Closet"
  photo?: string; // base64 or blob URL
  barcode?: string; // UPC for quick scanning
  ravelryId?: string; // for integration
  notes: string;
  tags: string[];
  hookRecommendation?: string; // e.g., "H/8 (5mm)"
  careInstructions?: string;
  isDiscontinued: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface YarnAllocation {
  yarnId: string; // reference to YarnStash
  skeinsUsed: number;
  yardageUsed: number;
  notes?: string;
}

export interface Material {
  name: string; // e.g., "Safety eyes", "Stuffing", "Stitch markers"
  quantity?: string;
  size?: string;
  notes?: string;
}

// ============================================================================
// COUNTERS
// ============================================================================

export type CounterType = 'row' | 'stitch' | 'repeat' | 'custom';

export interface Reminder {
  id: string;
  triggerAt: number; // counter value to trigger at
  message: string;
  completed: boolean;
}

export interface CounterHistoryEntry {
  timestamp: Date;
  previousValue: number;
  newValue: number;
  action: 'increment' | 'decrement' | 'set' | 'reset';
}

export interface Counter {
  id: string;
  name: string;
  current: number;
  target?: number;
  linkedTo?: string; // another counter ID for linked counting
  type: CounterType;
  reminders: Reminder[];
  history: CounterHistoryEntry[]; // for undo functionality
  colorCode?: string; // for visual distinction
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PATTERNS
// ============================================================================

export type SkillLevel = 
  | 'beginner' 
  | 'easy' 
  | 'intermediate' 
  | 'advanced' 
  | 'expert';

export type PatternSource = 
  | 'pdf' 
  | 'url' 
  | 'manual' 
  | 'ribblr' 
  | 'ravelry' 
  | 'etsy';

export interface Size {
  id: string;
  name: string; // e.g., "Small", "Medium", "Child 4-6"
  measurements?: string;
  notes?: string;
}

export interface Abbreviation {
  abbr: string; // e.g., "sc"
  full: string; // e.g., "single crochet"
  description?: string;
  videoUrl?: string;
}

export interface UserNote {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instruction {
  id: string;
  text: string;
  sizeVariants: { [sizeId: string]: string }; // size-specific variations
  abbreviations: string[]; // detected abbreviations for inline help
  rowNumber?: number;
  repeatCount?: number;
  stitchCount?: number; // expected stitch count at end
  notes: UserNote[];
  videoTimestamp?: number; // link to tutorial video position
  isCompleted: boolean;
}

export interface PatternSection {
  id: string;
  name: string; // e.g., "Head", "Body", "Assembly"
  instructions: Instruction[];
  currentPosition?: number; // user's progress marker (instruction index)
  isCompleted: boolean;
  notes: UserNote[];
}

export interface Pattern {
  id: string;
  title: string;
  designer?: string;
  author?: string; // Pattern author/designer name
  source: PatternSource;
  sourceUrl?: string;
  originalFile?: Blob; // stored PDF or image
  pdfFile?: string; // URL or path to PDF file
  coverImage?: string; // URL or path to cover image
  category?: string; // Pattern category (amigurumi, clothing, etc.)
  parsedSections: PatternSection[];
  sizes: Size[];
  abbreviationsUsed: Abbreviation[];
  materials: Material[];
  skillLevel: SkillLevel;
  techniques: string[]; // e.g., ["Magic Ring", "Invisible Decrease", "Color Changes"]
  notes: string;
  dateAdded: Date;
  lastAccessed: Date;
  tags: string[];
  isFavorite: boolean;
  
  // Optional metadata
  estimatedTime?: string;
  yardageRequired?: number;
  yarnWeight?: string; // Yarn weight category
  hookSize?: string;
  gaugeInfo?: string;
}

// ============================================================================
// TIME TRACKING
// ============================================================================

export interface TimeSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  notes?: string;
}

export interface TimeTracking {
  totalMinutes: number; // cumulative tracked time
  sessions: TimeSession[];
  isActive: boolean; // timer currently running
  currentSessionStart: number | null; // timestamp when current session started
}

// ============================================================================
// PROJECTS
// ============================================================================

export type ProjectStatus = 
  | 'planned' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'frogged'; // unraveled

export type ProjectCategory = 
  | 'amigurumi' 
  | 'wearable' 
  | 'blanket' 
  | 'accessory' 
  | 'home' 
  | 'other';

export interface GaugeInfo {
  stitchesPerInch: number;
  rowsPerInch: number;
  hookSize: string;
  swatchSize: string; // e.g., "4x4 inches"
  notes?: string;
}

export interface Photo {
  id: string;
  url: string; // blob URL or base64
  caption?: string;
  timestamp: Date;
  milestone?: string; // e.g., "50% complete", "All pieces done"
}

export interface Modification {
  id: string;
  description: string;
  instructionId?: string; // which instruction was modified
  sectionId?: string;
  beforeText?: string;
  afterText?: string;
  reason?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  patternId?: string; // reference to Pattern
  status: ProjectStatus;
  category: ProjectCategory;
  yarnsUsed: YarnAllocation[];
  hookSize: string;
  gauge?: GaugeInfo;
  counters: Counter[];
  notes: UserNote[];
  modifications: Modification[];
  progressPhotos: Photo[];
  timeTracking: TimeTracking; // detailed time tracking with sessions
  totalSeconds?: number; // For Firestore timer integration
  hourlyRate?: number; // Pricing calculation
  materialCost?: number; // Pricing calculation
  
  // Marketplace / Shop Fields (Zero-Commission Model)
  isForSale?: boolean; // Is this item listed for sale?
  price?: number; // Asking price in USD
  paymentLink?: string; // Direct payment link (Stripe, PayPal, Venmo, etc.)
  
  startDate: Date;
  completedDate?: Date;
  estimatedCompletionDate?: Date;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // For gifting
  isGift: boolean;
  giftRecipient?: string;
  giftOccasion?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastWorkedOn?: Date;
}

// ============================================================================
// USER PROFILE & SETTINGS
// ============================================================================

export type SubscriptionTier = 'free' | 'pro' | 'lifetime';
export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'past_due' | null;

export interface BodyMeasurements {
  bust: number;
  waist: number;
  hips: number;
  armLength: number;
  shoulderWidth: number;
  torsoLength: number;
  headCircumference: number;
  footLength: number;
  handCircumference: number;
  unit: 'inches' | 'cm';
}

export interface GaugeRecord {
  id: string;
  yarnUsed: string; // yarn name or ID
  hookSize: string;
  stitchesPerInch: number;
  rowsPerInch: number;
  swatchDate: Date;
  notes?: string;
}

export interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  
  // Body Measurements (for garment fitting)
  measurements?: BodyMeasurements;
  
  // Preferences
  defaultHookSize?: string;
  preferredYarnWeights: YarnWeight[];
  skillLevel: SkillLevel;
  dominantHand: 'left' | 'right';
  preferredTechniques: string[];
  
  // Gauge History
  gaugeHistory: GaugeRecord[];
  
  // Subscription & Billing
  subscriptionTier: SubscriptionTier; // 'free', 'pro', or 'seller'
  subscriptionStatus: SubscriptionStatus; // 'trial', 'active', 'canceled', 'past_due', null
  trialEndsAt?: Date; // When free trial expires
  stripeCustomerId?: string; // For payment processing
  subscriptionEndsAt?: Date; // For canceled subscriptions
  
  // Referral Program 2.0
  referredByCode?: string; // The code used to sign up
  referredByUid?: string; // The actual UID of the referrer
  purchaseDate?: Date; // When they first upgraded to Pro/Lifetime
  referralStatus?: 'pending' | 'completed' | 'failed' | null;
  referralCompletedDate?: Date;
  completedReferrals?: number; // Total count of successful referrals for this user
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FINISHED OBJECTS
// ============================================================================

export interface FinishedObject {
  id: string;
  name: string;
  projectId: string; // reference to original Project
  patternId?: string;
  yarnsUsed: YarnAllocation[];
  photos: Photo[];
  completedDate: Date;
  timeSpent: number; // minutes (from project)
  modifications: Modification[]; // carried over from project
  careInstructions?: string;
  
  // Gift tracking
  isGift: boolean;
  giftRecipient?: string;
  giftOccasion?: string;
  giftDate?: Date;
  
  // For selling
  isForSale: boolean;
  salePrice?: number;
  soldDate?: Date;
  soldTo?: string;
  
  notes: string;
  tags: string[];
  
  // Metadata
  createdAt: Date;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportData {
  version: string; // schema version
  exportDate: Date;
  projects: Project[];
  patterns: Pattern[];
  stash: YarnStash[];
  profile: UserProfile;
  finishedObjects: FinishedObject[];
}
