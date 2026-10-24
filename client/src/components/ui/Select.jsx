/**
 * Select component with label and error support.
 */

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn.js';

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {boolean} [props.required]
 * @param {{ value: string, label: string }[]} [props.options]
 * @param {string} [props.placeholder]
 */
export const Select = forwardRef(function Select(
  { label, error, required, options = [], placeholder, className, id, ...props },
  ref
) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            'w-full h-9 rounded-lg border pl-3 pr-9 text-sm appearance-none',
            'bg-white dark:bg-[var(--color-dark-card)]',
            'text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]',
            'border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
            'focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent',
            'transition-shadow duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)] pointer-events-none"
        />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
