/**
 * LeadFilters component.
 * Search bar with debouncing, status filter, service filter, sort selector, and clear button.
 */

import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Converted', label: 'Converted' },
  { value: 'Lost', label: 'Lost' },
];

const SERVICE_OPTIONS = [
  { value: '', label: 'All Services' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile App Development', label: 'Mobile App Development' },
  { value: 'SEO', label: 'SEO' },
  { value: 'Social Media Marketing', label: 'Social Media Marketing' },
  { value: 'Performance Marketing', label: 'Performance Marketing' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Custom Software', label: 'Custom Software' },
  { value: 'Other', label: 'Other' },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: '-name', label: 'Name (Z-A)' },
  { value: 'followUpDate', label: 'Follow-up Date (Earliest)' },
  { value: '-followUpDate', label: 'Follow-up Date (Latest)' },
];

export function LeadFilters({
  filters,
  onChange,
  onReset,
  totalCount = 0,
}) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onChange({ ...filters, search: searchTerm, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, filters, onChange]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    Boolean(filters.serviceInterested) ||
    (filters.sort && filters.sort !== '-createdAt');

  const handleStatusChange = (e) => {
    onChange({ ...filters, status: e.target.value, page: 1 });
  };

  const handleServiceChange = (e) => {
    onChange({ ...filters, serviceInterested: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    onChange({ ...filters, sort: e.target.value, page: 1 });
  };

  const handleClear = () => {
    setSearchTerm('');
    onReset();
  };

  return (
    <div className="bg-white dark:bg-[var(--color-dark-card)] p-4 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, email, or company..."
            leftIcon={<Search size={16} />}
            rightIcon={
              searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={15} />
                </button>
              ) : null
            }
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <Select
            value={filters.status || ''}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Service Filter */}
        <div className="w-full md:w-52">
          <Select
            value={filters.serviceInterested || ''}
            onChange={handleServiceChange}
            options={SERVICE_OPTIONS}
          />
        </div>

        {/* Sort Filter */}
        <div className="w-full md:w-48">
          <Select
            value={filters.sort || '-createdAt'}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] pt-1">
        <span>
          Showing <strong className="text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">{totalCount}</strong> {totalCount === 1 ? 'lead' : 'leads'}
        </span>
        {hasActiveFilters && (
          <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
            <SlidersHorizontal size={13} /> Filter active
          </span>
        )}
      </div>
    </div>
  );
}
