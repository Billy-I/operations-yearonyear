import React from 'react';
import {
  Treemap,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { FinancialImpactTreemapViewProps } from '../../types/chart-types';

interface TreeMapData {
  name: string;
  size: number;
  color: string;
  children?: TreeMapData[];
}

const TreeMapView: React.FC<FinancialImpactTreemapViewProps> = ({
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

  // Calculate percentages of total value
  const totalValue = adjustedRevenue;
  const variableCostsPercent = (adjustedVariableCosts / totalValue) * 100;
  const operationCostsPercent = (adjustedOperationCosts / totalValue) * 100;
  const netMarginPercent = (netMargin / totalValue) * 100;

  // Format currency values
  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-£' : '£';
    const absValue = Math.abs(value);
    return `${prefix}${absValue.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;
  };

  // Prepare data for treemap
  const data: TreeMapData[] = [
    {
      name: 'Financial Breakdown',
      size: adjustedRevenue,
      color: '#F3F4F6', // Light gray background
      children: [
        {
          name: 'Revenue',
          size: adjustedRevenue,
          color: '#10B981'
        },
        {
          name: 'Costs',
          size: adjustedVariableCosts + adjustedOperationCosts,
          color: '#E5E7EB',
          children: [
            {
              name: 'Variable Costs',
              size: Math.abs(adjustedVariableCosts),
              color: '#4F46E5'
            },
            {
              name: 'Operation Costs',
              size: Math.abs(adjustedOperationCosts),
              color: '#7C3AED'
            }
          ]
        },
        {
          name: 'Net Margin',
          size: Math.abs(netMargin),
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
        <p className="text-sm">Value: {formatCurrency(data.value || data.size)}</p>
        {data.percentage && (
          <p className="text-sm mt-1">
            {data.percentage.toFixed(1)}% of Revenue
          </p>
        )}
      </div>
    );
  };

  // Custom content within each treemap cell
  const CustomContent = ({ root, depth, x, y, width, height, name, value }: any) => {
    let percentage;
    switch (name) {
      case 'Variable Costs':
        percentage = variableCostsPercent;
        break;
      case 'Operation Costs':
        percentage = operationCostsPercent;
        break;
      case 'Net Margin':
        percentage = netMarginPercent;
        break;
      case 'Revenue':
        percentage = 100;
        break;
      default:
        percentage = ((value / root.value) * 100);
    }
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={data[0].children?.find(child => child.name === name)?.color || 
               data[0].children?.find(child => child.name === 'Costs')?.children?.find(child => child.name === name)?.color ||
               '#E5E7EB'}
          stroke="#fff"
          strokeWidth={2}
        />
        {width > 60 && height > 30 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              fill="#fff"
              fontSize={11}
            >
              {percentage.toFixed(1)}%
            </text>
          </>
        )}
      </g>
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
            {netMarginPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tree map */}
      <div className="flex-grow" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#10B981] mr-2" />
          <span>Revenue: {formatCurrency(adjustedRevenue)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#4F46E5] mr-2" />
          <span>Variable Costs: {formatCurrency(adjustedVariableCosts)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#7C3AED] mr-2" />
          <span>Operation Costs: {formatCurrency(adjustedOperationCosts)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#6B7280] mr-2" />
          <span>Net Margin: {formatCurrency(netMargin)}</span>
        </div>
      </div>
    </div>
  );
};

export default TreeMapView;