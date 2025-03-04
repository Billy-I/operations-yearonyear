import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BaseChartProps } from '../types/chart-types';
import { AVAILABLE_YEARS } from '../../../../constants/analytics';
import { 
  getValue, 
  getVariableCosts, 
  getOperationsCosts, 
  getTotalCosts 
} from '../../../../utils/metricsCalculations';
import { Info } from 'lucide-react';

// Define the metrics that can be selected in the dropdown
type MetricOption = 
  | 'costOfProduction' 
  | 'inputCosts' 
  | 'operationsCosts' 
  | 'grossMargin' 
  | 'netMargin';

interface MultiYearPreviewViewProps extends BaseChartProps {
  showVariableCosts: boolean;
  showOperationCosts: boolean;
}

const MultiYearPreviewView: React.FC<MultiYearPreviewViewProps> = ({
  costUnit,
  hectares,
  onUnitChange,
  showVariableCosts,
  showOperationCosts
}) => {
  // State for the selected metric
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>('costOfProduction');

  // Get the last 10 years (or all available years if less than 10)
  const years = [...AVAILABLE_YEARS].reverse().slice(0, 10);

  // Generate data for the chart based on the selected metric
  const getData = () => {
    return years.map(year => {
      let value = 0;

      switch (selectedMetric) {
        case 'costOfProduction':
          value = getValue('costOfProduction', year, costUnit === 'per_ha' ? '£/ha' : costUnit === 'per_tonne' ? '£/t' : '£');
          break;
        case 'inputCosts':
          value = getVariableCosts(year, costUnit === 'per_ha' ? '£/ha' : costUnit === 'per_tonne' ? '£/t' : '£');
          break;
        case 'operationsCosts':
          value = getOperationsCosts(year, costUnit === 'per_ha' ? '£/ha' : costUnit === 'per_tonne' ? '£/t' : '£');
          break;
        case 'grossMargin':
          value = getValue('grossMargin', year, costUnit === 'per_ha' ? '£/ha' : costUnit === 'per_tonne' ? '£/t' : '£');
          break;
        case 'netMargin':
          value = getValue('netMargin', year, costUnit === 'per_ha' ? '£/ha' : costUnit === 'per_tonne' ? '£/t' : '£');
          break;
      }

      // If using total units, multiply by hectares
      if (costUnit === 'total') {
        value *= hectares;
      }

      return {
        year,
        value
      };
    });
  };

  // Get the appropriate label for the selected metric
  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'costOfProduction':
        return 'Cost of Production';
      case 'inputCosts':
        return 'Input Costs';
      case 'operationsCosts':
        return 'Operations Costs';
      case 'grossMargin':
        return 'Gross Margin';
      case 'netMargin':
        return 'Net Margin';
    }
  };

  // Get the appropriate unit label
  const getUnitLabel = () => {
    switch (costUnit) {
      case 'per_ha':
        return '£/ha';
      case 'per_tonne':
        return '£/t';
      case 'total':
        return '£';
    }
  };

  // Determine which metrics should be available based on the active cost filters
  const getAvailableMetrics = () => {
    const metrics: { value: MetricOption; label: string }[] = [];
    
    // Cost of Production is always available
    metrics.push({ value: 'costOfProduction', label: 'Cost of Production' });
    
    // Input Costs and Gross Margin require variable costs to be shown
    if (showVariableCosts) {
      metrics.push({ value: 'inputCosts', label: 'Input Costs' });
      metrics.push({ value: 'grossMargin', label: 'Gross Margin' });
    }
    
    // Operations Costs requires operations costs to be shown
    if (showOperationCosts) {
      metrics.push({ value: 'operationsCosts', label: 'Operations Costs' });
    }
    
    // Net Margin requires both variable and operations costs
    if (showVariableCosts && showOperationCosts) {
      metrics.push({ value: 'netMargin', label: 'Net Margin' });
    }
    
    return metrics;
  };

  const availableMetrics = getAvailableMetrics();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricOption)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            {availableMetrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center text-blue-600 text-sm">
          <Info size={16} className="mr-1" />
          <span>Coming soon: Dedicated multi-year analysis page</span>
        </div>
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              label={{ 
                value: getUnitLabel(), 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip 
              formatter={(value: any) => [`${value} ${getUnitLabel()}`, getMetricLabel()]}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name={getMetricLabel()} 
              fill="#6B7280" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiYearPreviewView;