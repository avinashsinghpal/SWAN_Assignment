import { Button } from './Button.jsx';
import { cn } from '../../lib/cn.js';

export function EmptyState({
  title = 'NO DATA AVAILABLE',
  description = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  action,
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center border border-[#222222]/40 bg-[#060606] font-mono',
        className
      )}
    >
      {/* 1px line-art SVG empty stacked frames */}
      <div className="mb-6" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6.5" y="6.5" width="28" height="28" stroke="#333333" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="13.5" y="13.5" width="28" height="28" stroke="#FE6A00" strokeWidth="1" />
          <line x1="13.5" y1="21.5" x2="41.5" y2="21.5" stroke="#FE6A00" strokeWidth="0.8" opacity="0.6" />
          <line x1="21.5" y1="21.5" x2="21.5" y2="41.5" stroke="#FE6A00" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>

      <h3 className="font-display text-3xl uppercase tracking-wider text-[#EEEEEE] mb-2">
        {title}
      </h3>

      <p className="text-xs text-[#717171] max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {action || (actionLabel && onAction ? (
        <Button variant="solid" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null)}
    </div>
  );
}
