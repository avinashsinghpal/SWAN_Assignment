import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function Drawer({
  open,
  onOpenChange,
  eyebrow,
  title,
  description,
  children,
  footer,
  className = '',
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/70 z-50 transition-opacity animate-in fade-in duration-200" />
        <RadixDialog.Content
          className={cn(
            'fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[520px] bg-[#030303] border-l border-[#222222] shadow-2xl flex flex-col font-mono focus:outline-none transition-transform duration-200',
            className
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#222222]/60 flex items-start justify-between shrink-0">
            <div>
              {eyebrow && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] mb-1">
                  {eyebrow}
                </p>
              )}
              {title && (
                <RadixDialog.Title className="font-display text-3xl uppercase tracking-wide text-[#EEEEEE] m-0">
                  {title}
                </RadixDialog.Title>
              )}
              {description && (
                <RadixDialog.Description className="text-xs text-[#717171] mt-1">
                  {description}
                </RadixDialog.Description>
              )}
            </div>

            <RadixDialog.Close asChild>
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center border border-[#222222] text-[#717171] hover:text-[#EEEEEE] hover:border-[#FE6A00] transition-colors shrink-0 ml-4"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </RadixDialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

          {/* Footer (sticky) */}
          {footer && (
            <div className="p-6 border-t border-[#222222]/60 bg-[#030303] shrink-0">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
