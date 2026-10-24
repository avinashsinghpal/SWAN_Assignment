/**
 * ToastContext - provides a lightweight toast notification system.
 * No emoji. Supports success, error, warning, and info variants.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../lib/cn.js';

const ToastContext = createContext(null);

let toastId = 0;

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const VARIANT_STYLES = {
  success: 'bg-white dark:bg-gray-800 border-l-4 border-l-teal-600',
  error: 'bg-white dark:bg-gray-800 border-l-4 border-l-red-500',
  warning: 'bg-white dark:bg-gray-800 border-l-4 border-l-gold-600',
  info: 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500',
};

const ICON_STYLES = {
  success: 'text-teal-600',
  error: 'text-red-500',
  warning: 'text-amber-600',
  info: 'text-blue-500',
};

function Toast({ toast, onDismiss }) {
  const Icon = ICONS[toast.variant] || Info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg shadow-lg min-w-72 max-w-sm',
        'border border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
        'animate-toast-enter',
        VARIANT_STYLES[toast.variant]
      )}
    >
      <Icon size={18} className={cn('mt-0.5 shrink-0', ICON_STYLES[toast.variant])} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)]">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, variant = 'info', duration = 4000 }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, title, message, variant }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
