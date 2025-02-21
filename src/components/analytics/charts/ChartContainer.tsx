import React, { useState } from 'react';
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
        <div className="border-b border-gray-200 w-full">
          <nav className="-mb-px flex space-x-8" aria-label="Chart views">
            {viewOptions.map(option => (
              <button
                key={option.id}
                onClick={() => onViewChange(option.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${option.id === 'financial-impact' && isFinancialView || view === option.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {option.label}
              </button>
            ))}
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