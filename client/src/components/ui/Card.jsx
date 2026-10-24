import { cn } from '../../lib/cn.js';

/**
 * Editorial Card component.
 * Border 1px #222222/40, flat background #060606 (or transparent).
 * Interactive variant adds landing hover: accent border, accent tint, and 48px top-right L-shape.
 */
export function Card({
  className = '',
  children,
  interactive = false,
  raised = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative border border-[#222222]/50 p-5 md:p-6 transition-all',
        raised ? 'bg-[#060606]' : 'bg-transparent',
        interactive && 'interactive-card cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between pb-4 border-b border-[#222222]/50 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3
      className={cn(
        'font-display text-xl uppercase tracking-wide text-[#EEEEEE]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}
