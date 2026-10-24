import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'relative flex flex-col gap-1 w-full max-w-sm p-4 bg-[#030303] text-[#EEEEEE] border border-[#222222] font-mono text-xs shadow-2xl',
          title: 'font-mono text-xs font-semibold uppercase tracking-wider text-[#EEEEEE]',
          description: 'font-mono text-[11px] text-[#8A8A8A] leading-relaxed',
        },
      }}
    />
  );
}

export const toast = {
  success: (message, options = {}) =>
    sonnerToast.success(message, {
      ...options,
      className: 'border-l-2 border-l-[#5FB878]',
    }),
  error: (message, options = {}) =>
    sonnerToast.error(message, {
      ...options,
      className: 'border-l-2 border-l-[#E7000B]',
    }),
  info: (message, options = {}) =>
    sonnerToast.info(message, {
      ...options,
      className: 'border-l-2 border-l-[#FE6A00]',
    }),
  message: (message, options = {}) =>
    sonnerToast(message, {
      ...options,
      className: 'border-l-2 border-l-[#FE6A00]',
    }),
};
