import { ViewType, UnitType, Year } from '../../types/analytics';
import { getValue, getVariableCosts, getOperationsCosts, getTotalCosts } from '../../utils/metricsCalculations';
import { fieldsData } from '../../data/fieldData';
import { metricsData } from '../../data/metricsData';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface CostFilters {
  variable?: boolean;
  operations?: boolean;
}

interface FieldRotationTableProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
  setSelectedUnit?: (unit: UnitType) => void;
  selectedField: string;
  costFilters?: CostFilters;
}

export const FieldRotationTable = ({
  selectedYears,
  selectedUnit,
  selectedField,
  selectedView,
  setSelectedUnit,
  costFilters = { variable: true, operations: true }
}: FieldRotationTableProps) => {
  const fieldData = fieldsData.find(field => field.id === selectedField);
  
  const formatValueWithUnit = (value: number): string => {
    return `£${value.toFixed(2)} ${selectedUnit === '£/t' ? '/t' : '/ha'}`;
  };

  const getComparisonText = (metric: keyof typeof metricsData | 'totalVariableCosts' | 'totalOperationsCosts' | 'totalCosts', year: Year, value: number) => {
    if (!fieldData) return '';
    
    let farmAvg: number;
    if (metric === 'totalVariableCosts') {
      farmAvg = getValue('seed', year, selectedUnit) +
                getValue('fertiliser', year, selectedUnit) +
                getValue('chemicals', year, selectedUnit);
    } else if (metric === 'totalOperationsCosts') {
      farmAvg = getValue('cultivating', year, selectedUnit) +
                getValue('drilling', year, selectedUnit) +
                getValue('applications', year, selectedUnit) +
                getValue('harvesting', year, selectedUnit) +
                getValue('other', year, selectedUnit);
    } else if (metric === 'totalCosts') {
      farmAvg = getVariableCosts(year, selectedUnit) + getOperationsCosts(year, selectedUnit);
    } else {
      farmAvg = getValue(metric, year, selectedUnit);
    }

    const diff = ((value - farmAvg) / farmAvg) * 100;
    const cropType = fieldData.metrics[year].cropType;
    return `This is ${Math.abs(diff).toFixed(1)}% ${diff > 0 ? 'above' : 'below'} farm's average ${cropType} for this year`;
  };

  const renderMetricRow = (label: string, metric: keyof typeof metricsData) => {
    if (!fieldData) return null;
    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {label}
        </td>
        {selectedYears.map((year) => {
          const yearKey = year as Year;
          const value = getValue(metric, yearKey, selectedUnit);
          return (
            <td
              key={year}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
              {...(selectedView === 'Variable' ? {
                'data-tooltip-id': `metric-${metric}-${yearKey}`,
                'data-tooltip-content': getComparisonText(metric, yearKey, value)
              } : {})}
            >
              {formatValueWithUnit(value)}
              {selectedView === 'Variable' && <Tooltip id={`metric-${metric}-${yearKey}`} />}
            </td>
          );
        })}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue(metric, 'Yearly avg', selectedUnit))}
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    if (!fieldData) return null;

    // Always show combined view, respecting costFilters
    return (
      <>
        {/* Variable Costs Section */}
        {costFilters.variable && (
          <>
            {renderMetricRow('Cost of Production', 'costOfProduction')}
            {renderMetricRow('Seed', 'seed')}
            {renderMetricRow('Fertiliser', 'fertiliser')}
            {renderMetricRow('Chemicals', 'chemicals')}
            <tr className="bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total Variable Costs
              </td>
              {selectedYears.map((year) => {
                const yearKey = year as Year;
                const value = getVariableCosts(yearKey, selectedUnit);
                return (
                  <td
                    key={year}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    data-tooltip-id={`total-variable-${yearKey}`}
                    data-tooltip-content={getComparisonText('totalVariableCosts', yearKey, value)}
                  >
                    {formatValueWithUnit(value)}
                    <Tooltip id={`total-variable-${yearKey}`} />
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatValueWithUnit(getVariableCosts('Yearly avg', selectedUnit))}
              </td>
            </tr>
          </>
        )}

        {/* Operations Costs Section */}
        {costFilters.operations && (
          <>
            {renderMetricRow('Cultivating', 'cultivating')}
            {renderMetricRow('Drilling', 'drilling')}
            {renderMetricRow('Applications', 'applications')}
            {renderMetricRow('Harvesting', 'harvesting')}
            {renderMetricRow('Other', 'other')}
            <tr className="bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total Operations Costs
              </td>
              {selectedYears.map((year) => {
                const yearKey = year as Year;
                const value = getOperationsCosts(yearKey, selectedUnit);
                return (
                  <td
                    key={year}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {formatValueWithUnit(value)}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatValueWithUnit(getOperationsCosts('Yearly avg', selectedUnit))}
              </td>
            </tr>
          </>
        )}

        {/* Total Costs Row (if both filters are active) */}
        {(costFilters.variable && costFilters.operations) && (
          <tr className="bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Total Costs
            </td>
            {selectedYears.map((year) => {
              const yearKey = year as Year;
              // Calculate total based on active filters
              const variableCosts = costFilters.variable ? getVariableCosts(yearKey, selectedUnit) : 0;
              const operationsCosts = costFilters.operations ? getOperationsCosts(yearKey, selectedUnit) : 0;
              const totalCosts = variableCosts + operationsCosts;
              
              return (
                <td
                  key={year}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {formatValueWithUnit(totalCosts)}
                </td>
              );
            })}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {formatValueWithUnit(
                (costFilters.variable ? getVariableCosts('Yearly avg', selectedUnit) : 0) +
                (costFilters.operations ? getOperationsCosts('Yearly avg', selectedUnit) : 0)
              )}
            </td>
          </tr>
        )}

        {/* Production Metrics */}
        {renderMetricRow('Production', 'production')}
        
        {/* Gross Margin (show only if variable costs are active) */}
        {costFilters.variable && renderMetricRow('Gross Margin', 'grossMargin')}
        
        {/* Net Margin (show only if both variable and operations costs are active) */}
        {(costFilters.variable && costFilters.operations) && renderMetricRow('Net Margin', 'netMargin')}
        
        {/* Yield is always shown */}
        {renderMetricRow('Yield', 'yield')}
      </>
    );
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center space-x-4">
                <span>Metrics</span>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/t' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedUnit?.('£/t')}
                  >
                    £/t
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/ha' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedUnit?.('£/ha')}
                  >
                    £/ha
                  </button>
                </div>
              </div>
            </th>
            {selectedYears.map((year) => (
              <th key={year} className="px-6 py-3 bg-gray-50">
                <div className="flex flex-col">
                  <span className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {year}
                  </span>
                  {fieldData && fieldData.rotations[year as Year] && (
                    <span className="text-left text-xs text-gray-400 mt-1">
                      {fieldData.rotations[year as Year]}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yearly avg
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {renderContent()}
        </tbody>
      </table>
    </div>
  );
};