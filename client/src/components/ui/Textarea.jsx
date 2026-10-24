import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    className = '',
    id,
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5 text-left font-mono">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[10px] uppercase tracking-widest text-[#717171]"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full bg-[#161616] text-[#EEEEEE] font-mono text-sm p-3.5 border transition-colors resize-y',
          'border-[#222222] hover:border-[#EEEEEE]/30',
          'focus:border-[#FE6A00] focus:outline-1 focus:outline-[#FE6A00]',
          'placeholder:text-[#717171]/60',
          error && 'border-[#E7000B] hover:border-[#E7000B]',
          className
        )}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-[#F2554F] font-mono tracking-wide">{error}</p>
      ) : hint ? (
        <p className="text-[10px] text-[#717171] font-mono">{hint}</p>
      ) : null}
    </div>
  );
});
