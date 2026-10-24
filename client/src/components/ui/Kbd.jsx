import { cn } from '../../lib/cn.js';

export function Kbd({ children, className = '' }) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono uppercase bg-[#161616] text-[#8A8A8A] border border-[#222222] select-none',
        className
      )}
    >
      {children}
    </kbd>
  );
}
