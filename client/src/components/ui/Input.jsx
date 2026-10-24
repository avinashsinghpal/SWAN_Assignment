import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5 text-left font-mono">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[10px] uppercase tracking-widest text-[#717171]"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[#717171] pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 bg-[#161616] text-[#EEEEEE] font-mono text-sm px-3.5 border transition-colors',
            'border-[#222222] hover:border-[#EEEEEE]/30',
            'focus:border-[#FE6A00] focus:outline-1 focus:outline-[#FE6A00]',
            'placeholder:text-[#717171]/60',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-[#E7000B] hover:border-[#E7000B]',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 text-[#717171] flex items-center">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-[#F2554F] font-mono tracking-wide">{error}</p>
      ) : hint ? (
        <p className="text-[10px] text-[#717171] font-mono">{hint}</p>
      ) : null}
    </div>
  );
});
