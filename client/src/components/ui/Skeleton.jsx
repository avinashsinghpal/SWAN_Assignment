import { cn } from '../../lib/cn.js';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn('skeleton-box', className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function TableRowSkeleton({ columns = 6 }) {
  return (
    <tr className="border-b border-[#222222]/40">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
