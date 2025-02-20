import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { FinancialImpactGaugeViewProps } from '../../types/chart-types';

const GaugeView: React.FC<FinancialImpactGaugeViewProps> = ({
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
  const totalCosts = adjustedVariableCosts + adjustedOperationCosts;
  const netMargin = adjustedRevenue - totalCosts;

  // Calculate performance metrics
  const marginPerformance = (netMargin / adjustedRevenue) * 100; // Net margin as % of revenue
  const variableCostsRatio = (adjustedVariableCosts / adjustedRevenue) * 100; // Variable costs as % of revenue
  const operationCostsRatio = (adjustedOperationCosts / adjustedRevenue) * 100; // Operation costs as % of revenue

  // Format currency values
  const formatCurrency = (value: number) => {
    const prefix = value < 0 ? '-£' : '£';
    const absValue = Math.abs(value);
    return `${prefix}${absValue.toFixed(2)}${costUnit === 'per_ha' ? '/ha' : ''}`;
  };

  // Gauge colors
  const getGaugeColor = (value: number, isNegativeGood: boolean = false) => {
    const normalizedValue = isNegativeGood ? -value : value;
    if (normalizedValue >= 0) return '#10B981'; // green for positive margin
    if (normalizedValue >= -50) return '#F59E0B'; // yellow for moderate loss
    return '#EF4444'; // red for significant loss
  };

  // Create gauge component
  const Gauge = ({ 
    value, 
    label,
    sublabel
  }: { 
    value: number; 
    label: string;
    sublabel: string;
  }) => {
    // Ensure value is between 0 and 100 for display
    const displayValue = value;
    const absDisplayValue = Math.abs(displayValue);
    
    const gaugeData = [
      { value: 50 + (absDisplayValue/2), color: getGaugeColor(displayValue) },
      { value: 50 - (absDisplayValue/2), color: '#E5E7EB' }
    ];

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={gaugeData}
                dataKey="value"
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-700">
              {displayValue >= 0 ? '+' : ''}{displayValue.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 mt-1">{label}</span>
            <span className="text-xs text-gray-400 mt-1">{sublabel}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Supporting metrics */}
      <div className="mb-6 grid grid-cols-3 gap-4 flex-shrink-0">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-xl font-medium">{formatCurrency(adjustedRevenue)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Costs</p>
          <p className="text-xl font-medium">{formatCurrency(totalCosts)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Net Margin</p>
          <p className="text-xl font-medium">{formatCurrency(netMargin)}</p>
        </div>
      </div>

      {/* Gauges */}
      <div className="flex-grow grid grid-cols-3 gap-6 items-center">
        <Gauge 
          value={marginPerformance} 
          label="Net Margin"
          sublabel="% of Revenue"
        />
        <Gauge 
          value={variableCostsRatio} 
          label="Variable Costs"
          sublabel="% of Revenue"
        />
        <Gauge 
          value={operationCostsRatio} 
          label="Operation Costs"
          sublabel="% of Revenue"
        />
      </div>

      {/* Additional metrics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Yield</p>
          <p className="text-xl font-medium">{yieldValue.toFixed(2)} t/ha</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Price Achievement</p>
          <p className="text-xl font-medium">£{pricePerTonne.toFixed(2)}/t</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total per Hectare</p>
          <p className="text-xl font-medium">{formatCurrency(adjustedRevenue / hectares)}</p>
        </div>
      </div>
    </div>
  );
};

export default GaugeView;