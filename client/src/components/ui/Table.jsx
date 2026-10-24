import { cn } from '../../lib/cn.js';

export function Table({ children, className = '', isFetching = false }) {
  return (
    <div className="relative w-full overflow-x-auto border border-[#222222]/60 bg-[#060606]">
      {/* 1px accent loading indicator when fetching */}
      {isFetching && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FE6A00] animate-pulse z-20" />
      )}
      <table className={cn('w-full text-left border-collapse font-mono text-xs', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead
      className={cn(
        'sticky top-0 z-10 bg-[#030303] border-b border-[#222222] font-mono text-[10px] uppercase tracking-widest text-[#717171]',
        className
      )}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return <tbody className={cn('divide-y divide-[#222222]/40', className)}>{children}</tbody>;
}

export function TableRow({ children, className = '', onClick, ...props }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'app-table-row border-b border-[#222222]/40 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '', sortable = false, sorted = null, onSort, ...props }) {
  return (
    <th
      scope="col"
      aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
      onClick={sortable ? onSort : undefined}
      className={cn(
        'px-4 py-3.5 font-medium whitespace-nowrap',
        sortable && 'cursor-pointer hover:text-[#EEEEEE] select-none',
        className
      )}
      {...props}
    >
      <div className="inline-flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="text-[10px] text-[#FE6A00]">
            {sorted === 'asc' ? '▲' : sorted === 'desc' ? '▼' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td
      className={cn('px-4 py-3.5 text-[#EEEEEE] align-middle whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </td>
  );
}
