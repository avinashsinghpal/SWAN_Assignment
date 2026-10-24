import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card } from '../ui/Card.jsx';
import { STATUS_CONFIG } from '../../lib/constants.js';

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = STATUS_CONFIG[data.status]?.color || '#FE6A00';

    return (
      <div className="bg-[#030303] border border-[#222222] p-2.5 shadow-2xl font-mono text-xs">
        <p className="text-[10px] uppercase tracking-wider text-[#717171]">{data.status}</p>
        <p className="font-semibold text-sm mt-0.5" style={{ color }}>
          {data.count} <span className="text-[10px] text-[#8A8A8A]">leads</span>
        </p>
      </div>
    );
  }
  return null;
}

export function StatusChart({ data = [] }) {
  const chartData = data.map((d) => ({
    status: d.status,
    count: d.count,
    color: STATUS_CONFIG[d.status]?.color || '#8A8A8A',
  }));

  return (
    <Card className="flex flex-col justify-between p-6">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] font-mono">
          Distribution
        </p>
        <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
          Leads by status
        </h3>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="status"
              stroke="#222222"
              tickLine={false}
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
              cursor={{ fill: 'rgba(254, 106, 0, 0.06)' }}
            />
            <Bar dataKey="count" radius={0}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
