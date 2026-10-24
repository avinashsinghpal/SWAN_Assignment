import { STATUS_CONFIG } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

/**
 * Marker SVG for each status shape:
 * - New: hollow square
 * - Contacted: half-filled square
 * - Qualified: filled square
 * - Converted: square with check line
 * - Lost: square with slash line
 */
export function StatusMarker({ status, size = 8 }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.New;
  const color = config.color;

  switch (config.shape) {
    case 'hollow':
      return (
        <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="7" height="7" stroke={color} strokeWidth="1" />
        </svg>
      );
    case 'half':
      return (
        <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="7" height="7" stroke={color} strokeWidth="1" />
          <rect x="0.5" y="0.5" width="3.5" height="7" fill={color} />
        </svg>
      );
    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="7" height="7" stroke={color} strokeWidth="1" />
          <path d="M2 4.2 L3.2 5.5 L6 2.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
        </svg>
      );
    case 'slash':
      return (
        <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="7" height="7" stroke={color} strokeWidth="1" />
          <line x1="1.5" y1="6.5" x2="6.5" y2="1.5" stroke={color} strokeWidth="1" />
        </svg>
      );
    case 'filled':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <rect width="8" height="8" fill={color} />
        </svg>
      );
  }
}

export function StatusTag({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || { color: '#8A8A8A', label: status || 'Unknown' };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider select-none bg-[#020202]',
        className
      )}
      style={{
        border: `1px solid ${config.color}66`, // 40% opacity border
        color: config.color,
      }}
    >
      <StatusMarker status={status} size={8} />
      <span>{config.label}</span>
    </span>
  );
}
