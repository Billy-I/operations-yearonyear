import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { FinancialImpactStepLineViewProps } from '../../types/chart-types';

const StepLineView: React.FC<FinancialImpactStepLineViewProps> = ({
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

  // Transform data for step line chart
  const stepData = [
    {
      name: 'Revenue',
      value: adjustedRevenue,
      description: `Total revenue: ${formatCurrency(adjustedRevenue)}`
    },
    {
      name: 'After\nVariable Costs',
      value: grossMargin,
      change: adjustedVariableCosts,
      description: `After deducting variable costs: ${formatCurrency(adjustedVariableCosts)}`
    },
    {
      name: 'After\nOperation Costs',
      value: netMargin,
      change: adjustedOperationCosts,
      description: `After deducting operation costs: ${formatCurrency(adjustedOperationCosts)}`
    },
    {
      name: 'Net\nMargin',
      value: netMargin,
      description: `Final net margin: ${formatCurrency(netMargin)}`
    }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
        <p className="text-sm font-medium mb-1">{data.name.replace('\n', ' ')}</p>
        <p className="text-sm">Balance: {formatCurrency(data.value)}</p>
        {data.change && (
          <p className="text-sm text-red-600">
            Cost: -{formatCurrency(data.change)}
          </p>
        )}
      </div>
    );
  };

  // Find min and max values for y-axis scale
  const values = stepData.map(d => d.value);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = range * 0.2; // 20% padding

  return (
    <div className="h-full flex flex-col">
      {/* Supporting metrics */}
      <div className="mb-4 grid grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Yield</p>
          <p className="text-lg font-medium">{yieldValue.toFixed(2)} t/ha</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Price Achievement</p>
          <p className="text-lg font-medium">£{pricePerTonne.toFixed(2)}/t</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Margin Ratio</p>
          <p className="text-lg font-medium">
            {((netMargin / adjustedRevenue) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Step line chart */}
      <div className="flex-grow" style={{ minHeight: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={stepData}
            margin={{ top: 20, right: 100, left: 80, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              height={60}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              domain={[minValue - padding, maxValue + padding]}
              tickFormatter={(value) => `£${Math.abs(Math.round(value))}`}
              label={{
                value: `Amount (${costUnit === 'per_ha' ? '£/ha' : '£'})`,
                angle: -90,
                position: 'insideLeft',
                offset: -60,
                style: { textAnchor: 'middle' }
              }}
              width={80}
              ticks={[
                minValue,
                0,
                maxValue/2,
                maxValue
              ]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              y={0} 
              stroke="#666" 
              strokeDasharray="3 3"
              label={{ 
                value: "Break Even", 
                position: "right",
                fill: "#666",
                fontSize: 12
              }} 
            />
            <Line
              type="stepAfter"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{
                fill: '#4F46E5',
                r: 6,
                strokeWidth: 2,
                stroke: '#fff'
              }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StepLineView;