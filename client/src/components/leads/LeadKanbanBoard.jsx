/**
 * LeadKanbanBoard component.
 * Visual board grouping leads into 5 pipeline columns:
 * New, Contacted, Qualified, Converted, Lost.
 */

import { Plus } from 'lucide-react';
import { LeadCard } from './LeadCard.jsx';
import { Button } from '../ui/Button.jsx';
import { cn } from '../../lib/cn.js';

const COLUMNS = [
  { id: 'New', label: 'New', color: 'border-t-blue-500' },
  { id: 'Contacted', label: 'Contacted', color: 'border-t-amber-500' },
  { id: 'Qualified', label: 'Qualified', color: 'border-t-purple-500' },
  { id: 'Converted', label: 'Converted', color: 'border-t-emerald-500' },
  { id: 'Lost', label: 'Lost', color: 'border-t-rose-500' },
];

export function LeadKanbanBoard({
  leads = [],
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNew,
}) {
  // Group leads by status
  const groupedLeads = COLUMNS.reduce((acc, col) => {
    acc[col.id] = leads.filter((lead) => lead.status === col.id);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnLeads = groupedLeads[col.id] || [];

        return (
          <div
            key={col.id}
            className={cn(
              'flex flex-col min-w-[260px] bg-gray-50/70 dark:bg-gray-800/40 rounded-xl p-3 border border-[var(--color-border)] dark:border-[var(--color-dark-border)] border-t-4',
              col.color
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
                  {col.label}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-gray-900 border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-gray-600 dark:text-gray-300">
                  {columnLeads.length}
                </span>
              </div>

              {col.id === 'New' && onAddNew && (
                <button
                  type="button"
                  onClick={onAddNew}
                  className="p-1 text-teal-700 dark:text-teal-400 hover:bg-white dark:hover:bg-gray-800 rounded-md transition-colors"
                  title="Add lead"
                >
                  <Plus size={15} />
                </button>
              )}
            </div>

            {/* Column Card List */}
            <div className="flex-1 space-y-3 min-h-[300px]">
              {columnLeads.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-[var(--color-ink-subtle)] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  No leads in {col.label}
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
