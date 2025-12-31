/**
 * Accessibility Context Provider
 * 
 * Central accessibility state management with automatic persistence
 * and CSS variable application. This is the FOUNDATION of CrochetFlow.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { db } from '@/db/schema';
import type { AccessibilitySettings } from '@/types/accessibility';
import { DEFAULT_ACCESSIBILITY_SETTINGS } from '@/types/accessibility';

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => Promise<void>;
  applyTheme: (scheme: AccessibilitySettings['colorScheme']) => void;
  resetToDefaults: () => Promise<void>;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from IndexedDB on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await db.settings.get('accessibility');
        if (stored?.data) {
          setSettings(stored.data);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
        setIsLoaded(true);
      }
    }
    loadSettings();
  }, []);

  // Apply settings to document when they change
  useEffect(() => {
    if (!isLoaded) return;
    applySettingsToDocument(settings);
  }, [settings, isLoaded]);

  // Update settings and persist to IndexedDB
  const updateSettings = async (updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    try {
      await db.settings.put({
        id: 'accessibility',
        data: newSettings,
      });
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  };

  // Apply theme color scheme
  const applyTheme = (scheme: AccessibilitySettings['colorScheme']) => {
    updateSettings({ colorScheme: scheme });
  };

  // Reset to defaults
  const resetToDefaults = async () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    try {
      await db.settings.put({
        id: 'accessibility',
        data: DEFAULT_ACCESSIBILITY_SETTINGS,
      });
    } catch (error) {
      console.error('Failed to reset accessibility settings:', error);
    }
  };

  const value: AccessibilityContextValue = {
    settings,
    updateSettings,
    applyTheme,
    resetToDefaults,
  };

  // Don't render children until settings are loaded
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="mb-4 text-2xl">🧶</div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading CrochetFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * Apply accessibility settings to document root
 * Sets CSS variables and data attributes
 */
function applySettingsToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Color scheme
  root.setAttribute('data-theme', settings.colorScheme);
  if (settings.colorScheme === 'dark' || settings.colorScheme === 'high-contrast') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Font size
  root.setAttribute('data-font-size', settings.fontSize);
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'x-large': '20px',
  };
  root.style.fontSize = fontSizeMap[settings.fontSize];

  // Line spacing
  root.setAttribute('data-line-spacing', settings.lineSpacing);

  // High contrast
  root.setAttribute('data-high-contrast', settings.highContrast.toString());

  // Reduced motion
  root.setAttribute('data-reduced-motion', settings.reducedMotion.toString());

  // Left-hand mode
  root.setAttribute('data-left-hand', settings.leftHandMode.toString());
  if (settings.leftHandMode) {
    root.style.direction = 'rtl'; // Mirror layout for left-handed
  } else {
    root.style.direction = 'ltr';
  }

  // Large buttons
  root.setAttribute('data-large-buttons', settings.largeButtons.toString());

  // Simplified UI
  root.setAttribute('data-simplified', settings.simplifiedUI.toString());

  // Focus mode
  root.setAttribute('data-focus-mode', settings.focusMode.toString());

  // Respect system preferences as fallback
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.setAttribute('data-reduced-motion', 'true');
  }
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches && settings.colorScheme === 'light') {
    // Honor system preference unless user explicitly set a different theme
  }
}

/**
 * Hook to access accessibility settings
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

/**
 * Hook to get current color scheme
 */
export function useColorScheme() {
  const { settings } = useAccessibility();
  return settings.colorScheme;
}

/**
 * Hook to check if reduced motion is enabled
 */
export function useReducedMotion() {
  const { settings } = useAccessibility();
  return settings.reducedMotion;
}

/**
 * Hook to check if large buttons are enabled
 */
export function useLargeButtons() {
  const { settings } = useAccessibility();
  return settings.largeButtons;
}
