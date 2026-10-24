/**
 * Pagination component with page controls and page size selector.
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const PAGE_SIZES = [10, 25, 50];

/**
 * @param {object} props
 * @param {number} props.page - Current page (1-indexed)
 * @param {number} props.pageSize - Items per page
 * @param {number} props.total - Total items
 * @param {number} props.totalPages - Total pages
 * @param {function} props.onPageChange - (page: number) => void
 * @param {function} props.onPageSizeChange - (pageSize: number) => void
 */
export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Left: count info */}
      <p className="text-sm text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)] tabular-nums">
        {total === 0 ? 'No results' : `${from}–${to} of ${total}`}
      </p>

      {/* Center: page controls */}
      <div className="flex items-center gap-1">
        <PaginationBtn
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={15} />
        </PaginationBtn>
        <PaginationBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </PaginationBtn>

        <span className="px-3 text-sm text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] tabular-nums">
          {page} / {totalPages || 1}
        </span>

        <PaginationBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </PaginationBtn>
        <PaginationBtn
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={15} />
        </PaginationBtn>
      </div>

      {/* Right: page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)]">
          Per page:
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-card)] text-sm text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] px-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          aria-label="Rows per page"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PaginationBtn({ children, disabled, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
        'flex items-center justify-center',
        'text-[var(--color-ink-muted)] dark:text-[var(--color-dark-ink-muted)]',
        'bg-white dark:bg-[var(--color-dark-card)]',
        'hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)]',
        'transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed'
      )}
      {...props}
    >
      {children}
    </button>
  );
}
