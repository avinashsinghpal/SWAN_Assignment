import { Drawer } from '../ui/Drawer.jsx';
import { Select } from '../ui/Select.jsx';
import { DateInput } from '../ui/DateInput.jsx';
import { Button } from '../ui/Button.jsx';
import { StatusMarker } from '../ui/StatusTag.jsx';
import { LEAD_STATUSES } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

export function FilterSheet({
  open,
  onOpenChange,
  selectedStatuses,
  onToggleStatus,
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onCustomDateChange,
  sort,
  onSortChange,
  onClearFilters,
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="Leads / Filters"
      title="FILTER LEADS"
      description="Refine your pipeline view by status, date range, or sort criteria."
      footer={
        <div className="flex items-center justify-between gap-3 font-mono">
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
          <Button variant="solid" size="sm" onClick={() => onOpenChange(false)}>
            Apply Filters
          </Button>
        </div>
      }
    >
      <div className="space-y-6 font-mono text-xs">
        {/* Sort Select */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#717171] block">
            Sort Leads
          </label>
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

        {/* Status Multi-Select Chips */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#717171] block">
            Filter by Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LEAD_STATUSES.map((status) => {
              const isSelected = selectedStatuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onToggleStatus(status)}
                  className={cn(
                    'h-10 px-3 text-xs uppercase tracking-wider flex items-center gap-2 transition-colors border select-none',
                    isSelected
                      ? 'border-[#FE6A00] text-[#FE6A00] bg-[#FE6A00]/10'
                      : 'border-[#222222] text-[#717171] bg-[#060606] hover:border-[#EEEEEE]/30'
                  )}
                >
                  <StatusMarker status={status} size={8} />
                  <span>{status}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Presets */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#717171] block">
            Date Created
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Today', '7 Days', '30 Days'].map((preset) => {
              const isSelected = datePreset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onDatePresetChange(isSelected ? '' : preset)}
                  className={cn(
                    'h-10 px-2 text-xs uppercase tracking-wider border select-none transition-colors text-center',
                    isSelected
                      ? 'border-[#FE6A00] text-[#FE6A00] bg-[#FE6A00]/10'
                      : 'border-[#222222] text-[#717171] bg-[#060606] hover:border-[#EEEEEE]/30'
                  )}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="space-y-3 pt-2 border-t border-[#222222]/40">
          <label className="text-[10px] uppercase tracking-widest text-[#717171] block">
            Custom Date Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <DateInput
              label="From"
              value={dateFrom}
              onChange={(e) => onCustomDateChange(e.target.value, dateTo)}
            />
            <DateInput
              label="To"
              value={dateTo}
              onChange={(e) => onCustomDateChange(dateFrom, e.target.value)}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
