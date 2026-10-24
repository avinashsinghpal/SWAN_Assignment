import { Button } from './Button.jsx';
import { cn } from '../../lib/cn.js';

export function ErrorState({
  title = 'SOMETHING WENT WRONG',
  message = 'Failed to load data from the server. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center border border-[#E7000B]/40 bg-[#060606] font-mono',
        className
      )}
    >
      <div className="w-10 h-10 border border-[#E7000B] flex items-center justify-center text-[#F2554F] font-bold text-lg mb-4 select-none">
        !
      </div>

      <h3 className="font-display text-3xl uppercase tracking-wider text-[#F2554F] mb-2">
        {title}
      </h3>

      <p className="text-xs text-[#717171] max-w-sm leading-relaxed mb-6">
        {message}
      </p>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          RETRY
        </Button>
      )}
    </div>
  );
}
