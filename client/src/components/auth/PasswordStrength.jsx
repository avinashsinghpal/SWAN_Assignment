import { calculatePasswordStrength } from '../../lib/schemas.js';
import { cn } from '../../lib/cn.js';

export function PasswordStrength({ password = '' }) {
  const { score, label, rules } = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-3 pt-1 text-left font-mono">
      {/* 4 Flat square segments */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
          <span className="text-[#717171]">Strength</span>
          <span
            className={cn(
              'font-semibold',
              score <= 1 && 'text-[#F2554F]',
              score === 2 && 'text-[#D4D4D4]',
              score === 3 && 'text-[#FE6A00]',
              score === 4 && 'text-[#5FB878]'
            )}
          >
            {label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((step) => {
            const isFilled = score >= step;
            return (
              <div
                key={step}
                className={cn(
                  'h-1.5 transition-colors',
                  isFilled ? 'bg-[#FE6A00]' : 'bg-[#161616] border border-[#222222]'
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Checklist of rules */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-center gap-1.5 text-[10px]">
            <span
              className={cn(
                'w-2 h-2 shrink-0 border transition-colors',
                rule.met
                  ? 'bg-[#FE6A00] border-[#FE6A00]'
                  : 'bg-transparent border-[#222222]'
              )}
            />
            <span className={rule.met ? 'text-[#EEEEEE]' : 'text-[#717171]'}>
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
