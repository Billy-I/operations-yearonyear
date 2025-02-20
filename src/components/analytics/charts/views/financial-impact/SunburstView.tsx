import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { FinancialImpactSunburstViewProps } from '../../types/chart-types';

interface SunburstData {
  name: string;
  value: number;
  color: string;
  children?: SunburstData[];
}

const SunburstView: React.FC<FinancialImpactSunburstViewProps> = ({
  revenue,
  variableCosts,
  operationCosts,
  yield: yieldValue,
  pricePerTonne,
  costUnit,
  hectares
}) => {
  // Calculate values based on unit selection
  const adjustValue = (value: number) => costUnit === 'per_ha' ? value : value * hectares;
  
  const adjustedRevenue = adjustValue(revenue);
  const adjustedVariableCosts = adjustValue(variableCosts);
  const adjustedOperationCosts = adjustValue(operationCosts);
  const grossMargin = adjustedRevenue - adjustedVariableCosts;
  const netMargin = grossMargin - adjustedOperationCosts;

  // Format currency values
  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-£' : '£';
    const absValue = Math.abs(value);
    return `${prefix}${absValue.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;
  };

  // Prepare data for sunburst chart
  const data: SunburstData[] = [
    {
      name: 'Revenue',
      value: adjustedRevenue,
      color: '#10B981',
      children: [
        {
          name: 'Variable Costs',
          value: adjustedVariableCosts,
          color: '#4F46E5'
        },
        {
          name: 'Operation Costs',
          value: adjustedOperationCosts,
          color: '#7C3AED'
        },
        {
          name: 'Net Margin',
          value: netMargin,
          color: '#6B7280'
        }
      ]
    }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
        <p className="font-medium mb-2">{data.name}</p>
        <p className="text-sm">Value: {formatCurrency(data.value)}</p>
        {data.percentage && (
          <p className="text-sm mt-1">
            {data.percentage.toFixed(1)}% of Total
          </p>
        )}
      </div>
    );
  };

  // Calculate percentages and prepare data for visualization
  const outerData = data.map(item => ({
    ...item,
    percentage: 100
  }));

  const innerData = data[0].children?.map(item => ({
    ...item,
    percentage: (item.value / adjustedRevenue) * 100
  })) || [];

  return (
    <div className="h-full flex flex-col">
      {/* Supporting metrics */}
      <div className="mb-6 grid grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Yield</p>
          <p className="text-xl font-medium">{yieldValue.toFixed(2)} t/ha</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Price Achievement</p>
          <p className="text-xl font-medium">£{pricePerTonne.toFixed(2)}/t</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Margin Ratio</p>
          <p className="text-xl font-medium">
            {((netMargin / adjustedRevenue) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Sunburst chart */}
      <div className="flex-grow" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Outer ring (Revenue) */}
            <Pie
              data={outerData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              innerRadius="60%"
            >
              {outerData.map((entry, index) => (
                <Cell key={`cell-outer-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/* Inner ring (Costs and Margin) */}
            <Pie
              data={innerData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="55%"
              innerRadius="35%"
            >
              {innerData.map((entry, index) => (
                <Cell key={`cell-inner-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#10B981] mr-2" />
            <span>Revenue: {formatCurrency(adjustedRevenue)}</span>
          </div>
        </div>
        {innerData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.name}: {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SunburstView;