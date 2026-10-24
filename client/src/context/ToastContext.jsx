import { createContext, useContext } from 'react';
import { toast } from '../components/ui/Toaster.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const value = {
    toast: (opts) => {
      const msg = opts.message || opts.title || '';
      if (opts.variant === 'success') toast.success(msg);
      else if (opts.variant === 'danger' || opts.variant === 'error') toast.error(msg);
      else toast.info(msg);
    },
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || {
    toast: (opts) => {
      const msg = opts.message || opts.title || '';
      if (opts.variant === 'success') toast.success(msg);
      else if (opts.variant === 'danger' || opts.variant === 'error') toast.error(msg);
      else toast.info(msg);
    },
  };
}
