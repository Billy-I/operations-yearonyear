import { useState } from 'react';
import { ViewType, UnitType, Year } from '../../types/analytics';
import { getValue, getVariableCosts, getOperationsCosts, getTotalCosts } from '../../utils/metricsCalculations';
import { metricsData } from '../../data/metricsData';

interface MultiYearTableProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
  setSelectedUnit: (unit: UnitType) => void;
}

export const MultiYearTable = ({
  selectedView,
  selectedYears,
  selectedUnit,
  setSelectedUnit
}: MultiYearTableProps) => {
  const [isChemicalsOpen, setIsChemicalsOpen] = useState(false);

  const renderVariableView = () => (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          Cost of production
        </td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('costOfProduction', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('costOfProduction', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Seed</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('seed', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('seed', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Fertiliser</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('fertiliser', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('fertiliser', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
          onClick={() => setIsChemicalsOpen(!isChemicalsOpen)}
        >
          <div className="flex items-center space-x-2">
            <span>{isChemicalsOpen ? '▼' : '▶'}</span>
            <span>Chemicals</span>
          </div>
        </td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('chemicals', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('chemicals', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      {isChemicalsOpen && (
        <>
          <tr className="bg-gray-50">
            <td className="pl-12 py-2 whitespace-nowrap text-sm text-gray-900">
              Trace Element
            </td>
            {selectedYears.map((year) => {
              const yearKey = year as Year;
              return (
                <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {metricsData.chemicalBreakdown.traceElement[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {metricsData.chemicalBreakdown.traceElement['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="pl-12 py-2 whitespace-nowrap text-sm text-gray-900">
              Herbicide
            </td>
            {selectedYears.map((year) => {
              const yearKey = year as Year;
              return (
                <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {metricsData.chemicalBreakdown.herbicide[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {metricsData.chemicalBreakdown.herbicide['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="pl-12 py-2 whitespace-nowrap text-sm text-gray-900">
              Fungicide
            </td>
            {selectedYears.map((year) => {
              const yearKey = year as Year;
              return (
                <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {metricsData.chemicalBreakdown.fungicide[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {metricsData.chemicalBreakdown.fungicide['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="pl-12 py-2 whitespace-nowrap text-sm text-gray-900">
              Adjuvant
            </td>
            {selectedYears.map((year) => {
              const yearKey = year as Year;
              return (
                <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                  {metricsData.chemicalBreakdown.adjuvant[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {metricsData.chemicalBreakdown.adjuvant['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'].toFixed(2)}
            </td>
          </tr>
        </>
      )}
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Variable Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getVariableCosts(year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getVariableCosts('Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('production', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('production', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gross Margin</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('grossMargin', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('grossMargin', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('yield', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('yield', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
    </>
  );

  const renderOperationsView = () => (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cultivating</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('cultivating', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('cultivating', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Drilling</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('drilling', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('drilling', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Applications</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('applications', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('applications', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Harvesting</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('harvesting', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('harvesting', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Other</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('other', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('other', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Operations Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getOperationsCosts(year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getOperationsCosts('Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('production', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('production', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gross Margin</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('grossMargin', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('grossMargin', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('yield', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('yield', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
    </>
  );

  const renderTotalView = () => (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Variable Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getVariableCosts(year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getVariableCosts('Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Operations Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getOperationsCosts(year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getOperationsCosts('Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getTotalCosts(year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getTotalCosts('Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('production', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('production', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Net Margin</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('netMargin', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('netMargin', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {getValue('yield', year, selectedUnit).toFixed(2)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {getValue('yield', 'Yearly avg', selectedUnit).toFixed(2)}
        </td>
      </tr>
    </>
  );

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
              <th key={year} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {year}
              </th>
            ))}
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Yearly avg
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {selectedView === 'Variable' && renderVariableView()}
          {selectedView === 'Operations' && renderOperationsView()}
          {selectedView === 'Total' && renderTotalView()}
        </tbody>
      </table>
    </div>
  );
};