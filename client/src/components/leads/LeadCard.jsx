/**
 * LeadCard component.
 * Kanban card representing a single lead in the board view.
 */

import { Calendar, Mail, Phone, Building, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../ui/Badge.jsx';
import { cn } from '../../lib/cn.js';

export function LeadCard({
  lead,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const formatDate = (d) => {
    if (!d) return null;
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const isFollowUpOverdue = () => {
    if (!lead.followUpDate) return false;
    const due = new Date(lead.followUpDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div
      onClick={() => onView(lead)}
      className="p-3.5 bg-white dark:bg-[var(--color-dark-card)] rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-2xs hover:shadow-md transition-all duration-150 cursor-pointer group flex flex-col justify-between gap-3 relative"
    >
      <div>
        {/* Header row with Name and Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] truncate group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
              {lead.name}
            </h4>
            {lead.company && (
              <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] truncate flex items-center gap-1 mt-0.5">
                <Building size={11} /> {lead.company}
              </p>
            )}
          </div>

          {/* Action Menu */}
          <div className="relative shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Lead actions"
            >
              <MoreVertical size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] py-1 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onView(lead);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <Eye size={13} /> View Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(lead);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(lead);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Service Tag */}
        <div className="mt-2.5">
          <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 rounded-md">
            {lead.serviceInterested}
          </span>
        </div>
      </div>

      {/* Footer row with follow-up date and assigned user */}
      <div className="pt-2 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] flex items-center justify-between text-[11px] text-[var(--color-ink-subtle)]">
        {lead.followUpDate ? (
          <span
            className={cn(
              'flex items-center gap-1 font-medium',
              isFollowUpOverdue()
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'
            )}
            title={isFollowUpOverdue() ? 'Follow-up overdue' : 'Scheduled follow-up'}
          >
            <Calendar size={12} /> {formatDate(lead.followUpDate)}
          </span>
        ) : (
          <span className="text-gray-400">No follow-up</span>
        )}

        <div className="flex items-center gap-1.5">
          {lead.assignedTo?.name ? (
            <div
              className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-700 dark:text-gray-200"
              title={`Assigned to ${lead.assignedTo.name}`}
            >
              {lead.assignedTo.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <span className="text-[10px] text-gray-400">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
