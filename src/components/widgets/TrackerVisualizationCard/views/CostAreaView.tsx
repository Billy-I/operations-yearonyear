import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis, Cell } from 'recharts';
import { DashboardCropData } from '../../../../data/dashboardMockData';

interface CostAreaViewProps {
  crops: DashboardCropData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">Area: {data.area.toFixed(1)} ha</p>
        <p className="text-sm text-gray-600">Cost: £{data.costToDate_value.toFixed(2)}/ha</p>
        <p className="text-sm text-gray-600">
          Change: {data.costToDate_change > 0 ? '+' : ''}{data.costToDate_change}%
        </p>
        <p className="text-sm text-gray-600">Yield: {data.yield_value.toFixed(2)} t/ha</p>
      </div>
    );
  }
  return null;
};

const CostAreaView: React.FC<CostAreaViewProps> = ({ crops }) => {
  // Prepare data for the scatter plot
  const plotData = crops.map(crop => ({
    ...crop,
    // Use yield as a factor for point size
    yieldFactor: Math.max(crop.yield_value, 1) * 2
  }));

  // Calculate domain margins for better visualization
  const maxArea = Math.max(...crops.map(c => c.area));
  const maxCost = Math.max(...crops.map(c => c.costToDate_value));
  const areaMargin = maxArea * 0.1;
  const costMargin = maxCost * 0.1;

  // Color based on cost change
  const getPointColor = (change: number) => {
    if (change > 10) return '#EF4444'; // red-500 for significant increase
    if (change > 0) return '#FCA5A5';  // red-300 for small increase
    if (change > -10) return '#86EFAC'; // green-300 for small decrease
    return '#22C55E'; // green-500 for significant decrease
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="area"
            name="Area"
            domain={[0, maxArea + areaMargin]}
            tickFormatter={(value) => `${value.toFixed(0)} ha`}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Area (ha)', 
              position: 'bottom',
              offset: 0,
              fontSize: 12
            }}
          />
          <YAxis
            type="number"
            dataKey="costToDate_value"
            name="Cost"
            domain={[0, maxCost + costMargin]}
            tickFormatter={(value) => `£${value.toFixed(0)}`}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Cost per ha', 
              angle: -90,
              position: 'left',
              offset: 40,
              fontSize: 12
            }}
          />
          <ZAxis 
            type="number" 
            dataKey="yieldFactor" 
            range={[50, 400]} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={plotData}
            shape="circle"
          >
            {plotData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getPointColor(entry.costToDate_change)}
                fillOpacity={0.7}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>&gt;10% decrease</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-300" />
          <span>0-10% decrease</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-300" />
          <span>0-10% increase</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>&gt;10% increase</span>
        </div>
      </div>

      {/* Point size explanation */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Point size indicates yield (t/ha)
      </p>
    </div>
  );
};

export default CostAreaView;