import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = '',
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/70 z-50 transition-opacity animate-in fade-in duration-200" />
        <RadixDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#030303] border border-[#222222] p-6 shadow-2xl font-mono focus:outline-none transition-all duration-200',
            className
          )}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#222222]/60 mb-4">
            {title && (
              <RadixDialog.Title className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE] m-0">
                {title}
              </RadixDialog.Title>
            )}
            <RadixDialog.Close asChild>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center border border-[#222222] text-[#717171] hover:text-[#EEEEEE] hover:border-[#FE6A00] transition-colors"
                aria-label="Close dialog"
              >
                <X size={14} />
              </button>
            </RadixDialog.Close>
          </div>

          {description && (
            <RadixDialog.Description className="text-xs text-[#717171] leading-relaxed mb-6">
              {description}
            </RadixDialog.Description>
          )}

          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
