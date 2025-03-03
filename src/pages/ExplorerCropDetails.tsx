import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Info } from 'lucide-react';
import { ChartContainer, CostChartView } from '../components/analytics/charts';
import ExpandableCostPanel from '../components/analytics/ExpandableCostPanel';
import DetailedPerformanceTable from '../components/analytics/DetailedPerformanceTable';
import MarketRangeIndicator from '../components/analytics/charts/common/MarketRangeIndicator';
import { MetricsData, Year } from '../types/analytics';
import { AVAILABLE_YEARS } from '../constants/analytics';
import { HelpPanel, CropPerformanceHelpContent, FeatureNotification } from '../components/help';

// Helper function to create yearly data with average
const createYearlyData = (baseValue: number, yearlyIncrease: number = 2) => {
  const result: { [key in Year]: { perTonne: number; perHectare: number } } = {
    '2019': { perTonne: baseValue, perHectare: baseValue * 8.1 },
    '2020': { perTonne: baseValue + yearlyIncrease, perHectare: (baseValue + yearlyIncrease) * 8.2 },
    '2021': { perTonne: baseValue + yearlyIncrease * 2, perHectare: (baseValue + yearlyIncrease * 2) * 8.3 },
    '2022': { perTonne: baseValue + yearlyIncrease * 3, perHectare: (baseValue + yearlyIncrease * 3) * 8.35 },
    '2023': { perTonne: baseValue + yearlyIncrease * 4, perHectare: (baseValue + yearlyIncrease * 4) * 8.35 },
    '2024': { perTonne: baseValue + yearlyIncrease * 5, perHectare: (baseValue + yearlyIncrease * 5) * 8.4 },
    'Yearly avg': { perTonne: baseValue + yearlyIncrease * 2.5, perHectare: (baseValue + yearlyIncrease * 2.5) * 8.28 }
  };
  return result;
};

// Mock data structure following MetricsData interface
const metricsData: MetricsData = {
  costOfProduction: createYearlyData(270, 3),
  seed: createYearlyData(11, 0.2),
  fertiliser: createYearlyData(60, 1),
  chemicals: createYearlyData(40, 1),
  chemicalBreakdown: {
    herbicide: createYearlyData(18, 0.4),
    fungicide: createYearlyData(14, 0.3),
    adjuvant: createYearlyData(4, 0.1),
    traceElement: createYearlyData(4, 0.2)
  },
  grossMargin: createYearlyData(60, 1.5),
  cultivating: createYearlyData(130, 1.2),
  drilling: createYearlyData(105, 1.4),
  applications: createYearlyData(25, 0.4),
  harvesting: createYearlyData(135, 1.8),
  other: createYearlyData(0, 0),
  production: createYearlyData(8.1, 0.06),
  yield: createYearlyData(8.1, 0.06),
  netMargin: createYearlyData(32, 0.8)
};

