/**
 * Accessibility Settings Type Definitions
 * 
 * CrochetFlow is accessibility-first. These settings ensure WCAG 2.1 AA compliance
 * and address the critical failures that locked users out of Ravelry and other platforms.
 */

export type ColorScheme = 'light' | 'dark' | 'sepia' | 'high-contrast';
export type FontSize = 'small' | 'medium' | 'large' | 'x-large';
export type LineSpacing = 'normal' | 'relaxed' | 'loose';

export interface AccessibilitySettings {
  // ===== VISUAL ACCESSIBILITY =====
  
  /**
   * High contrast mode with WCAG AAA ratios (7:1+)
   */
  highContrast: boolean;
  
  /**
   * Reduced motion - DEFAULT: true
   * NO flashing content, NO parallax, minimal animations
   * Respects prefers-reduced-motion system setting
   */
  reducedMotion: boolean;
  
  /**
   * Font size scaling
   * All UI text and pattern text scale together
   */
  fontSize: FontSize;
  
  /**
   * Color scheme / theme
   */
  colorScheme: ColorScheme;
  
  /**
   * Line spacing for better readability
   */
  lineSpacing: LineSpacing;
  
  // ===== MOTOR ACCESSIBILITY =====
  
  /**
   * Mirror UI and charts for left-handed crocheters
   * Affects pattern visualizations and asymmetrical instructions
   */
  leftHandMode: boolean;
  
  /**
   * Increase button sizes beyond standard 44x44px minimum
   * Sets all buttons to 60x60px minimum
   */
  largeButtons: boolean;
  
  /**
   * Ensure all tap targets are minimum 44x44px (WCAG 2.5.5)
   * This is always enforced, but can be increased with largeButtons
   */
  largeTapTargets: boolean;
  
  /**
   * Enable voice control for hands-free operation
   * "next row", "undo", "add note", etc.
   */
  voiceControlEnabled: boolean;
  
  /**
   * Haptic feedback on interactions (if device supports it)
   * Gentle vibrations for confirmations and milestones
   */
  hapticFeedback: boolean;
  
  // ===== COGNITIVE ACCESSIBILITY =====
  
  /**
   * Simplified UI mode with reduced options and clear flows
   * Hides advanced features, shows step-by-step wizards
   */
  simplifiedUI: boolean;
  
  /**
   * Focus mode - shows only current task, hides everything else
   * Perfect for ADHD or easily distracted users
   */
  focusMode: boolean;
  
  /**
   * Distraction-free pattern reading
   * Full screen pattern view with no UI chrome
   */
  distractionFreeReading: boolean;
  
  /**
   * Auto-save interval in seconds
   * More frequent saves for users who worry about losing work
   */
  autoSaveInterval: number;
  
  // ===== HEALTH & WELLNESS =====
  
  /**
   * Remind user to take breaks while crafting
   */
  breakReminders: boolean;
  
  /**
   * Interval between break reminders (in minutes)
   */
  breakIntervalMinutes: number;
  
  /**
   * Posture check reminders
   */
  postureReminders: boolean;
  
  /**
   * Stretch reminders for hands/wrists
   */
  stretchReminders: boolean;
  
  /**
   * Eye strain reminders (20-20-20 rule)
   * Every 20 minutes, look at something 20 feet away for 20 seconds
   */
  eyeStrainReminders: boolean;
  
  /**
   * Optional time limit per session (in minutes)
   * For users who want to limit crafting time
   */
  sessionTimeLimit?: number;
  
  // ===== SCREEN READER =====
  
  /**
   * Optimize for screen reader usage
   * Additional ARIA labels, verbose announcements
   */
  screenReaderOptimized: boolean;
  
  /**
   * Announce counter changes via aria-live
   * "Counter increased to 24"
   */
  announceCounterChanges: boolean;
  
  /**
   * Verbose navigation announcements
   * "Navigated to Projects page, 5 active projects"
   */
  verboseNavigation: boolean;
}

/**
 * Default accessibility settings
 * CRITICAL: Reduced motion is TRUE by default (not opt-in)
 */
export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  // Visual
  highContrast: false,
  reducedMotion: true, // DEFAULT: true (safety-first)
  fontSize: 'medium',
  colorScheme: 'light',
  lineSpacing: 'normal',
  
  // Motor
  leftHandMode: false,
  largeButtons: false,
  largeTapTargets: true, // Always enforced
  voiceControlEnabled: false,
  hapticFeedback: true,
  
  // Cognitive
  simplifiedUI: false,
  focusMode: false,
  distractionFreeReading: false,
  autoSaveInterval: 5, // seconds
  
  // Health & Wellness
  breakReminders: false,
  breakIntervalMinutes: 30,
  postureReminders: false,
  stretchReminders: false,
  eyeStrainReminders: false,
  sessionTimeLimit: undefined,
  
  // Screen Reader
  screenReaderOptimized: false,
  announceCounterChanges: true,
  verboseNavigation: false,
};

/**
 * Accessibility preset configurations
 * Users can select a preset and customize from there
 */
export const ACCESSIBILITY_PRESETS = {
  default: DEFAULT_ACCESSIBILITY_SETTINGS,
  
  /**
   * High contrast for users with visual impairments
   */
  highContrast: {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    highContrast: true,
    fontSize: 'large',
    lineSpacing: 'relaxed',
    colorScheme: 'high-contrast' as ColorScheme,
  },
  
  /**
   * Safe mode for users sensitive to motion/flashing (Ravelry refugees)
   */
  migraineSafe: {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    reducedMotion: true,
    highContrast: false,
    colorScheme: 'sepia' as ColorScheme,
    fontSize: 'large',
    lineSpacing: 'relaxed',
  },
  
  /**
   * Screen reader optimized
   */
  screenReader: {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    screenReaderOptimized: true,
    announceCounterChanges: true,
    verboseNavigation: true,
    simplifiedUI: true,
  },
  
  /**
   * Motor accessibility (one-handed, voice control)
   */
  motorAssist: {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    largeButtons: true,
    largeTapTargets: true,
    voiceControlEnabled: true,
    hapticFeedback: true,
    simplifiedUI: true,
  },
  
  /**
   * Cognitive support (ADHD, distraction, memory)
   */
  cognitiveSupport: {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    simplifiedUI: true,
    focusMode: true,
    autoSaveInterval: 3,
    breakReminders: true,
    breakIntervalMinutes: 20,
  },
  
  /**
   * Health-conscious with all wellness features
   */
  wellness: {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    breakReminders: true,
    breakIntervalMinutes: 30,
    postureReminders: true,
    stretchReminders: true,
    eyeStrainReminders: true,
    sessionTimeLimit: 120, // 2 hours
  },
} as const;
