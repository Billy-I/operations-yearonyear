import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BreakEvenAnalysis } from '../../data/dashboardMockData';

interface BreakEvenWidgetProps {
  data: { [key: string]: BreakEvenAnalysis };
}

const BreakEvenWidget: React.FC<BreakEvenWidgetProps> = ({ data }) => {
  const [selectedCropId, setSelectedCropId] = useState(Object.keys(data)[0]);
  const selectedCrop = data[selectedCropId];

  const handleCropChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCropId(event.target.value);
  };

  const progressPercentage = (selectedCrop.actualSales / selectedCrop.breakEvenPoint) * 100;

  return (
    <div 
      className="p-6"
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Break-Even Analysis</h2>
        <select
          value={selectedCropId}
          onChange={handleCropChange}
          className="px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            background: '#FFFFFF'
          }}
        >
          {Object.values(data).map((crop) => (
            <option key={crop.cropId} value={crop.cropId}>
              {crop.cropName}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Break-even point: £{(selectedCrop.breakEvenPoint / 1000).toFixed(0)}k
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to Break-Even</span>
          <span>{progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: 'var(--yagro-brand)'
            }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={selectedCrop.monthlyData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6B7280' }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              stroke="#9CA3AF"
              tickFormatter={(value) => `£${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
              }}
              formatter={(value: number) => [`£${(value / 1000).toFixed(1)}k`]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="budgetedCosts"
              name="Budgeted Costs"
              stroke="#DC2626"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actualSales"
              name="Actual Sales"
              stroke="#059855"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div 
          className="p-3"
          style={{
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}
        >
          <div className="text-sm text-gray-600">Area</div>
          <div className="text-lg font-semibold text-gray-800">
            {selectedCrop.cropName}
          </div>
        </div>
        <div 
          className="p-3"
          style={{
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}
        >
          <div className="text-sm text-gray-600">Budgeted Costs</div>
          <div className="text-lg font-semibold text-gray-800">
            £{(selectedCrop.budgetedCosts / 1000).toFixed(0)}k
          </div>
        </div>
        <div 
          className="p-3"
          style={{
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}
        >
          <div className="text-sm text-gray-600">Actual Sales</div>
          <div className="text-lg font-semibold text-gray-800">
            £{(selectedCrop.actualSales / 1000).toFixed(0)}k
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakEvenWidget;