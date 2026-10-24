import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table.jsx';
import { StatusTag } from '../ui/StatusTag.jsx';
import { Tooltip } from '../ui/Tooltip.jsx';
import { formatDate, formatIndex, isOverdue } from '../../lib/formatters.js';
import { Eye, Edit3, Trash2 } from 'lucide-react';

const LeadRow = memo(function LeadRow({
  lead,
  index,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const leadId = lead._id || lead.id;
  const leadOverdue = lead.followUpDate ? isOverdue(lead.followUpDate) : false;

  const handleRowClick = () => {
    navigate(`/leads/${leadId}`);
  };

  return (
    <TableRow onClick={handleRowClick} className="group">
      {/* Index */}
      <TableCell className="w-12 text-[#717171] font-mono text-[11px]">
        {formatIndex(index)}
      </TableCell>

      {/* Name + Email */}
      <TableCell className="min-w-[200px]">
        <div>
          <p className="font-sans font-medium text-sm text-[#EEEEEE] group-hover:text-[#FE6A00] transition-colors leading-tight">
            {lead.name}
          </p>
          <p className="font-mono text-[11px] text-[#717171] truncate max-w-[220px]">
            {lead.email}
          </p>
        </div>
      </TableCell>

      {/* Company */}
      <TableCell className="text-[#8A8A8A] max-w-[140px] truncate">
        <Tooltip content={lead.company || '—'}>
          <span className="truncate block">{lead.company || '—'}</span>
        </Tooltip>
      </TableCell>

      {/* Service */}
      <TableCell className="text-[#8A8A8A] max-w-[150px] truncate">
        <Tooltip content={lead.serviceInterested}>
          <span className="truncate block">{lead.serviceInterested}</span>
        </Tooltip>
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusTag status={lead.status} />
      </TableCell>

      {/* Follow-up */}
      <TableCell>
        {lead.followUpDate ? (
          <div className="flex items-center gap-2">
            <span className="text-[#8A8A8A]">{formatDate(lead.followUpDate)}</span>
            {leadOverdue && (
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[#FE6A00] text-[#FE6A00]">
                OVERDUE
              </span>
            )}
          </div>
        ) : (
          <span className="text-[#333333]">—</span>
        )}
      </TableCell>

      {/* Created */}
      <TableCell className="text-[#8A8A8A]">
        {formatDate(lead.createdAt)}
      </TableCell>

      {/* Actions (hover revealed) */}
      <TableCell
        className="text-right w-40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="opacity-0 group-hover:opacity-100 flex items-center justify-end gap-2 transition-opacity font-mono text-[10px] uppercase tracking-wider">
          <button
            type="button"
            onClick={() => navigate(`/leads/${leadId}`)}
            className="text-[#717171] hover:text-[#EEEEEE] inline-flex items-center gap-1 p-1"
          >
            <Eye size={12} /> View
          </button>
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="text-[#717171] hover:text-[#FE6A00] inline-flex items-center gap-1 p-1"
          >
            <Edit3 size={12} /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="text-[#717171] hover:text-[#F2554F] inline-flex items-center gap-1 p-1"
          >
            <Trash2 size={12} /> Del
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
});

export function LeadsTable({
  leads = [],
  page = 1,
  pageSize = 10,
  isFetching = false,
  sort,
  onSort,
  onEdit,
  onDelete,
}) {
  return (
    <Table isFetching={isFetching}>
      <TableHeader>
        <tr>
          <TableHead className="w-12">#</TableHead>
          <TableHead
            sortable
            sorted={sort === 'name_asc' ? 'asc' : null}
            onSort={() => onSort(sort === 'name_asc' ? 'newest' : 'name_asc')}
          >
            Lead
          </TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead
            sortable
            sorted={sort === 'follow_up' ? 'asc' : null}
            onSort={() => onSort(sort === 'follow_up' ? 'newest' : 'follow_up')}
          >
            Follow-up
          </TableHead>
          <TableHead
            sortable
            sorted={sort === 'oldest' ? 'asc' : sort === 'newest' ? 'desc' : null}
            onSort={() => onSort(sort === 'newest' ? 'oldest' : 'newest')}
          >
            Created
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </tr>
      </TableHeader>

      <TableBody>
        {leads.map((lead, idx) => (
          <LeadRow
            key={lead._id || lead.id}
            lead={lead}
            index={(page - 1) * pageSize + idx + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}
