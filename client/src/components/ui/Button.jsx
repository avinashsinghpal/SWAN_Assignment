/**
 * Button component.
 * Variants: primary, secondary, ghost, danger, outline
 * Sizes: sm, md, lg
 */

import { cn } from '../../lib/cn.js';
import { Loader2 } from 'lucide-react';

const BASE =
  'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

const VARIANTS = {
  primary:
    'bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600 rounded-lg',
  secondary:
    'bg-[var(--color-canvas)] dark:bg-[var(--color-dark-card)] text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] rounded-lg',
  ghost:
    'bg-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-dark-ink)] rounded-lg',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 rounded-lg',
  outline:
    'border border-teal-700 text-teal-700 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-900/20 rounded-lg',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
};

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'|'outline'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.iconOnly]
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading = false,
  iconOnly = false,
  className,
  children,
  disabled,
  ...props
}) {
  const isBusy = Boolean(loading || isLoading);

  return (
    <button
      className={cn(
        BASE,
        VARIANTS[variant],
        SIZES[size],
        iconOnly && 'aspect-square p-0',
        className
      )}
      disabled={disabled || isBusy}
      {...props}
    >
      {isBusy ? (
        <Loader2 size={16} className="animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
