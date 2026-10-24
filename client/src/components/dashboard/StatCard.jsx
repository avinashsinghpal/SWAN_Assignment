import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card.jsx';
import { SplitFlapText } from '../landing/SplitFlapText.jsx';
import { useCountUp } from '../../hooks/useCountUp.js';
import { STATUS_CONFIG } from '../../lib/constants.js';
import { formatIndex } from '../../lib/formatters.js';
import { cn } from '../../lib/cn.js';

export function StatCard({
  label,
  count = 0,
  percentage,
  status,
  index = 1,
  isTotal = false,
  className = '',
}) {
  const navigate = useNavigate();
  const animatedCount = useCountUp(count, 0.8);
  const config = status ? STATUS_CONFIG[status] : null;
  const statusColor = config ? config.color : '#FE6A00';

  const handleClick = () => {
    if (isTotal) {
      navigate('/leads');
    } else if (status) {
      navigate(`/leads?status=${status}`);
    }
  };

  return (
    <Card
      interactive
      onClick={handleClick}
      className={cn(
        'relative flex flex-col justify-between p-5 md:p-6 overflow-hidden select-none',
        isTotal && 'xl:col-span-2',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-[#717171] font-mono">
          {label}
        </span>
        {config && (
          <span
            className="w-2 h-2"
            style={{ backgroundColor: statusColor }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Main Count */}
      <div className="my-3">
        {isTotal ? (
          <div className="pt-2">
            <SplitFlapText
              word={String(count)}
              fontSize="clamp(3.5rem, 6vw, 5rem)"
              hideSoundToggle={true}
              noReplay={true}
              mutedOverride={true}
            />
          </div>
        ) : (
          <div className="font-display text-6xl uppercase tracking-tight text-[#EEEEEE] leading-none">
            {animatedCount}
          </div>
        )}
      </div>

      {/* Bottom Sub-info & Index */}
      <div className="flex items-end justify-between font-mono pt-2">
        <div className="text-[11px] text-[#717171]">
          {percentage !== undefined ? (
            <span>
              <span className="text-[#EEEEEE] font-medium">{percentage}%</span> of total
            </span>
          ) : (
            <span>Global Pipeline</span>
          )}
        </div>

        <span className="text-[11px] text-[#333333] font-bold tracking-widest">
          {formatIndex(index)}
        </span>
      </div>

      {/* 1px proportional progress line along bottom edge */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-all duration-700"
        style={{
          width: isTotal ? '100%' : `${percentage || 0}%`,
          backgroundColor: statusColor,
          opacity: 0.6,
        }}
      />
    </Card>
  );
}
