/**
 * Theme Toggle Component
 * 
 * Toggles between light and dark theme using AccessibilityContext
 */

import { useAccessibility } from '../contexts/AccessibilityContext';

export default function ThemeToggle() {
  const { settings, updateSettings } = useAccessibility();
  const isDark = settings.colorScheme === 'dark' || settings.colorScheme === 'high-contrast';

  const toggleTheme = () => {
    updateSettings({
      colorScheme: isDark ? 'light' : 'dark'
    });
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      <span className="text-base">{isDark ? '🌙' : '☀️'}</span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
