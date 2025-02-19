import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MetricsData, Year } from '../../types/analytics';

interface CostFilters {
  seed: boolean;
  fertiliser: boolean;
  chemicals: boolean;
  cultivating: boolean;
  drilling: boolean;
  applications: boolean;
  harvesting: boolean;
}

type ChartType = 'stacked-bar' | 'line' | 'grouped-bar';

interface CombinedCostChartProps {
  data: MetricsData;
  years: readonly Year[];
  showVariableCosts: boolean;
  showOperationCosts: boolean;
  showTotalCosts: boolean;
  onToggleLayer: (layer: 'variable' | 'operations' | 'total') => void;
  unit: 'per_ha' | 'total';
  hectares: number;
  onUnitChange: (unit: 'per_ha' | 'total') => void;
  costFilters: CostFilters;
  chartType?: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
  }>;
  label?: string;
  unit: 'per_ha' | 'total';
}

const CustomTooltip = ({ active, payload, label, unit }: TooltipProps) => {
  if (!active || !payload) return null;

  const variableCosts = payload.find(p => p.dataKey === 'variableCosts')?.value || 0;
  const operationCosts = payload.find(p => p.dataKey === 'operationCosts')?.value || 0;
  const totalCosts = variableCosts + operationCosts;

  const formatValue = (value: number) => {
    if (unit === 'per_ha') {
      return `£${value.toFixed(2)}/ha`;
    } else {
      return `£${value.toFixed(2)}`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-md p-3">
      <p className="font-medium mb-2">Year: {label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm">
          {entry.name}: {formatValue(entry.value)}
        </p>
      ))}
      <div className="h-px bg-gray-200 my-2" />
      <p className="text-sm font-medium">
        Total Costs: {formatValue(totalCosts)}
      </p>
    </div>
  );
};

export default function CombinedCostChart({
  data,
  years,
  showVariableCosts,
  showOperationCosts,
  showTotalCosts,
  onToggleLayer,
  unit,
  hectares,
  onUnitChange,
  costFilters,
  chartType = 'stacked-bar',
  onChartTypeChange = () => {}
}: CombinedCostChartProps) {
  // Transform data for the chart
  const chartData = years.map(year => {
    // Calculate variable costs based on active filters
    const variableCostsPerHa = (costFilters.seed ? data.seed[year].perHectare : 0) +
                              (costFilters.fertiliser ? data.fertiliser[year].perHectare : 0) +
                              (costFilters.chemicals ? data.chemicals[year].perHectare : 0);
    
    // Calculate operation costs based on active filters
    const operationCostsPerHa = (costFilters.cultivating ? data.cultivating[year].perHectare : 0) +
                               (costFilters.drilling ? data.drilling[year].perHectare : 0) +
                               (costFilters.applications ? data.applications[year].perHectare : 0) +
                               (costFilters.harvesting ? data.harvesting[year].perHectare : 0);
    
    const totalCostsPerHa = variableCostsPerHa + operationCostsPerHa;

    // Calculate total costs if needed
    const variableCosts = unit === 'per_ha' ? variableCostsPerHa : variableCostsPerHa * hectares;
    const operationCosts = unit === 'per_ha' ? operationCostsPerHa : operationCostsPerHa * hectares;
    const totalCosts = unit === 'per_ha' ? totalCostsPerHa : totalCostsPerHa * hectares;

    return {
      year,
      variableCosts,
      operationCosts,
      totalCosts
    };
  });

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Cost Breakdown</h3>
          <div className="flex items-center space-x-4">
            <select
              value={unit}
              onChange={(e) => onUnitChange(e.target.value as 'per_ha' | 'total')}
              className="border border-gray-300 rounded-md text-sm py-1"
            >
              <option value="per_ha">£/ha</option>
              <option value="total">Total £</option>
            </select>

            <select
              value={chartType}
              onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
              className="border border-gray-300 rounded-md text-sm py-1"
            >
              <option value="stacked-bar">Stacked Bar</option>
              <option value="grouped-bar">Grouped Bar</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-4">
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
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showTotalCosts}
              onChange={() => onToggleLayer('total')}
              className="rounded text-blue-600"
            />
            <span className="text-sm">Total Costs</span>
          </label>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Legend />
              
              {showVariableCosts && (
                <Line
                  type="monotone"
                  dataKey="variableCosts"
                  name="Variable Costs"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              
              {showOperationCosts && (
                <Line
                  type="monotone"
                  dataKey="operationCosts"
                  name="Operation Costs"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              
              {showTotalCosts && (
                <Line
                  type="monotone"
                  dataKey="totalCosts"
                  name="Total Costs"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Legend />
              
              {showVariableCosts && (
                <Bar
                  dataKey="variableCosts"
                  name="Variable Costs"
                  fill="#4F46E5"
                  stackId={chartType === 'stacked-bar' ? 'costs' : undefined}
                />
              )}
              
              {showOperationCosts && (
                <Bar
                  dataKey="operationCosts"
                  name="Operation Costs"
                  fill="#7C3AED"
                  stackId={chartType === 'stacked-bar' ? 'costs' : undefined}
                />
              )}
              
              {showTotalCosts && (
                <Line
                  type="monotone"
                  dataKey="totalCosts"
                  name="Total Costs"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}