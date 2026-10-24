import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card.jsx';
import { StatusTag } from '../ui/StatusTag.jsx';
import { formatDate } from '../../lib/formatters.js';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState.jsx';

export function RecentLeads({ leads = [] }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 w-full">
      <div className="flex items-center justify-between pb-4 border-b border-[#222222]/40 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] font-mono">
            Pipeline
          </p>
          <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
            Recent leads
          </h3>
        </div>

        <Link
          to="/leads"
          className="text-xs uppercase tracking-widest text-[#717171] hover:text-[#FE6A00] font-mono inline-flex items-center gap-1.5 transition-colors"
        >
          View all leads <ArrowRight size={13} />
        </Link>
      </div>

      {leads.length === 0 ? (
        <EmptyState
          title="NO RECENT LEADS"
          description="New leads captured via marketing forms or manual entry will appear here."
          actionLabel="ADD FIRST LEAD"
          onAction={() => navigate('/leads?drawer=new')}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#222222] text-[10px] uppercase tracking-widest text-[#717171]">
                <th className="py-2.5 px-3">Lead</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]/30">
              {leads.map((lead) => {
                const leadId = lead._id || lead.id;
                return (
                  <tr
                    key={leadId}
                    onClick={() => navigate(`/leads/${leadId}`)}
                    className="app-table-row cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <p className="font-medium text-[#EEEEEE]">{lead.name}</p>
                      <p className="text-[10px] text-[#717171]">{lead.email}</p>
                    </td>
                    <td className="py-3 px-3 text-[#8A8A8A]">{lead.company || '—'}</td>
                    <td className="py-3 px-3 text-[#8A8A8A]">{lead.serviceInterested}</td>
                    <td className="py-3 px-3">
                      <StatusTag status={lead.status} />
                    </td>
                    <td className="py-3 px-3 text-right text-[#8A8A8A]">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
