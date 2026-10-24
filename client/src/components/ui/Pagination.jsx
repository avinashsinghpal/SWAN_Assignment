import { formatIndex } from '../../lib/formatters.js';
import { Select } from './Select.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  className = '',
}) {
  const safeTotalPages = Math.max(1, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= safeTotalPages;

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-[#222222]/60 font-mono text-xs',
        className
      )}
    >
      {/* Left: Total count label */}
      <div className="text-[11px] text-[#717171] uppercase tracking-wider">
        Total: <span className="text-[#EEEEEE] font-medium">{totalItems}</span> items
      </div>

      {/* Right: Page controls and Page Size */}
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#717171]">Per page</span>
            <div className="w-20">
              <Select
                value={String(pageSize)}
                onValueChange={(val) => onPageSizeChange(Number(val))}
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Counter */}
        <div className="text-xs text-[#EEEEEE] tracking-widest px-2">
          {formatIndex(currentPage)} <span className="text-[#717171]">/</span> {formatIndex(safeTotalPages)}
        </div>

        {/* Square prev / next buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={isFirst}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-9 h-9 flex items-center justify-center bg-[#060606] border border-[#222222] text-[#EEEEEE] hover:border-[#FE6A00] hover:text-[#FE6A00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={isLast}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-9 h-9 flex items-center justify-center bg-[#060606] border border-[#222222] text-[#EEEEEE] hover:border-[#FE6A00] hover:text-[#FE6A00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
