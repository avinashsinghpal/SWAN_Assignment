import { StatusTag } from '../ui/StatusTag.jsx';
import { formatDate, formatIndex, isOverdue } from '../../lib/formatters.js';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card.jsx';

export function LeadCard({
  lead,
  index = 1,
  onView,
  onEdit,
  onDelete,
}) {
  const leadOverdue = lead.followUpDate ? isOverdue(lead.followUpDate) : false;

  return (
    <Card className="p-5 font-mono space-y-4">
      {/* Top Row: Index label + StatusTag */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222222]/40">
        <span className="text-[11px] text-[#717171] uppercase tracking-widest">
          No. {formatIndex(index)}
        </span>
        <StatusTag status={lead.status} />
      </div>

      {/* Lead Name & Info */}
      <div onClick={onView} className="cursor-pointer space-y-1">
        <h3 className="font-display text-3xl uppercase tracking-wide text-[#EEEEEE] leading-tight hover:text-[#FE6A00] transition-colors">
          {lead.name}
        </h3>
        <p className="text-xs text-[#717171]">{lead.email}</p>
        <div className="flex items-center gap-3 text-xs text-[#8A8A8A] pt-1">
          <span>{lead.company || 'Individual'}</span>
          <span>•</span>
          <span>{lead.serviceInterested}</span>
        </div>
      </div>

      {/* Follow-up date */}
      {lead.followUpDate && (
        <div className="pt-2 border-t border-[#222222]/30 flex items-center justify-between text-xs">
          <span className="text-[10px] uppercase tracking-wider text-[#717171]">
            Follow-up
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#8A8A8A]">{formatDate(lead.followUpDate)}</span>
            {leadOverdue && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-[#FE6A00] text-[#FE6A00]">
                OVERDUE
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3 Action Buttons (44px min height for touch) */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222222]/40">
        <button
          type="button"
          onClick={onView}
          className="h-11 border border-[#222222] bg-[#060606] text-[#EEEEEE] text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-[#FE6A00] hover:text-[#FE6A00] transition-colors"
        >
          <Eye size={14} /> View
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="h-11 border border-[#222222] bg-[#060606] text-[#EEEEEE] text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-[#FE6A00] hover:text-[#FE6A00] transition-colors"
        >
          <Edit3 size={14} /> Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="h-11 border border-[#222222] bg-[#060606] text-[#F2554F] text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 hover:border-[#E7000B] hover:bg-[#E7000B] hover:text-[#020202] transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </Card>
  );
}
