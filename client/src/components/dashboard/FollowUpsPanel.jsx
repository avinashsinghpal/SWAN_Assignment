import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card.jsx';
import { formatDate, formatIndex } from '../../lib/formatters.js';
import { EmptyState } from '../ui/EmptyState.jsx';
import { cn } from '../../lib/cn.js';

export function FollowUpsPanel({ data = { overdue: [], today: [], upcoming: [] } }) {
  const navigate = useNavigate();

  const overdue = data.overdue || [];
  const today = data.today || [];
  const upcoming = data.upcoming || [];
  const totalFollowUps = overdue.length + today.length + upcoming.length;

  if (totalFollowUps === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] font-mono">
            Agenda
          </p>
          <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
            Follow-ups
          </h3>
        </div>
        <EmptyState
          title="NO PENDING FOLLOW-UPS"
          description="All lead follow-ups have been resolved or none are scheduled."
        />
      </Card>
    );
  }

  const renderGroup = (items, groupLabel, tagType) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-[#717171] font-mono pb-1 border-b border-[#222222]/40">
          {groupLabel} ({items.length})
        </p>

        <div className="divide-y divide-[#222222]/30">
          {items.map((lead, idx) => {
            const leadId = lead._id || lead.id;
            return (
              <div
                key={leadId}
                onClick={() => navigate(`/leads/${leadId}`)}
                className="app-table-row flex items-center justify-between p-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] text-[#717171] font-mono shrink-0">
                    {formatIndex(idx + 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-2xl uppercase text-[#EEEEEE] leading-none truncate">
                      {lead.name}
                    </p>
                    <p className="text-[11px] text-[#717171] font-mono truncate mt-0.5">
                      {lead.company || lead.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4 font-mono">
                  <span className="text-[11px] text-[#8A8A8A] hidden sm:inline">
                    {formatDate(lead.followUpDate)}
                  </span>

                  {tagType === 'overdue' && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#FE6A00] text-[#FE6A00] bg-[#020202]">
                      OVERDUE
                    </span>
                  )}
                  {tagType === 'today' && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#EEEEEE] text-[#EEEEEE] bg-[#020202]">
                      TODAY
                    </span>
                  )}
                  {tagType === 'upcoming' && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#717171] text-[#717171] bg-[#020202]">
                      UPCOMING
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col justify-between p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] font-mono">
            Agenda
          </p>
          <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
            Follow-ups
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#FE6A00] font-mono">
          {overdue.length > 0 ? `${overdue.length} Overdue` : 'On Schedule'}
        </span>
      </div>

      <div className="space-y-6 max-h-[300px] overflow-y-auto pr-1">
        {renderGroup(overdue, 'Overdue', 'overdue')}
        {renderGroup(today, 'Today', 'today')}
        {renderGroup(upcoming, 'Upcoming', 'upcoming')}
      </div>
    </Card>
  );
}