export default function ExplorerCropDetails() {
  const { crop } = useParams();
  // Year selection and metrics state
  const [selectedYear, setSelectedYear] = useState<Year>('2024');
  const [groupBy, setGroupBy] = useState<'Variety' | 'Field' | 'Region'>('Variety');
  const [costUnit, setCostUnit] = useState<'per_ha' | 'total'>('per_ha');
  const [chartView, setChartView] = useState<CostChartView>('distribution');
  
  // Chart configuration state
  const [costType, setCostType] = useState<'input' | 'total'>('total');
  
  // Performance table column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    area: true,
    costPerTonne: true,
    performance: true,
    yield: true,
    costPerHa: true,
    margin: true
  });

  // Help panel state
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  // Calculate total hectares from the existing data
  const totalHectares = 607.04;

  // Transform metrics data for the new chart component
  const chartData = {
    variable: {
      seed: {
        type: 'seed' as const,
        current: metricsData.seed[selectedYear].perHectare,
        min: metricsData.seed['Yearly avg'].perHectare * 0.8,
        max: metricsData.seed['Yearly avg'].perHectare * 1.2,
        average: metricsData.seed['Yearly avg'].perHectare
      },
      fertiliser: {
        type: 'fertiliser' as const,
        current: metricsData.fertiliser[selectedYear].perHectare,
        min: metricsData.fertiliser['Yearly avg'].perHectare * 0.8,
        max: metricsData.fertiliser['Yearly avg'].perHectare * 1.2,
        average: metricsData.fertiliser['Yearly avg'].perHectare
      },
      chemicals: {
        type: 'chemical' as const,
        current: metricsData.chemicals[selectedYear].perHectare,
        min: metricsData.chemicals['Yearly avg'].perHectare * 0.8,
        max: metricsData.chemicals['Yearly avg'].perHectare * 1.2,
        average: metricsData.chemicals['Yearly avg'].perHectare,
        subCategories: {
          herbicide: {
            min: metricsData.chemicalBreakdown.herbicide['Yearly avg'].perHectare * 0.8,
            max: metricsData.chemicalBreakdown.herbicide['Yearly avg'].perHectare * 1.2,
            average: metricsData.chemicalBreakdown.herbicide['Yearly avg'].perHectare,
            current: metricsData.chemicalBreakdown.herbicide[selectedYear].perHectare
          },
          fungicide: {
            min: metricsData.chemicalBreakdown.fungicide['Yearly avg'].perHectare * 0.8,
            max: metricsData.chemicalBreakdown.fungicide['Yearly avg'].perHectare * 1.2,
            average: metricsData.chemicalBreakdown.fungicide['Yearly avg'].perHectare,
            current: metricsData.chemicalBreakdown.fungicide[selectedYear].perHectare
          },
          adjuvant: {
            min: metricsData.chemicalBreakdown.adjuvant['Yearly avg'].perHectare * 0.8,
            max: metricsData.chemicalBreakdown.adjuvant['Yearly avg'].perHectare * 1.2,
            average: metricsData.chemicalBreakdown.adjuvant['Yearly avg'].perHectare,
            current: metricsData.chemicalBreakdown.adjuvant[selectedYear].perHectare
          },
          traceElement: {
            min: metricsData.chemicalBreakdown.traceElement['Yearly avg'].perHectare * 0.8,
            max: metricsData.chemicalBreakdown.traceElement['Yearly avg'].perHectare * 1.2,
            average: metricsData.chemicalBreakdown.traceElement['Yearly avg'].perHectare,
            current: metricsData.chemicalBreakdown.traceElement[selectedYear].perHectare
          }
        }
      }
    },
    operations: {
      cultivating: metricsData.cultivating[selectedYear].perHectare,
      drilling: metricsData.drilling[selectedYear].perHectare,
      applications: metricsData.applications[selectedYear].perHectare,
      harvesting: metricsData.harvesting[selectedYear].perHectare
    }
  };

  // Cost category panels data
  const variableCostCategories = [
    {
      name: 'Seed',
      data: metricsData.seed
    },
    {
      name: 'Fertiliser',
      data: metricsData.fertiliser
    },
    {
      name: 'Chemicals',
      data: metricsData.chemicals,
      subcategories: [
        {
          name: 'Herbicide',
          data: metricsData.chemicalBreakdown.herbicide
        },
        {
          name: 'Fungicide',
          data: metricsData.chemicalBreakdown.fungicide
        },
        {
          name: 'Adjuvant',
          data: metricsData.chemicalBreakdown.adjuvant
        },
        {
          name: 'Trace Element',
          data: metricsData.chemicalBreakdown.traceElement
        }
      ]
    }
  ];

  const operationCostCategories = [
    {
      name: 'Cultivations',
      data: metricsData.cultivating
    },
    {
      name: 'Drilling',
      data: metricsData.drilling
    },
    {
      name: 'Applications',
      data: metricsData.applications
    },
    {
      name: 'Harvesting',
      data: metricsData.harvesting
    }
  ];

  // Performance data
  const performanceData = [
    {
      name: 'KWS Estate',
      area: '363.36 ha',
      costPerTonne: '£282.96/t',
      performance: 75,
      yield: '8.40 t/ha',
      costPerHa: '£2,342.64/ha',
      grossMargin: '£536.38/ha',
      netMargin: '£287.15/ha'
    },
    {
      name: 'Mayflower',
      area: '109.47 ha',
      costPerTonne: '£293.71/t',
      performance: 66,
      yield: '8.16 t/ha',
      costPerHa: '£2,392.63/ha',
      grossMargin: '£47,135/ha',
      netMargin: '£25,272/ha'
    },
    {
      name: 'Crusoe',
      area: '134.21 ha',
      costPerTonne: '£302.40/t',
      performance: 50,
      yield: '7.53 t/ha',
      costPerHa: '£2,278.37/ha',
      grossMargin: '£858.84/ha',
      netMargin: '£461.53/ha'
    }
  ];

  const availableYearsReversed = [...AVAILABLE_YEARS].reverse();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/analytics/explorer" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-sm text-gray-600">Explorer / {crop}</div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Crop Performance - {crop}</h1>
              <button 
                onClick={() => setShowHelpPanel(true)}
                className="ml-2 text-gray-400 hover:text-gray-600"
                aria-label="Help"
              >
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/analytics/multi-year"
            state={{ from: `/analytics/explorer/${encodeURIComponent(crop || '')}` }}
            className="bg-gray-50 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900"
          >
            Multi year
          </Link>
          
          <button className="bg-gray-50 px-3 py-2 rounded-md text-gray-700 hover:text-gray-900">
            View programmes
          </button>

          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as Year)}
              className="bg-transparent border-none focus:ring-0"
            >
              {availableYearsReversed.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feature Notification */}
      {showNotification && (
        <div className="mb-6">
          <FeatureNotification
            title="New Feature: Cost Categories Toggle"
            message={
              <>
                <p className="mb-2">We've updated our cost filters to a simple checkbox. When "Total costs" is checked, you'll see all costs including operations (cultivating, drilling, etc.). When unchecked, you'll only see input costs (seed, fertilizer, and chemicals). Total Costs is selected by default to show your complete financial picture.</p>
                <div className="mt-3 flex items-center">
                  <Link
                    to="/data/operations"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <span className="mr-1">Go to Operations Center</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <span className="ml-2 text-xs text-gray-600">Customize your operations costs</span>
                </div>
              </>
            }
            onLearnMore={() => setShowHelpPanel(true)}
            onDismiss={() => setShowNotification(false)}
          />
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
        {/* Cost Category Toggle */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Cost Categories:</span>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={costType === 'total'}
                onChange={(e) => setCostType(e.target.checked ? 'total' : 'input')}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Total costs</span>
            </label>
          </div>
          <button
            onClick={() => setShowHelpPanel(true)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Info size={16} className="mr-1" />
            How do these affect my margins?
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Yield and Production Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Yield & Production</span>
            <button
              onClick={() => setShowHelpPanel(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={16} className="cursor-help" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Yield</div>
              <div className="text-xl font-bold">{metricsData.yield[selectedYear].perHectare.toFixed(2)} t/ha</div>
              <MarketRangeIndicator
                data={{
                  min: 4.77,
                  max: 11.15,
                  average: metricsData.yield['Yearly avg'].perHectare,
                  current: metricsData.yield[selectedYear].perHectare
                }}
                formatValue={(value: number) => `${value.toFixed(2)}t/ha`}
                className="w-[200px] h-6 mb-1"
              />
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Production</div>
              <div className="text-xl font-bold">{metricsData.production[selectedYear].perHectare.toFixed(2)}t</div>
              <div className="text-sm text-gray-500">Sales: £1,012.37/t</div>
            </div>
          </div>
        </div>

        {/* Area Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Area Information</span>
            <button
              onClick={() => setShowHelpPanel(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={16} className="cursor-help" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Number of Fields</div>
              <div className="text-xl font-bold">3</div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Harvested Area</div>
              <div className="text-xl font-bold">{totalHectares} ha (100%)</div>
            </div>
          </div>
        </div>

        {/* Costs Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Costs</span>
            <button
              onClick={() => setShowHelpPanel(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={16} className="cursor-help" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Per hectare</div>
              <div className="text-xl font-bold">
                £{(
                  (costType === 'input' || costType === 'total' ? Object.values(chartData.variable).reduce((sum, cost) => sum + cost.current, 0) : 0) +
                  (costType === 'total' ? Object.values(chartData.operations).reduce((sum, cost) => sum + cost, 0) : 0)
                ).toFixed(2)}/ha
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Per tonne</div>
              <div className="text-xl font-bold">
                £{(
                  ((costType === 'input' || costType === 'total' ? Object.values(chartData.variable).reduce((sum, cost) => sum + cost.current, 0) : 0) +
                  (costType === 'total' ? Object.values(chartData.operations).reduce((sum, cost) => sum + cost, 0) : 0)) /
                  metricsData.yield[selectedYear].perHectare
                ).toFixed(2)}/t
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Total cost</div>
              <div className="text-xl font-bold">
                £{(
                  ((costType === 'input' || costType === 'total' ? Object.values(chartData.variable).reduce((sum, cost) => sum + cost.current, 0) : 0) +
                  (costType === 'total' ? Object.values(chartData.operations).reduce((sum, cost) => sum + cost, 0) : 0)) *
                  totalHectares
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Profitability Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Profitability</span>
            <button
              onClick={() => setShowHelpPanel(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={16} className="cursor-help" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Gross Margin</div>
              {/* Calculate gross margin based on cost type */}
              {(() => {
                // Only show gross margin when input costs are active
                if (costType !== 'input' && costType !== 'total') {
                  return (
                    <>
                      <div className="text-xl font-bold mb-2">£0.00/ha</div>
                      <MarketRangeIndicator
                        data={{
                          min: 0,
                          max: 0,
                          average: 0,
                          current: 0
                        }}
                        formatValue={(value: number) => `£${value.toFixed(2)}/ha`}
                        className="w-[200px]"
                      />
                    </>
                  );
                }

                const variableCosts = Object.values(chartData.variable).reduce((sum, cost) => sum + cost.current, 0);
                const operationCosts = costType === 'total' ?
                  Object.values(chartData.operations).reduce((sum, cost) => sum + cost, 0) : 0;
                const totalCosts = variableCosts + operationCosts;
                const grossMargin = metricsData.yield[selectedYear].perHectare * 1012.37 - totalCosts;
                return (
                  <>
                    <div className="text-xl font-bold">£{grossMargin.toFixed(2)}/ha</div>
                    <div className="text-sm text-gray-500">Total: £{(grossMargin * totalHectares).toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
                  </>
                );
              })()}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Net Margin</div>
              {/* Calculate net margin based on cost type */}
              {(() => {
                // Only show net margin when total costs are active
                if (costType !== 'total') {
                  return (
                    <div className="text-xl font-bold">£0.00/ha</div>
                  );
                }

                const totalCosts = Object.values(chartData.variable).reduce((sum, cost) => sum + cost.current, 0) +
                                 Object.values(chartData.operations).reduce((sum, cost) => sum + cost, 0);
                const grossMargin = metricsData.yield[selectedYear].perHectare * 1012.37 - totalCosts;
                const netMargin = grossMargin * 0.535; // Using 53.5% of gross margin as net margin for this example
                return (
                  <>
                    <div className="text-xl font-bold">£{netMargin.toFixed(2)}/ha</div>
                    <div className="text-sm text-gray-500">Total: £{(netMargin * totalHectares).toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* New Unified Cost Chart */}
      <div className="mb-6 bg-white rounded-lg shadow" style={{ height: '600px' }}>
        <ChartContainer
          costBreakdown={chartData}
          view={chartView}
          onViewChange={setChartView}
          year={selectedYear}
          costUnit={costUnit}
          hectares={totalHectares}
          onUnitChange={setCostUnit}
          revenue={metricsData.grossMargin[selectedYear].perHectare + metricsData.costOfProduction[selectedYear].perHectare}
          yield={metricsData.yield[selectedYear].perHectare}
          pricePerTonne={1012.37}
          showVariableCosts={costType === 'input' || costType === 'total'}
          showOperationCosts={costType === 'total'}
          onToggleLayer={(layer) => {
            if (layer === 'variable' && costType === 'total') {
              setCostType('input');
            } else if (layer === 'variable' && costType === 'input') {
              setCostType('total');
            } else if (layer === 'operations' && costType === 'input') {
              setCostType('total');
            } else if (layer === 'operations' && costType === 'total') {
              setCostType('input');
            }
          }}
        />
      </div>

      {/* Performance Table */}
      <div className="mb-6">
        <div className="mb-4 flex justify-between items-center">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'Variety' | 'Field' | 'Region')}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="Variety">Variety</option>
            <option value="Field">Field</option>
            <option value="Region">Region</option>
          </select>
          
          <button 
            onClick={() => setShowHelpPanel(true)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <Info size={16} className="mr-1" />
            Understanding performance metrics
          </button>
        </div>

        <DetailedPerformanceTable
          data={performanceData}
          metricsData={metricsData}
          selectedYear={selectedYear}
          groupBy={groupBy}
          showNetMargin={costType === 'total'}
          visibleColumns={visibleColumns}
        />
      </div>

      {/* Cost Breakdowns */}
      <div className="space-y-6 mb-6">
        <ExpandableCostPanel
          title="Variable Costs"
          categories={variableCostCategories}
          selectedYear={selectedYear}
          costFilters={{ variable: costType === 'input' || costType === 'total' }}
        />
        
        <ExpandableCostPanel
          title="Operation Costs"
          categories={operationCostCategories}
          selectedYear={selectedYear}
          costFilters={{ operations: costType === 'total' }}
        />
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        title={`${crop} Performance Help`}
        content={<CropPerformanceHelpContent />}
      />
    </div>
  );
}