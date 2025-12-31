/**
 * Free Tier Limits Configuration
 * 
 * Limited free tier to encourage upgrades
 * Free = local storage only (no cloud)
 */

export const FREE_TIER_LIMITS = {
  PROJECTS: 3,
  PATTERNS: 3,
  PHOTOS_PER_PROJECT: 0, // Local only - no cloud photos
  EXPORTS_PER_WEEK: 1,
  CLOUD_STORAGE_GB: 0, // No cloud storage for free
  // Unlimited features
  COUNTERS: Infinity,
  VOICE_CONTROL: true,
  SHARING: true,
  TEMPLATES: true,
  CALCULATOR: true,
} as const;

/**
 * Check if user has reached project limit
 */
export function canAddProject(currentProjectCount: number): boolean {
  return currentProjectCount < FREE_TIER_LIMITS.PROJECTS;
}

/**
 * Check if user has reached pattern limit
 */
export function canAddPattern(currentPatternCount: number): boolean {
  return currentPatternCount < FREE_TIER_LIMITS.PATTERNS;
}

/**
 * Check if project has reached photo limit
 */
export function canAddPhoto(currentPhotoCount: number): boolean {
  return currentPhotoCount < FREE_TIER_LIMITS.PHOTOS_PER_PROJECT;
}

/**
 * Check if user can export (once per week)
 */
export function canExport(lastExportDate?: Date): boolean {
  if (!lastExportDate) return true;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return lastExportDate < oneWeekAgo;
}

/**
 * Get days until next export available
 */
export function getDaysUntilNextExport(lastExportDate: Date): number {
  const nextExportDate = new Date(lastExportDate);
  nextExportDate.setDate(nextExportDate.getDate() + 7);
  
  const now = new Date();
  const diffTime = nextExportDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Get limit status for display
 */
export function getLimitStatus(type: 'projects' | 'patterns' | 'photos', current: number) {
  const limits = {
    projects: FREE_TIER_LIMITS.PROJECTS,
    patterns: FREE_TIER_LIMITS.PATTERNS,
    photos: FREE_TIER_LIMITS.PHOTOS_PER_PROJECT,
  };
  
  const limit = limits[type];
  const percentage = (current / limit) * 100;
  const remaining = limit - current;
  
  return {
    current,
    limit,
    remaining,
    percentage,
    isNearLimit: percentage >= 80,
    isAtLimit: current >= limit,
  };
}

/**
 * Upgrade CTA messages
 */
export const UPGRADE_MESSAGES = {
  projects: "You've reached your 3 project limit! Upgrade to Pro for 100 projects or Lifetime for unlimited.",
  patterns: "Pattern library full (3/3)! Upgrade to Pro for 50 patterns or Lifetime for unlimited.",
  photos: "Free tier uses local storage only. Upgrade to Pro for 2GB cloud storage or Lifetime for 1GB!",
  export: "You can export once per week on the free tier. Want daily exports? Your support helps us build that feature!",
} as const;
