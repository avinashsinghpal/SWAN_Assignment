import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../ui/Card.jsx';
import { formatDate } from '../../lib/formatters.js';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#030303] border border-[#222222] p-2.5 shadow-2xl font-mono text-xs">
        <p className="text-[10px] uppercase tracking-wider text-[#717171]">{formatDate(label)}</p>
        <p className="text-[#FE6A00] font-semibold text-sm mt-0.5">
          {payload[0].value} <span className="text-[10px] text-[#8A8A8A]">new leads</span>
        </p>
      </div>
    );
  }
  return null;
}

export function TrendChart({ data = [] }) {
  // Format dates for display
  const chartData = data.map((d) => ({
    ...d,
    formattedDate: formatDate(d.date),
  }));

  return (
    <Card className="flex flex-col justify-between p-6 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] font-mono">
            Velocity
          </p>
          <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
            Last 30 days
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#717171] font-mono">
          New Leads Volume
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              horizontal={true}
              stroke="#161616"
            />
            <XAxis
              dataKey="date"
              stroke="#222222"
              tickLine={false}
              interval={4} // Tick every 5 days
              tickFormatter={(date) => formatDate(date)}
              tick={{ fill: '#717171', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            />
            <YAxis
              stroke="#222222"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#717171', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#FE6A00', strokeWidth: 1, strokeDasharray: '2 2' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#FE6A00"
              strokeWidth={1.5}
              fill="rgba(254, 106, 0, 0.12)"
              dot={false}
              activeDot={{
                r: 4,
                stroke: '#FE6A00',
                strokeWidth: 2,
                fill: '#020202',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
