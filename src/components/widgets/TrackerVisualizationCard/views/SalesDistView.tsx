import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardCropData } from '../../../../data/dashboardMockData';

interface SalesDistViewProps {
  crops: DashboardCropData[];
}

// Custom tooltip component
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">Area: {data.area.toFixed(1)} ha</p>
        <p className="text-sm text-gray-600">Sold: {data.soldPercentage}%</p>
        <p className="text-sm text-gray-600">
          Avg. Price: £{data.avgPrice ? data.avgPrice.toFixed(2) : '0.00'}/t
        </p>
      </div>
    );
  }
  return null;
};

const SalesDistView: React.FC<SalesDistViewProps> = ({ crops }) => {
  // Sort crops by area for better visualization
  const sortedCrops = [...crops].sort((a, b) => b.area - a.area);

  // Prepare data for the chart
  const chartData = sortedCrops.map(crop => ({
    ...crop,
    // Use area for bar width (scaled down for better visibility)
    areaScale: Math.sqrt(crop.area) * 2, // Square root scale for better relative sizing
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barGap={2}
        >
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="soldPercentage"
            fill="#3B82F6" // blue-500
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          >
            {chartData.map((entry, index) => (
              <rect
                key={`rect-${index}`}
                width={entry.areaScale}
                fillOpacity={entry.soldPercentage > 0 ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesDistView;