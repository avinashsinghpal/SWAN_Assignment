/**
 * ThemeContext - manages light/dark/system theme preference.
 * Persists to localStorage. Applies the "dark" class to <html>.
 */

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const THEMES = ['light', 'dark', 'system'];

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('swan-theme');
    if (THEMES.includes(stored)) return stored;
  } catch {
    // localStorage unavailable
  }
  return 'system';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('swan-theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Listen for system preference changes when theme = 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (t) => {
    if (THEMES.includes(t)) setThemeState(t);
  };

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
