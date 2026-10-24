/**
 * Skeleton loader components.
 * Used as loading placeholders instead of spinners.
 */

import { cn } from '../../lib/cn.js';

/**
 * Generic skeleton block.
 * @param {{ className?: string, style?: object }} props
 */
export function Skeleton({ className, style, ...props }) {
  return (
    <div
      className={cn('skeleton rounded', className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Skeleton for a stat card.
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

/**
 * Skeleton for a table row.
 * @param {{ cols?: number }} props
 */
export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" style={{ maxWidth: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton for a lead card (mobile view).
 */
export function LeadCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-36" />
    </div>
  );
}

/**
 * Skeleton for a chart.
 */
export function ChartSkeleton({ height = 240 }) {
  return (
    <div
      className="skeleton rounded-xl"
      style={{ height }}
      aria-hidden="true"
    />
  );
}
