import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/cn.js';

export function Tooltip({ children, content, side = 'top', className = '' }) {
  if (!content) return children;

  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={4}
            className={cn(
              'z-50 px-2.5 py-1 text-[11px] font-mono text-[#EEEEEE] bg-[#030303] border border-[#222222] shadow-xl select-none animate-in fade-in duration-150',
              className
            )}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
