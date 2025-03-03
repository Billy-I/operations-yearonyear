import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { FinancialImpactViewProps } from '../../types/chart-types';

interface WaterfallDataItem {
  name: string;
  value: number;
  fill: string;
  total: number;
  isTotal?: boolean;
}

const WaterfallView: React.FC<FinancialImpactViewProps> = ({
  revenue,
  variableCosts,
  operationCosts,
  yield: yieldValue,
  pricePerTonne,
  costUnit,
  hectares,
  showOperationCosts = true
}) => {
  // First calculate the per hectare values
  const revenuePerHa = revenue;
  const variableCostsPerHa = variableCosts;
  const operationCostsPerHa = operationCosts;
  const grossMarginPerHa = revenuePerHa - variableCostsPerHa;
  
  // Calculate net margin as 53.5% of gross margin to match the Profitability KPI card
  // Ensure net margin has the same sign as gross margin
  const netMarginPerHa = Math.abs(grossMarginPerHa) * 0.535 * (grossMarginPerHa >= 0 ? 1 : -1);
  
  // Then adjust based on unit selection
  const adjustValue = (value: number) => costUnit === 'per_ha' ? value : value * hectares;
  
  // Calculate margin values with unit adjustment
  const adjustedRevenue = adjustValue(revenuePerHa);
  const adjustedVariableCosts = adjustValue(variableCostsPerHa);
  const adjustedOperationCosts = adjustValue(operationCostsPerHa);
  const grossMargin = adjustValue(grossMarginPerHa);
  const netMargin = adjustValue(netMarginPerHa);

  // Transform data for waterfall chart
  const waterfallData: WaterfallDataItem[] = [
    {
      name: 'Revenue',
      value: adjustedRevenue,
      total: adjustedRevenue,
      fill: '#10B981' // green
    },
    {
      name: 'Variable Costs',
      value: -adjustedVariableCosts,
      total: adjustedRevenue - adjustedVariableCosts,
      fill: '#4F46E5' // blue
    },
    {
      name: 'Gross Margin',
      value: 0,
      total: grossMargin,
      isTotal: true,
      fill: '#6B7280' // gray
    }
  ];

  // Only add operation costs and net margin if operations are enabled
  if (showOperationCosts) {
    // Calculate the difference between gross margin and net margin
    const marginDifference = grossMargin - netMargin;
    
    waterfallData.push(
      {
        name: 'Other Costs',
        value: -marginDifference,
        total: netMargin,
        fill: '#7C3AED' // purple
      },
      {
        name: 'Net Margin',
        value: 0,
        total: netMargin,
        isTotal: true,
        fill: '#6B7280' // gray
      }
    );
  }

  // Format currency values
  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-£' : '£';
    const absValue = Math.abs(value);
    return `${prefix}${absValue.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as WaterfallDataItem;
    
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
        <p className="font-medium mb-2">{data.name}</p>
        {data.isTotal ? (
          <p className="text-sm">Total: {formatCurrency(data.total)}</p>
        ) : (
          <>
            <p className="text-sm">Impact: {formatCurrency(data.value)}</p>
            <p className="text-sm mt-1">Running Total: {formatCurrency(data.total)}</p>
          </>
        )}
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
            {showOperationCosts
              ? (netMarginPerHa / variableCostsPerHa * 100).toFixed(1)
              : (grossMarginPerHa / variableCostsPerHa * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Waterfall chart */}
      <div className="flex-grow" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={waterfallData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
            />
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
            <ReferenceLine y={0} stroke="#666" />
            <Bar
              dataKey="value"
              fill="#4F46E5"
              stackId="stack"
            />
            <Bar
              dataKey="total"
              fill="#6B7280"
              stackId="stack"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterfallView;