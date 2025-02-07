import { ViewType, UnitType, Year } from '../../types/analytics';
import { getValue, getVariableCosts, getOperationsCosts, getTotalCosts } from '../../utils/metricsCalculations';
import { fieldsData } from '../../data/fieldData';
import { metricsData } from '../../data/metricsData';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface FieldRotationTableProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
  setSelectedUnit: (unit: UnitType) => void;
  selectedField: string;
}

export const FieldRotationTable = ({
  selectedYears,
  selectedUnit,
  setSelectedUnit,
  selectedField,
  selectedView
}: FieldRotationTableProps) => {
  const fieldData = fieldsData.find(field => field.id === selectedField);
  
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
              {value.toFixed(2)}
              {selectedView === 'Variable' && <Tooltip id={`metric-${metric}-${yearKey}`} />}
            </td>
          );
        })}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue(metric, 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    if (!fieldData) return null;

    switch (selectedView) {
      case 'Variable':
        return (
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
                    {value.toFixed(2)}
                    <Tooltip id={`total-variable-${yearKey}`} />
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {getVariableCosts('Yearly avg', selectedUnit).toFixed(2)}
              </td>
            </tr>

            {/* Production Metrics */}
            {renderMetricRow('Production', 'production')}
            {renderMetricRow('Gross Margin', 'grossMargin')}
            {renderMetricRow('Yield', 'yield')}
          </>
        );
      case 'Operations':
        return (
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
                    {value.toFixed(2)}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {getOperationsCosts('Yearly avg', selectedUnit).toFixed(2)}
              </td>
            </tr>

            {/* Production Metrics */}
            {renderMetricRow('Production', 'production')}
            {renderMetricRow('Gross Margin', 'grossMargin')}
            {renderMetricRow('Yield', 'yield')}
          </>
        );
      case 'Total':
        return (
          <>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Variable Costs
              </td>
              {selectedYears.map((year) => {
                const yearKey = year as Year;
                const value = getVariableCosts(yearKey, selectedUnit);
                return (
                  <td
                    key={year}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {value.toFixed(2)}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getVariableCosts('Yearly avg', selectedUnit).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Operations Costs
              </td>
              {selectedYears.map((year) => {
                const yearKey = year as Year;
                const value = getOperationsCosts(yearKey, selectedUnit);
                return (
                  <td
                    key={year}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {value.toFixed(2)}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getOperationsCosts('Yearly avg', selectedUnit).toFixed(2)}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total Costs
              </td>
              {selectedYears.map((year) => {
                const yearKey = year as Year;
                const value = getTotalCosts(yearKey, selectedUnit);
                return (
                  <td
                    key={year}
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {value.toFixed(2)}
                  </td>
                );
              })}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {getTotalCosts('Yearly avg', selectedUnit).toFixed(2)}
              </td>
            </tr>
            {renderMetricRow('Production', 'production')}
            {renderMetricRow('Net Margin', 'netMargin')}
            {renderMetricRow('Yield', 'yield')}
          </>
        );
      default:
        return null;
    }
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
                    onClick={() => setSelectedUnit('£/t')}
                  >
                    £/t
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/ha' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedUnit('£/ha')}
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