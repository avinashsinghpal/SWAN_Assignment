import { cn } from '../../lib/cn.js';
import { StatusMarker } from './StatusTag.jsx';

export function SegmentedControl({
  value,
  onChange,
  options = [],
  disabled = false,
  className = '',
}) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'inline-flex flex-wrap items-stretch border border-[#222222] bg-[#020202] font-mono',
        className
      )}
    >
      {options.map((opt, idx) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const status = typeof opt === 'string' ? opt : opt.status || opt.value;
        const isActive = value === val;

        return (
          <button
            key={val}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onChange && onChange(val)}
            className={cn(
              'relative h-9 px-3.5 text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors focus:outline-none select-none',
              idx > 0 && 'border-l border-[#222222]',
              isActive
                ? 'bg-[#FE6A00] text-[#020202] font-bold'
                : 'bg-transparent text-[#717171] hover:text-[#EEEEEE] hover:bg-[#121212]',
              disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {status && (
              <span className={cn(isActive && 'filter invert contrast-200')}>
                <StatusMarker status={status} size={8} />
              </span>
            )}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
