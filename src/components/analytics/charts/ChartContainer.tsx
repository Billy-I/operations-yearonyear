import React, { useState } from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { ChartContainerProps, CostChartView } from './types/chart-types';
import CostDistributionView from './views/CostDistributionView';
import { FinancialImpactContainer } from './views/financial-impact';
const ChartContainer: React.FC<ChartContainerProps> = ({
  costBreakdown,
  view,
  onViewChange,
  year,
  costUnit,
  hectares,
  onUnitChange,
  revenue,
  yield: yieldValue,
  pricePerTonne,
  showVariableCosts: propShowVariable,
  showOperationCosts: propShowOperations,
  onToggleLayer
}) => {
  // View options for the tab navigation
  const viewOptions: { id: CostChartView; label: string }[] = [
    { id: 'distribution', label: 'Cost Distribution' },
    { id: 'financial-impact', label: 'Financial Impact' }
  ];

  // Use props for visibility controls if provided, otherwise use local state
  const [localShowVariableCosts, setLocalShowVariableCosts] = useState(true);
  const [localShowOperationCosts, setLocalShowOperationCosts] = useState(true);
  
  const showVariableCosts = propShowVariable ?? localShowVariableCosts;
  const showOperationCosts = propShowOperations ?? localShowOperationCosts;
  
  const handleToggleLayer = (layer: 'variable' | 'operations') => {
    if (onToggleLayer) {
      onToggleLayer(layer);
    } else {
      if (layer === 'variable') {
        setLocalShowVariableCosts(!localShowVariableCosts);
      } else {
        setLocalShowOperationCosts(!localShowOperationCosts);
      }
    }
  };

  // Calculate total variable and operation costs
  const totalVariableCosts = Object.values(costBreakdown.variable)
    .reduce((sum, cost) => sum + (costUnit === 'per_ha' ? cost.current : cost.current * hectares), 0);

  const totalOperationCosts = Object.values(costBreakdown.operations)
    .reduce((sum, cost) => sum + (costUnit === 'per_ha' ? cost : cost * hectares), 0);

  // Check if current view is a financial impact view
  const isFinancialView = view.startsWith('financial-impact');

  return (
    <div className="bg-white rounded-lg p-6 flex flex-col h-full">
      {/* Header with view selection and unit toggle */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <nav className="flex" aria-label="Chart views">
            {viewOptions.map((option, index) => {
              const isActive = (option.id === 'financial-impact' && isFinancialView) || view === option.id;
              const icon = option.id === 'distribution' ? <BarChart2 size={16} /> : <TrendingUp size={16} />;
              
              return (
                <button
                  key={option.id}
                  onClick={() => onViewChange(option.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium
                    ${index === 0 ? 'rounded-l-md' : ''}
                    ${index === viewOptions.length - 1 ? 'rounded-r-md' : ''}
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-500 hover:text-gray-700 border-gray-300'}
                    border
                    ${index !== 0 ? '-ml-px' : ''}
                  `}
                >
                  {icon}
                  {option.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <select
            value={costUnit}
            onChange={(e) => onUnitChange(e.target.value as 'per_ha' | 'total')}
            className="border border-gray-300 rounded-md text-sm py-1 px-2"
          >
            <option value="per_ha">£/ha</option>
            <option value="total">Total £</option>
          </select>
        </div>
      </div>

      {/* View container */}
      <div className="flex-grow" style={{ minHeight: 0 }}>
        {view === 'distribution' && (
          <CostDistributionView
            costBreakdown={costBreakdown}
            year={year}
            costUnit={costUnit}
            hectares={hectares}
            onUnitChange={onUnitChange}
            showVariableCosts={showVariableCosts}
            showOperationCosts={showOperationCosts}
            onToggleLayer={handleToggleLayer}
          />
        )}

        {isFinancialView && (
          <FinancialImpactContainer
            revenue={revenue}
            variableCosts={totalVariableCosts}
            operationCosts={totalOperationCosts}
            yield={yieldValue}
            pricePerTonne={pricePerTonne}
            year={year}
            costUnit={costUnit}
            hectares={hectares}
            onUnitChange={onUnitChange}
            view={view}
            onViewChange={onViewChange}
            showOperationCosts={showOperationCosts}
          />
        )}
      </div>
    </div>
  );
};

export default ChartContainer;