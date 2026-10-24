import { formatDateTime } from '../../lib/formatters.js';
import { cn } from '../../lib/cn.js';

export function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="p-6 border border-[#222222]/40 bg-[#060606] text-center font-mono text-xs text-[#717171]">
        No audit activity recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 font-mono text-xs before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#222222]">
      {activities.map((act, idx) => {
        const isStatusChange = act.type === 'STATUS_CHANGED';
        const userName = act.user?.name || act.user?.email || 'System';
        const changes = act.changes || {};

        return (
          <div
            key={act._id || idx}
            className="relative space-y-1.5"
            style={{
              animation: `slide-up 0.4s ease forwards ${idx * 0.06}s`,
            }}
          >
            {/* 7px Square Marker on the vertical 1px line */}
            <span
              className={cn(
                'absolute -left-[27px] top-1.5 w-[7px] h-[7px]',
                isStatusChange ? 'bg-[#FE6A00]' : 'bg-[#222222] border border-[#717171]'
              )}
              aria-hidden="true"
            />

            {/* Header: Timestamp and User */}
            <div className="flex items-center justify-between text-[10px] text-[#717171] uppercase tracking-wider">
              <span>{formatDateTime(act.createdAt)}</span>
              <span className="text-[#8A8A8A] font-medium">{userName}</span>
            </div>

            {/* Message */}
            <p className="text-[#EEEEEE] text-xs leading-relaxed">
              {act.message}
            </p>

            {/* Changes: old value -> new value in bordered mono chips */}
            {changes && Object.keys(changes).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(changes).map(([field, delta]) => {
                  if (!delta || (delta.old === undefined && delta.new === undefined)) return null;
                  return (
                    <div
                      key={field}
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#717171] uppercase tracking-wider"
                    >
                      <span>{field}:</span>
                      <span className="px-1.5 py-0.5 border border-[#222222] bg-[#121212] text-[#8A8A8A]">
                        {String(delta.old ?? 'none')}
                      </span>
                      <span>-&gt;</span>
                      <span className="px-1.5 py-0.5 border border-[#FE6A00]/40 bg-[#FE6A00]/10 text-[#FE6A00]">
                        {String(delta.new ?? 'none')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
