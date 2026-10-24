import { cn } from '../../lib/cn.js';

export function FieldWrapper({ label, id, error, hint, required, children, className = '' }) {
  return (
    <div className={cn('w-full space-y-1.5 text-left font-mono', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] uppercase tracking-widest text-[#717171]"
        >
          {label} {required && <span className="text-[#FE6A00]">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[11px] text-[#F2554F] font-mono tracking-wide">{error}</p>
      ) : hint ? (
        <p className="text-[10px] text-[#717171] font-mono">{hint}</p>
      ) : null}
    </div>
  );
}

export function ErrorBanner({ message, className = '' }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        'relative bg-[#161616] border border-[#222222] p-3 text-xs font-mono text-[#F2554F] border-l-2 border-l-[#E7000B]',
        className
      )}
    >
      {message}
    </div>
  );
}
