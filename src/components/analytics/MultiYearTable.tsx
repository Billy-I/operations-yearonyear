import { useState } from 'react';
import { ViewType, UnitType, Year } from '../../types/analytics';
import { getValue, getVariableCosts, getOperationsCosts, getTotalCosts } from '../../utils/metricsCalculations';
import { metricsData } from '../../data/metricsData';

interface CostFilters {
  variable?: boolean;
  operations?: boolean;
}

interface MultiYearTableProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
  setSelectedUnit?: (unit: UnitType) => void;
  costFilters?: CostFilters;
}

export const MultiYearTable = ({
  selectedView,
  selectedYears,
  selectedUnit,
  setSelectedUnit,
  costFilters = { variable: true, operations: true }
}: MultiYearTableProps) => {
  // State for collapsible sections
  const [isChemicalsOpen, setIsChemicalsOpen] = useState(false);
  const [isVariableCostsOpen, setIsVariableCostsOpen] = useState(false); // Renamed to Input Costs in UI but keeping variable name
  const [isOperationsCostsOpen, setIsOperationsCostsOpen] = useState(false);

  const formatValueWithUnit = (value: number): string => {
    return `£${value.toFixed(2)} ${selectedUnit === '£/t' ? '/t' : '/ha'}`;
  };

  const renderVariableView = () => (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          Cost of production
        </td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('costOfProduction', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('costOfProduction', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Seed</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('seed', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('seed', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Fertiliser</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('fertiliser', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('fertiliser', 'Yearly avg', selectedUnit))}
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
            {formatValueWithUnit(getValue('chemicals', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('chemicals', 'Yearly avg', selectedUnit))}
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
                  {formatValueWithUnit(metricsData.chemicalBreakdown.traceElement[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(metricsData.chemicalBreakdown.traceElement['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
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
                  {formatValueWithUnit(metricsData.chemicalBreakdown.herbicide[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(metricsData.chemicalBreakdown.herbicide['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
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
                  {formatValueWithUnit(metricsData.chemicalBreakdown.fungicide[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(metricsData.chemicalBreakdown.fungicide['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
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
                  {formatValueWithUnit(metricsData.chemicalBreakdown.adjuvant[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                </td>
              );
            })}
            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(metricsData.chemicalBreakdown.adjuvant['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
            </td>
          </tr>
        </>
      )}
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Input Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getVariableCosts(year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getVariableCosts('Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('production', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('production', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gross Margin</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('grossMargin', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('grossMargin', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('yield', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('yield', 'Yearly avg', selectedUnit))}
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
            {formatValueWithUnit(getValue('cultivating', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('cultivating', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Drilling</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('drilling', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('drilling', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Applications</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('applications', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('applications', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Harvesting</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('harvesting', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('harvesting', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Other</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('other', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('other', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr className="bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Operations Costs</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getOperationsCosts(year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getOperationsCosts('Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('production', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('production', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
        {selectedYears.map((year) => (
          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('yield', year, selectedUnit))}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatValueWithUnit(getValue('yield', 'Yearly avg', selectedUnit))}
        </td>
      </tr>
    </>
  );

  const renderTotalView = () => {
    // Calculate costs based on active filters
    const getFilteredVariableCosts = (year: string, unit: UnitType): number => {
      return costFilters.variable ? getVariableCosts(year, unit) : 0;
    };

    const getFilteredOperationsCosts = (year: string, unit: UnitType): number => {
      return costFilters.operations ? getOperationsCosts(year, unit) : 0;
    };

    const getFilteredTotalCosts = (year: string, unit: UnitType): number => {
      return getFilteredVariableCosts(year, unit) + getFilteredOperationsCosts(year, unit);
    };

    return (
      <>
        {/* Input Costs Section with collapsible details */}
        {costFilters.variable && (
          <>
            {/* Total Input Costs row (collapsible header) */}
            <tr className="bg-gray-50">
              <td
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                onClick={() => setIsVariableCostsOpen(!isVariableCostsOpen)}
              >
                <div className="flex items-center space-x-2">
                  <span>{isVariableCostsOpen ? '▼' : '▶'}</span>
                  <span>Total Input Costs</span>
                </div>
              </td>
              {selectedYears.map((year) => (
                <td key={year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatValueWithUnit(getVariableCosts(year, selectedUnit))}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatValueWithUnit(getVariableCosts('Yearly avg', selectedUnit))}
              </td>
            </tr>

            {/* Input costs details (shown when expanded) */}
            {isVariableCostsOpen && (
              <>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Cost of production</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('costOfProduction', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('costOfProduction', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Seed</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('seed', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('seed', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Fertiliser</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('fertiliser', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('fertiliser', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                      onClick={() => setIsChemicalsOpen(!isChemicalsOpen)}>
                    <div className="flex items-center space-x-2">
                      <span>{isChemicalsOpen ? '▼' : '▶'}</span>
                      <span>Chemicals</span>
                    </div>
                  </td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('chemicals', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('chemicals', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                {isChemicalsOpen && (
                  <>
                    <tr className="bg-gray-50">
                      <td className="pl-16 py-2 whitespace-nowrap text-sm text-gray-900">
                        Trace Element
                      </td>
                      {selectedYears.map((year) => {
                        const yearKey = year as Year;
                        return (
                          <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatValueWithUnit(metricsData.chemicalBreakdown.traceElement[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                          </td>
                        );
                      })}
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatValueWithUnit(metricsData.chemicalBreakdown.traceElement['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="pl-16 py-2 whitespace-nowrap text-sm text-gray-900">
                        Herbicide
                      </td>
                      {selectedYears.map((year) => {
                        const yearKey = year as Year;
                        return (
                          <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatValueWithUnit(metricsData.chemicalBreakdown.herbicide[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                          </td>
                        );
                      })}
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatValueWithUnit(metricsData.chemicalBreakdown.herbicide['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="pl-16 py-2 whitespace-nowrap text-sm text-gray-900">
                        Fungicide
                      </td>
                      {selectedYears.map((year) => {
                        const yearKey = year as Year;
                        return (
                          <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatValueWithUnit(metricsData.chemicalBreakdown.fungicide[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                          </td>
                        );
                      })}
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatValueWithUnit(metricsData.chemicalBreakdown.fungicide['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="pl-16 py-2 whitespace-nowrap text-sm text-gray-900">
                        Adjuvant
                      </td>
                      {selectedYears.map((year) => {
                        const yearKey = year as Year;
                        return (
                          <td key={year} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {formatValueWithUnit(metricsData.chemicalBreakdown.adjuvant[yearKey][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                          </td>
                        );
                      })}
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {formatValueWithUnit(metricsData.chemicalBreakdown.adjuvant['Yearly avg'][selectedUnit === '£/t' ? 'perTonne' : 'perHectare'])}
                      </td>
                    </tr>
                  </>
                )}
              </>
            )}
          </>
        )}
        
        {/* Operations Costs Section with collapsible details */}
        {costFilters.operations && (
          <>
            {/* Total Operations Costs row (collapsible header) */}
            <tr className="bg-gray-50">
              <td
                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                onClick={() => setIsOperationsCostsOpen(!isOperationsCostsOpen)}
              >
                <div className="flex items-center space-x-2">
                  <span>{isOperationsCostsOpen ? '▼' : '▶'}</span>
                  <span>Total Operations Costs</span>
                </div>
              </td>
              {selectedYears.map((year) => (
                <td key={year} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatValueWithUnit(getOperationsCosts(year, selectedUnit))}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatValueWithUnit(getOperationsCosts('Yearly avg', selectedUnit))}
              </td>
            </tr>

            {/* Operations costs details (shown when expanded) */}
            {isOperationsCostsOpen && (
              <>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Cultivating</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('cultivating', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('cultivating', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Drilling</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('drilling', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('drilling', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Applications</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('applications', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('applications', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Harvesting</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('harvesting', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('harvesting', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
                <tr>
                  <td className="pl-10 py-4 whitespace-nowrap text-sm text-gray-900">Other</td>
                  {selectedYears.map((year) => (
                    <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValueWithUnit(getValue('other', year, selectedUnit))}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValueWithUnit(getValue('other', 'Yearly avg', selectedUnit))}
                  </td>
                </tr>
              </>
            )}
          </>
        )}
        
        {/* Total costs section - only shown if either variable or operations costs are enabled */}
        {(costFilters.variable || costFilters.operations) && (
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Costs</td>
            {selectedYears.map((year) => (
              <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatValueWithUnit(getFilteredTotalCosts(year, selectedUnit))}
              </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(getFilteredTotalCosts('Yearly avg', selectedUnit))}
            </td>
          </tr>
        )}
        
        {/* Always show production */}
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
          {selectedYears.map((year) => (
            <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(getValue('production', year, selectedUnit))}
            </td>
          ))}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('production', 'Yearly avg', selectedUnit))}
          </td>
        </tr>
        
        {/* Show Gross Margin only if input costs are active */}
        {costFilters.variable && (
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gross Margin</td>
            {selectedYears.map((year) => (
              <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatValueWithUnit(getValue('grossMargin', year, selectedUnit))}
              </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(getValue('grossMargin', 'Yearly avg', selectedUnit))}
            </td>
          </tr>
        )}
        
        {/* Show Net Margin only if both variable and operations costs are active */}
        {costFilters.variable && costFilters.operations && (
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Net Margin</td>
            {selectedYears.map((year) => (
              <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatValueWithUnit(getValue('netMargin', year, selectedUnit))}
              </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(getValue('netMargin', 'Yearly avg', selectedUnit))}
            </td>
          </tr>
        )}
        
        {/* Always show yield */}
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
          {selectedYears.map((year) => (
            <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatValueWithUnit(getValue('yield', year, selectedUnit))}
            </td>
          ))}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {formatValueWithUnit(getValue('yield', 'Yearly avg', selectedUnit))}
          </td>
        </tr>
      </>
    );
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Metrics
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
          {renderTotalView()}
        </tbody>
      </table>
    </div>
  );
};