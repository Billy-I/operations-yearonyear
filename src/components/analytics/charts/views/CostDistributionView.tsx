import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
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

const CHART_COLORS = {
  variable: '#4F46E5',
  operation: '#7C3AED'
};

type ChartType = 'bar' | 'pie';

const CostDistributionView: React.FC<CostDistributionViewProps> = ({
  costBreakdown,
  costUnit,
  hectares,
  showVariableCosts,
  showOperationCosts,
  onToggleLayer
}) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
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
      <div className="flex flex-wrap items-center gap-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'pie'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-grow" style={{ width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
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
                  fill={CHART_COLORS.variable}
                  radius={[4, 4, 0, 0]}
                />
              )}
              {showOperationCosts && (
                <Bar
                  dataKey="operationValue"
                  name="Operation Costs"
                  fill={CHART_COLORS.operation}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          ) : (
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={chartData
                  .filter(item => (showVariableCosts && item.verifiedValue !== undefined) ||
                                (showOperationCosts && item.operationValue !== undefined))
                  .map(item => ({
                    category: item.category,
                    value: ((showVariableCosts ? item.verifiedValue : 0) || 0) +
                           ((showOperationCosts ? item.operationValue : 0) || 0),
                    verifiedValue: item.verifiedValue,
                    operationValue: item.operationValue,
                    benchmarkData: item.benchmarkData
                  }))}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={({ category, value }) =>
                  `${category.charAt(0).toUpperCase() + category.slice(1)}: £${value.toFixed(2)}`
                }
              >
                {chartData
                  .filter(item => (showVariableCosts && item.verifiedValue !== undefined) ||
                                (showOperationCosts && item.operationValue !== undefined))
                  .map((entry, index) => {
                    // If both types are shown and exist, use variable cost color
                    // Otherwise use the color of whichever type exists
                    const hasVariable = showVariableCosts && entry.verifiedValue !== undefined;
                    const fill = hasVariable ? CHART_COLORS.variable : CHART_COLORS.operation;
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostDistributionView;