/**
 * EmptyState component.
 * Shown when a list is empty. Includes SVG line art, a message, and optional CTA.
 */

import { cn } from '../../lib/cn.js';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action]
 */
export function EmptyState({ title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {/* Simple geometric SVG line art */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6 text-[var(--color-border)] dark:text-[var(--color-dark-border)]"
        aria-hidden="true"
      >
        <rect x="10" y="20" width="60" height="40" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="32" x2="70" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="42" x2="45" y2="42" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="50" x2="38" y2="50" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="58" r="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="56" y1="58" x2="64" y2="58" stroke="currentColor" strokeWidth="1.5" />
        <line x1="60" y1="54" x2="60" y2="62" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <h3 className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] max-w-xs mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

/**
 * ErrorState - displayed when a data fetch fails.
 * @param {object} props
 * @param {string} [props.message]
 * @param {function} [props.onRetry]
 */
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 text-red-400"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="32" y1="20" x2="32" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="43" r="1.5" fill="currentColor" />
      </svg>
      <p className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] mb-1">
        Failed to load data
      </p>
      <p className="text-sm text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] mb-4">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium underline-offset-2 hover:underline transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
