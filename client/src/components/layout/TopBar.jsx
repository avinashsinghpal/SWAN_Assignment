/**
 * TopBar component.
 * Shows the page title, theme toggle, and mobile menu button.
 */

import { Menu, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { cn } from '../../lib/cn.js';

/**
 * @param {object} props
 * @param {string} props.title - Current page title
 * @param {function} props.onMenuClick - Opens the mobile sidebar
 */
export function TopBar({ title, onMenuClick }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const next = { light: 'dark', dark: 'system', system: 'light' };
    setTheme(next[theme] || 'light');
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-card)] sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-dark-ink)] p-1.5 rounded-lg hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className={cn(
            'p-2 rounded-lg transition-colors duration-150',
            'text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)]',
            'hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)]',
            'hover:text-[var(--color-ink)] dark:hover:text-[var(--color-dark-ink)]'
          )}
          aria-label={`Current theme: ${theme}. Click to change.`}
          title={`Theme: ${theme}`}
        >
          <ThemeIcon size={17} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
