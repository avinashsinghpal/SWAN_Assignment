/**
 * Drawer (slide-over panel) component.
 * Slides in from the right side, used for create/edit lead forms.
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {string} props.title
 * @param {'sm'|'md'|'lg'} [props.size]
 */
export function Drawer({ open, onClose, title, size = 'md', children }) {
  const drawerRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus drawer when opened
  useEffect(() => {
    if (open && drawerRef.current) drawerRef.current.focus();
  }, [open]);

  const WIDTH = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl' };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
        className={cn(
          'absolute right-0 top-0 h-full w-full',
          WIDTH[size],
          'bg-white dark:bg-[var(--color-dark-card)]',
          'border-l border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
          'shadow-[var(--shadow-modal)]',
          'transition-transform duration-200 ease-out',
          'flex flex-col focus:outline-none',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
          <h2
            id="drawer-title"
            className="text-base font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] tracking-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] dark:hover:text-[var(--color-dark-ink)] transition-colors rounded-lg p-1.5 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)]"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DrawerFooter({ className, children }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4',
        'border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
        'bg-white dark:bg-[var(--color-dark-card)] shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}
