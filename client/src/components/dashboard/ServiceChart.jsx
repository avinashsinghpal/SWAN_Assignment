import { useState } from 'react';
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

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#030303] border border-[#222222] p-2.5 shadow-2xl font-mono text-xs">
        <p className="text-[10px] uppercase tracking-wider text-[#717171]">{data.service}</p>
        <p className="text-[#FE6A00] font-semibold text-sm mt-0.5">
          {data.count} <span className="text-[10px] text-[#8A8A8A]">leads</span>
        </p>
      </div>
    );
  }
  return null;
}

export function ServiceChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Take top services
  const chartData = data.slice(0, 6);

  return (
    <Card className="flex flex-col justify-between p-6">
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#FE6A00] font-mono">
          Demand
        </p>
        <h3 className="font-display text-2xl uppercase tracking-wide text-[#EEEEEE]">
          By service
        </h3>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis
              type="number"
              stroke="#222222"
              tickLine={false}
              tick={{ fill: '#717171', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="service"
              stroke="#222222"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={{ fill: '#717171', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(254, 106, 0, 0.06)' }}
            />
            <Bar
              dataKey="count"
              radius={0}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoveredIndex === index ? '#FE6A00' : '#8A8A8A'}
                  className="transition-colors duration-150 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
