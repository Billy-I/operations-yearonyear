import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { FinancialImpactStackedViewProps } from '../../types/chart-types';

const FinancialImpactStackedView: React.FC<FinancialImpactStackedViewProps> = ({
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

  // Transform data for stacked bar chart
  const data = [
    {
      name: 'Financial Breakdown',
      Revenue: adjustedRevenue,
      'Variable Costs': -adjustedVariableCosts,
      'Operation Costs': -adjustedOperationCosts,
      'Net Margin': netMargin
    }
  ];

  // Format currency values
  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-£' : '£';
    const absValue = Math.abs(value);
    return `${prefix}${absValue.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

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

      {/* Stacked Bar Chart */}
      <div className="flex-grow" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => `£${Math.abs(value)}`}
              label={{
                value: `Amount (${costUnit === 'per_ha' ? '£/ha' : '£'})`,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Revenue" fill="#10B981" stackId="stack" />
            <Bar dataKey="Variable Costs" fill="#4F46E5" stackId="stack" />
            <Bar dataKey="Operation Costs" fill="#7C3AED" stackId="stack" />
            <Bar dataKey="Net Margin" fill="#6B7280" stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialImpactStackedView;