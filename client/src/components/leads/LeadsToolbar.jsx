import { useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { DateInput } from '../ui/DateInput.jsx';
import { Kbd } from '../ui/Kbd.jsx';
import { StatusMarker } from '../ui/StatusTag.jsx';
import { LEAD_STATUSES, STATUS_CONFIG } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

export function LeadsToolbar({
  search,
  onSearchChange,
  selectedStatuses,
  onToggleStatus,
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onCustomDateChange,
  sort,
  onSortChange,
  totalResults = 0,
  hasActiveFilters,
  onClearFilters,
  onOpenMobileFilters,
}) {
  const searchInputRef = useRef(null);

  // Keyboard shortcut "/" focuses search field if no input/textarea is focused
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA' &&
        document.activeElement.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeFiltersCount =
    (search ? 1 : 0) +
    selectedStatuses.length +
    (datePreset ? 1 : 0) +
    (sort !== 'newest' ? 1 : 0);

  return (
    <div className="sticky top-0 md:top-0 z-20 bg-[#020202] py-4 border-b border-[#222222]/60 font-mono space-y-3">
      {/* Top Row: Search, Sort, Mobile Filters Trigger, Results Count */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Input
            ref={searchInputRef}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, email, phone..."
            leftIcon={<Search size={14} className="text-[#717171]" />}
            rightIcon={<Kbd>/</Kbd>}
          />
        </div>

        {/* Right Tools (Desktop: Sort + Clear + Count; Mobile: Filter button) */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="md:hidden h-11 px-4 border border-[#222222] bg-[#060606] text-[#EEEEEE] text-xs uppercase tracking-wider flex items-center gap-2 hover:border-[#FE6A00]"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-[#FE6A00] text-[#020202] text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Desktop Sort Select */}
          <div className="hidden md:block w-44">
            <Select
              value={sort}
              onValueChange={onSortChange}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name_asc', label: 'Name (A-Z)' },
                { value: 'follow_up', label: 'Follow-up Date' },
              ]}
            />
          </div>

          {/* Result Count */}
          <div className="text-[11px] text-[#717171] uppercase tracking-wider shrink-0">
            <span className="text-[#EEEEEE] font-medium">{totalResults}</span> results
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs uppercase tracking-wider text-[#FE6A00] hover:underline flex items-center gap-1 shrink-0 ml-1"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Status Chips & Date Presets (Desktop) */}
      <div className="hidden md:flex items-center justify-between gap-4 pt-1">
        {/* Status Toggle Chips */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#717171] mr-1">Status:</span>
          {LEAD_STATUSES.map((status) => {
            const isSelected = selectedStatuses.includes(status);

            return (
              <button
                key={status}
                type="button"
                onClick={() => onToggleStatus(status)}
                className={cn(
                  'h-8 px-2.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border select-none',
                  isSelected
                    ? 'border-[#FE6A00] text-[#FE6A00] bg-[#FE6A00]/10'
                    : 'border-[#222222] text-[#717171] bg-[#060606] hover:border-[#EEEEEE]/30 hover:text-[#EEEEEE]'
                )}
              >
                <StatusMarker status={status} size={7} />
                <span>{status}</span>
              </button>
            );
          })}
        </div>

        {/* Date Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#717171] mr-1">Created:</span>
          {['Today', '7 Days', '30 Days'].map((preset) => {
            const isSelected = datePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onDatePresetChange(isSelected ? '' : preset)}
                className={cn(
                  'h-8 px-2.5 text-[10px] uppercase tracking-wider border select-none transition-colors',
                  isSelected
                    ? 'border-[#FE6A00] text-[#FE6A00] bg-[#FE6A00]/10'
                    : 'border-[#222222] text-[#717171] bg-[#060606] hover:border-[#EEEEEE]/30 hover:text-[#EEEEEE]'
                )}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
