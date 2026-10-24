import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function Select({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = 'Select...',
  error,
  hint,
  disabled = false,
  className = '',
  id,
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full space-y-1.5 text-left font-mono">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[10px] uppercase tracking-widest text-[#717171]"
        >
          {label}
        </label>
      )}

      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          id={selectId}
          className={cn(
            'w-full h-11 bg-[#161616] text-[#EEEEEE] font-mono text-sm px-3.5 border transition-colors flex items-center justify-between',
            'border-[#222222] hover:border-[#EEEEEE]/30',
            'focus:border-[#FE6A00] focus:outline-1 focus:outline-[#FE6A00]',
            disabled && 'opacity-40 cursor-not-allowed',
            error && 'border-[#E7000B] hover:border-[#E7000B]',
            className
          )}
        >
          <RadixSelect.Value placeholder={<span className="text-[#717171]/60">{placeholder}</span>} />
          <RadixSelect.Icon asChild>
            <ChevronDown size={14} className="text-[#717171]" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 min-w-[var(--radix-select-trigger-width)] max-h-64 overflow-y-auto bg-[#030303] border border-[#222222] shadow-2xl font-mono"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => {
                const optVal = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                return (
                  <RadixSelect.Item
                    key={optVal}
                    value={optVal}
                    className="relative flex items-center justify-between px-3 py-2 text-xs text-[#EEEEEE] cursor-pointer outline-none select-none hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] focus:bg-[#FE6A00]/10 focus:text-[#FE6A00] data-[state=checked]:text-[#FE6A00]"
                  >
                    <RadixSelect.ItemText>{optLabel}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator>
                      <Check size={12} className="text-[#FE6A00] ml-2" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                );
              })}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error ? (
        <p className="text-[11px] text-[#F2554F] font-mono tracking-wide">{error}</p>
      ) : hint ? (
        <p className="text-[10px] text-[#717171] font-mono">{hint}</p>
      ) : null}
    </div>
  );
}
