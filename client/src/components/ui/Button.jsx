import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';
import { ScrambleText } from '../landing/ScrambleText.jsx';
import { BitmapChevron } from '../landing/BitmapChevron.jsx';

/**
 * Button component per the Swan editorial design system.
 *
 * Variants:
 * - "outline" (default): border foreground/20, mono xs uppercase tracking-widest,
 *   hover border & text accent, ScrambleTextOnHover and optional BitmapChevron
 * - "solid": accent background (#FE6A00), near-black text (#020202), hover foreground background
 * - "ghost": plain mono text link style
 * - "destructive": red border and text, hover red fill with near-black text
 * - "icon": 44px square bordered
 */
export const Button = forwardRef(function Button(
  {
    variant = 'outline',
    size = 'md',
    pending = false,
    loading = false,
    isLoading = false,
    pendingLabel,
    chevron = false,
    scramble = true,
    disabled = false,
    className = '',
    children,
    ...props
  },
  ref
) {
  const isPending = Boolean(pending || loading || isLoading);
  const isDisabled = disabled || isPending;

  const baseStyles =
    'relative inline-flex items-center justify-center font-mono uppercase tracking-widest transition-colors select-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-[#FE6A00] disabled:opacity-40 disabled:cursor-not-allowed';

  let variantStyles = '';
  let sizeStyles = '';

  switch (variant) {
    case 'solid':
      variantStyles =
        'bg-[#FE6A00] text-[#020202] font-semibold border border-[#FE6A00] hover:bg-[#EEEEEE] hover:border-[#EEEEEE] hover:text-[#020202]';
      break;
    case 'ghost':
      variantStyles =
        'bg-transparent border border-transparent text-[#717171] hover:text-[#EEEEEE] hover:bg-transparent';
      break;
    case 'destructive':
      variantStyles =
        'bg-transparent border border-[#E7000B] text-[#F2554F] hover:bg-[#E7000B] hover:text-[#020202]';
      break;
    case 'icon':
      variantStyles =
        'w-11 h-11 p-0 bg-[#060606] border border-[#222222] text-[#EEEEEE] hover:border-[#FE6A00] hover:text-[#FE6A00]';
      break;
    case 'outline':
    default:
      variantStyles =
        'bg-[#060606] border border-[#EEEEEE]/20 text-[#EEEEEE] hover:border-[#FE6A00] hover:text-[#FE6A00]';
      break;
  }

  if (variant !== 'icon') {
    switch (size) {
      case 'sm':
        sizeStyles = 'h-9 px-4 text-[10px] tracking-wider';
        break;
      case 'lg':
        sizeStyles = 'h-12 px-7 text-xs';
        break;
      case 'md':
      default:
        sizeStyles = 'h-11 px-6 text-xs';
        break;
    }
  }

  // Pending display
  if (isPending) {
    const textToShow = pendingLabel || (typeof children === 'string' ? children : 'PROCESSING');
    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        disabled={true}
        {...props}
      >
        <span className="inline-flex items-center gap-1">
          <span>{textToShow}</span>
          <span className="cursor-blink font-bold text-[#FE6A00]">_</span>
        </span>
      </button>
    );
  }

  const renderContent = () => {
    if (variant === 'outline' && scramble && typeof children === 'string') {
      return <ScrambleText>{children}</ScrambleText>;
    }
    return children;
  };

  return (
    <button
      ref={ref}
      type={props.type || 'button'}
      className={cn(baseStyles, variantStyles, sizeStyles, className)}
      disabled={isDisabled}
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        {renderContent()}
        {chevron && <BitmapChevron size={14} />}
      </span>
    </button>
  );
});
