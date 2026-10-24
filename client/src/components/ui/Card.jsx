/**
 * Card component - 12px radius, 1px border, soft shadow.
 */

import { cn } from '../../lib/cn.js';

/**
 * @param {object} props
 * @param {boolean} [props.hoverable]
 * @param {boolean} [props.padded]
 */
export function Card({ className, children, hoverable = false, padded = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[var(--color-dark-card)] rounded-xl',
        'border border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
        'shadow-[var(--shadow-card)]',
        hoverable && 'transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4',
        'border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        'text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
