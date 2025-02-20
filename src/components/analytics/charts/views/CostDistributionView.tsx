import React, { useMemo } from 'react';
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
import { CostDistributionViewProps } from '../types/chart-types';
import MarketRangeIndicator from '../common/MarketRangeIndicator';

interface ChartData {
  category: string;
  verifiedValue?: number;
  operationValue?: number;
  benchmarkData?: {
    min: number;
    max: number;
    average: number;
    current: number;
  };
}

const CostDistributionView: React.FC<CostDistributionViewProps> = ({
  costBreakdown,
  costUnit,
  hectares,
  showVariableCosts,
  showOperationCosts,
  onToggleLayer
}) => {
  // Transform the data for the chart
  const chartData = useMemo(() => {
    const data: ChartData[] = [];

    // Add variable costs
    if (showVariableCosts) {
      Object.entries(costBreakdown.variable).forEach(([category, cost]) => {
        data.push({
          category,
          verifiedValue: costUnit === 'per_ha' ? cost.current : cost.current * hectares,
          benchmarkData: {
            min: costUnit === 'per_ha' ? cost.min : cost.min * hectares,
            max: costUnit === 'per_ha' ? cost.max : cost.max * hectares,
            average: costUnit === 'per_ha' ? cost.average : cost.average * hectares,
            current: costUnit === 'per_ha' ? cost.current : cost.current * hectares
          }
        });
      });
    }

    // Add operation costs
    if (showOperationCosts) {
      Object.entries(costBreakdown.operations).forEach(([category, cost]) => {
        const value = costUnit === 'per_ha' ? cost : cost * hectares;
        const existingEntry = data.find(d => d.category === category);
        
        if (existingEntry) {
          existingEntry.operationValue = value;
        } else {
          data.push({
            category,
            operationValue: value
          });
        }
      });
    }

    return data;
  }, [costBreakdown, costUnit, hectares, showVariableCosts, showOperationCosts]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as ChartData;
    const formatValue = (val: number) => 
      `£${val.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
        <p className="font-medium mb-2">{data.category}</p>
        
        {data.verifiedValue !== undefined && (
          <p className="text-sm mb-1">
            <span className="text-blue-600">Verified: </span>
            {formatValue(data.verifiedValue)}
          </p>
        )}
        
        {data.operationValue !== undefined && (
          <p className="text-sm mb-1">
            <span className="text-purple-600">Operation: </span>
            {formatValue(data.operationValue)}
          </p>
        )}
        
        {data.benchmarkData && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Market Range</p>
            <MarketRangeIndicator
              data={data.benchmarkData}
              width={180}
              formatValue={formatValue}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chart controls */}
      <div className="flex items-center space-x-4 mb-4 flex-shrink-0">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showVariableCosts}
            onChange={() => onToggleLayer('variable')}
            className="rounded text-blue-600"
          />
          <span className="text-sm">Variable Costs</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOperationCosts}
            onChange={() => onToggleLayer('operations')}
            className="rounded text-blue-600"
          />
          <span className="text-sm">Operation Costs</span>
        </label>
      </div>

      {/* Chart */}
      <div className="flex-grow" style={{ width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              interval={0}
              tick={{ fontSize: 12 }}
              height={60}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <YAxis
              tickFormatter={(value) => `£${value}`}
              label={{
                value: `Cost (${costUnit === 'per_ha' ? '£/ha' : '£'})`,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {showVariableCosts && (
              <Bar
                dataKey="verifiedValue"
                name="Verified Costs"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
              />
            )}
            {showOperationCosts && (
              <Bar
                dataKey="operationValue"
                name="Operation Costs"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostDistributionView;