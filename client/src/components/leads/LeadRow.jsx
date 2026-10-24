/**
 * LeadRow component.
 * Single row inside the Leads table.
 */

import { Calendar, Mail, Phone, Building, MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '../ui/Badge.jsx';
import { cn } from '../../lib/cn.js';

export function LeadRow({
  lead,
  onView,
  onEdit,
  onDelete,
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
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '-';
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
    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] group">
      {/* Name & Company */}
      <td className="px-4 py-3.5">
        <div
          className="cursor-pointer"
          onClick={() => onView(lead)}
        >
          <p className="text-sm font-semibold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
            {lead.name}
          </p>
          {lead.company && (
            <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)] flex items-center gap-1 mt-0.5">
              <Building size={12} /> {lead.company}
            </p>
          )}
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-4 py-3.5">
        <div className="space-y-0.5 text-xs">
          <a
            href={`mailto:${lead.email}`}
            className="text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail size={12} className="text-gray-400 shrink-0" /> {lead.email}
          </a>
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="text-[var(--color-ink-subtle)] hover:text-teal-700 dark:hover:text-teal-400 flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={12} className="text-gray-400 shrink-0" /> {lead.phone}
            </a>
          )}
        </div>
      </td>

      {/* Service Interested */}
      <td className="px-4 py-3.5">
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-md bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300">
          {lead.serviceInterested}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <Badge status={lead.status}>{lead.status}</Badge>
      </td>

      {/* Follow-up Date */}
      <td className="px-4 py-3.5">
        {lead.followUpDate ? (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium',
              isFollowUpOverdue()
                ? 'text-red-600 dark:text-red-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300'
            )}
          >
            <Calendar size={13} className={isFollowUpOverdue() ? 'text-red-500' : 'text-gray-400'} />
            {formatDate(lead.followUpDate)}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>

      {/* Assigned Specialist */}
      <td className="px-4 py-3.5">
        {lead.assignedTo?.name ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-[11px] font-semibold text-teal-800 dark:text-teal-300">
              {lead.assignedTo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
              {lead.assignedTo.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Unassigned</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right relative">
        <div className="flex items-center justify-end gap-1" ref={menuRef}>
          <button
            type="button"
            onClick={() => onView(lead)}
            className="p-1.5 text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="p-1.5 text-gray-500 hover:text-teal-700 dark:hover:text-teal-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Edit Lead"
          >
            <Edit2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Delete Lead"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
