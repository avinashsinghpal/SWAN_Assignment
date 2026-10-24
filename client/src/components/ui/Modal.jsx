/**
 * Modal component with keyboard-accessible dialog, focus trap, and overlay.
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const SIZE_STYLES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {string} props.title
 * @param {'sm'|'md'|'lg'|'xl'} [props.size]
 */
export function Modal({ open, onClose, title, size = 'md', className, children }) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus the dialog when it opens
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="presentation"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white dark:bg-[var(--color-dark-card)]',
          'rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
          'shadow-[var(--shadow-modal)] animate-slide-up',
          'focus:outline-none',
          SIZE_STYLES[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <h2
            id="modal-title"
            className="text-base font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] tracking-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-dark-ink)] transition-colors rounded-lg p-1.5 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)]"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ className, children }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4',
        'border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
        className
      )}
    >
      {children}
    </div>
  );
}
