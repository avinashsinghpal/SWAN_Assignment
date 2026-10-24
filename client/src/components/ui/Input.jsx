/**
 * Input component with optional label, error message, and left/right adornments.
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.hint]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightElement]
 * @param {boolean} [props.required]
 */
export const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightElement, required, className, id, ...props },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-subtle)]">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'w-full h-9 rounded-lg border px-3 text-sm',
            'bg-white dark:bg-[var(--color-dark-card)]',
            'text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]',
            'placeholder:text-[var(--color-ink-subtle)]',
            'border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
            'focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent',
            'transition-shadow duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-400',
            leftIcon && 'pl-9',
            rightElement && 'pr-10',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-[var(--color-ink-subtle)]">
          {hint}
        </p>
      )}
    </div>
  );
});

/**
 * Textarea component.
 */
export const Textarea = forwardRef(function Textarea(
  { label, error, hint, required, className, id, ...props },
  ref
) {
  const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm min-h-24 resize-y',
          'bg-white dark:bg-[var(--color-dark-card)]',
          'text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]',
          'placeholder:text-[var(--color-ink-subtle)]',
          'border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
          'focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent',
          'transition-shadow duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--color-ink-subtle)]">{hint}</p>
      )}
    </div>
  );
});
