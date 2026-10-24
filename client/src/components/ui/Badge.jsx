/**
 * Badge component for status labels and tags.
 * Status-specific variants use soft tinted backgrounds with darker text.
 */

import { cn } from '../../lib/cn.js';

const STATUS_STYLES = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Qualified: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Converted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const VARIANT_STYLES = {
  default: 'bg-[var(--color-border)] text-[var(--color-ink-muted)] dark:bg-[var(--color-dark-border)] dark:text-[var(--color-dark-ink-muted)]',
  primary: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  secondary: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sales: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

/**
 * @param {object} props
 * @param {string} [props.status] - One of the LEAD_STATUSES
 * @param {'default'|'primary'|'secondary'|'admin'|'sales'} [props.variant]
 * @param {'sm'|'md'} [props.size]
 */
export function Badge({ status, variant = 'default', size = 'sm', className, children }) {
  const style = status ? STATUS_STYLES[status] : VARIANT_STYLES[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        style,
        className
      )}
    >
      {status || children}
    </span>
  );
}
