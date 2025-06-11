import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { DashboardCropData } from '../../../../data/dashboardMockData';

interface YieldChangeViewProps {
  crops: DashboardCropData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">Current Yield: {data.yield_value.toFixed(2)} t/ha</p>
        <p className="text-sm text-gray-600">
          Change: {data.yield_change > 0 ? '+' : ''}{data.yield_change}%
        </p>
        <p className="text-sm text-gray-600">Area: {data.area.toFixed(1)} ha</p>
      </div>
    );
  }
  return null;
};

const YieldChangeView: React.FC<YieldChangeViewProps> = ({ crops }) => {
  const sortedCrops = [...crops].sort((a, b) => b.yield_change - a.yield_change);
  const maxChange = Math.max(...crops.map(c => Math.abs(c.yield_change)));
  const domain = [-Math.ceil(maxChange), Math.ceil(maxChange)];

  // Updated color logic using new palette
  const getBarColor = (change: number): string => {
    if (change > 5) return '#059855';  // Success 400 (Dark Green)
    if (change > 0) return '#6EE7B7';  // Success 300 (Light Green)
    if (change > -5) return '#FCA5A5'; // Danger 300 (Light Red)
    return '#DC2626';      // Danger 500 (Dark Red)
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={sortedCrops}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={domain}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#666666" strokeWidth={2} />
          <Bar
            dataKey="yield_change"
            radius={[4, 4, 4, 4]}
            maxBarSize={24}
          >
            {sortedCrops.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.yield_change)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
     {/* Updated Legend with direct hex codes */}
     <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
       <div className="flex items-center gap-1">
         <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getBarColor(6) }} />
         <span>&gt;5% increase</span>
       </div>
       <div className="flex items-center gap-1">
         <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getBarColor(1) }} />
         <span>0-5% increase</span>
       </div>
       <div className="flex items-center gap-1">
         <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getBarColor(-1) }} />
         <span>0-5% decrease</span>
       </div>
       <div className="flex items-center gap-1">
         <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getBarColor(-6) }} />
         <span>&gt;5% decrease</span>
       </div>
     </div>
    </div>
  );
};

export default YieldChangeView;