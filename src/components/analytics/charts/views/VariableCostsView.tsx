import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Label,
  Text
} from 'recharts';
import { VariableCostsViewProps } from '../types/chart-types';
import MarketRangeIndicator from '../common/MarketRangeIndicator';

interface ChartDataItem {
  category: string;
  value: number;
  variance: number;
  benchmarkData: {
    min: number;
    max: number;
    average: number;
    current: number;
  };
  hasSubcategories?: boolean;
  subcategories?: {
    [key: string]: {
      value: number;
      variance: number;
      benchmarkData: {
        min: number;
        max: number;
        average: number;
        current: number;
      };
    };
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    dataKey: string;
    value: number;
  }>;
}

const VariableCostsView: React.FC<VariableCostsViewProps> = ({
  verifiedCosts,
  costUnit,
  hectares,
  showPercentageVariance,
  onTogglePercentageVariance
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Transform the data for the chart
  const chartData = useMemo(() => {
    const data: ChartDataItem[] = Object.entries(verifiedCosts).map(([category, cost]) => {
      const adjustedCost = costUnit === 'per_ha' ? cost : {
        ...cost,
        min: cost.min * hectares,
        max: cost.max * hectares,
        average: cost.average * hectares,
        current: cost.current * hectares
      };

      return {
        category,
        value: adjustedCost.current,
        variance: ((adjustedCost.current - adjustedCost.average) / adjustedCost.average) * 100,
        benchmarkData: {
          min: adjustedCost.min,
          max: adjustedCost.max,
          average: adjustedCost.average,
          current: adjustedCost.current
        },
        hasSubcategories: !!cost.subCategories,
        subcategories: cost.subCategories && Object.entries(cost.subCategories).reduce((acc, [subKey, subCost]) => {
          const adjustedSubCost = costUnit === 'per_ha' ? subCost : {
            ...subCost,
            min: subCost.min * hectares,
            max: subCost.max * hectares,
            average: subCost.average * hectares,
            current: subCost.current * hectares
          };
          
          acc[subKey] = {
            value: adjustedSubCost.current,
            variance: ((adjustedSubCost.current - adjustedSubCost.average) / adjustedSubCost.average) * 100,
            benchmarkData: {
              min: adjustedSubCost.min,
              max: adjustedSubCost.max,
              average: adjustedSubCost.average,
              current: adjustedSubCost.current
            }
          };
          return acc;
        }, {} as NonNullable<ChartDataItem['subcategories']>)
      };
    });

    // If a category is expanded, show its subcategories instead
    if (expandedCategory) {
      const category = data.find(d => d.category === expandedCategory);
      if (category?.subcategories) {
        return Object.entries(category.subcategories).map(([subKey, subData]) => ({
          category: subKey,
          value: subData.value,
          variance: subData.variance,
          benchmarkData: subData.benchmarkData,
          hasSubcategories: false
        }));
      }
    }

    return data;
  }, [verifiedCosts, costUnit, hectares, expandedCategory]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload as ChartDataItem;
    const formatValue = (val: number) => 
      `£${val.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;

    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
        <p className="font-medium mb-2">{data.category}</p>
        <p className="text-sm mb-2">{formatValue(data.value)}</p>
        
        <div className="text-sm mb-3">
          <span className={data.variance > 0 ? 'text-red-500' : 'text-green-500'}>
            {data.variance > 0 ? '+' : ''}{data.variance.toFixed(1)}% vs market average
          </span>
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-2">Market Range</p>
          <MarketRangeIndicator
            data={data.benchmarkData}
            width={180}
            formatValue={formatValue}
          />
        </div>

        {data.hasSubcategories && (
          <p className="text-xs text-blue-600 mt-2">
            Click to view subcategories
          </p>
        )}
      </div>
    );
  };

  const handleBarClick = (data: ChartDataItem) => {
    if (data.hasSubcategories) {
      setExpandedCategory(data.category);
    }
  };

  // Calculate domains for both axes
  const domains = useMemo(() => {
    const costValues = chartData.map(d => Math.max(d.value, d.benchmarkData.max));
    const costMax = Math.max(...costValues);
    return {
      cost: [0, costMax * 1.1]
    };
  }, [chartData]);

  // Transform data to include market range bars
  const transformedData = useMemo(() => {
    return chartData.map(d => ({
      ...d,
      marketRange: d.benchmarkData.max - d.benchmarkData.min,
      marketBottom: d.benchmarkData.min,
      marketAverage: d.benchmarkData.average,
      variance: ((d.value - d.benchmarkData.average) / d.benchmarkData.average) * 100
    }));
  }, [chartData]);

  return (
    <div className="h-full flex flex-col">
      {/* View controls */}
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPercentageVariance}
              onChange={onTogglePercentageVariance}
              className="rounded text-blue-600"
            />
            <span className="text-sm">Show Market Range</span>
          </label>
        </div>
        
        {expandedCategory && (
          <button
            onClick={() => setExpandedCategory(null)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Categories
          </button>
        )}
      </div>

      {/* Chart */}
      <div className="flex-grow" style={{ minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={transformedData} 
            margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              interval={0}
              tick={{ fontSize: 12 }}
              height={60}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <YAxis
              domain={domains.cost}
              tickFormatter={(value) => `£${Math.abs(value)}`}
              label={{
                value: `Cost (${costUnit === 'per_ha' ? '£/ha' : '£'})`,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {showPercentageVariance && (
              <>
                {/* Market range bars */}
                <Bar
                  dataKey="marketRange"
                  stackId="market"
                  fill="#E5E7EB"
                  fillOpacity={0.5}
                  isAnimationActive={false}
                  barSize={60}
                />
                <Bar
                  dataKey="marketBottom"
                  stackId="market"
                  fill="none"
                  isAnimationActive={false}
                  barSize={60}
                />
              </>
            )}
            {/* Current cost bars */}
            <Bar
              dataKey="value"
              barSize={40}
              onClick={handleBarClick}
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.variance > 0 ? '#FEE2E2' : '#DCFCE7'}
                  stroke={entry.variance > 0 ? '#EF4444' : '#10B981'}
                  strokeWidth={2}
                  style={{ cursor: entry.hasSubcategories ? 'pointer' : 'default' }}
                />
              ))}
            </Bar>
            {/* Market average lines */}
            {showPercentageVariance && transformedData.map((entry, index) => (
              <ReferenceLine
                key={`avg-${index}`}
                y={entry.marketAverage}
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="3 3"
                segment={[
                  { x: index - 0.3, y: entry.marketAverage },
                  { x: index + 0.3, y: entry.marketAverage }
                ]}
              >
                <Label
                  value="Avg"
                  position="right"
                  fill="#6B7280"
                  fontSize={10}
                />
              </ReferenceLine>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showPercentageVariance && (
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 mr-2" />
            <span>Market Range</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-0.5 bg-gray-400 mr-2" style={{ borderStyle: 'dashed' }} />
            <span>Market Average</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 mr-2" />
            <span>Above Average</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 mr-2" />
            <span>Below Average</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableCostsView;