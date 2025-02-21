import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { ChartContainer, CostChartView } from '../components/analytics/charts';
import ExpandableCostPanel from '../components/analytics/ExpandableCostPanel';
import DetailedPerformanceTable from '../components/analytics/DetailedPerformanceTable';
import MarketRangeIndicator from '../components/analytics/charts/common/MarketRangeIndicator';
import { MetricsData, Year } from '../types/analytics';
import { AVAILABLE_YEARS } from '../constants/analytics';

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
  const [costFilters, setCostFilters] = useState({
    seed: true,
    fertiliser: true,
    chemicals: true,
    cultivating: true,
    drilling: true,
    applications: true,
    harvesting: true
  });
  
  // Performance table column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    area: true,
    costPerTonne: true,
    performance: true,
    yield: true,
    costPerHa: true,
    margin: true
  });

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
            <h1 className="text-2xl font-bold">Crop Performance - {crop}</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/analytics/multi-year"
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

      {/* Filter Bar */}
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
        {/* Cost Category Filters */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Cost Categories:</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(costFilters).map(([category, isVisible]) => (
              <button
                key={category}
                onClick={() => setCostFilters(prev => ({ ...prev, [category]: !isVisible }))}
                className={`px-3 py-1 rounded-full text-sm ${
                  isVisible
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Column Visibility Menu */}
        <div className="relative group">
          <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Columns
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 invisible group-hover:visible">
            {Object.entries(visibleColumns).map(([column, isVisible]) => (
              <label key={column} className="flex items-center p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => setVisibleColumns(prev => ({ ...prev, [column]: !isVisible }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {column.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Yield and Production Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Yield & Production</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Current yield and production metrics compared to market benchmarks
              </div>
            </div>
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
                width={200}
                formatValue={(value: number) => `${value.toFixed(2)}t/ha`}
                height={24}
                className="mb-1"
              />
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Production</div>
              <div className="text-xl font-bold">{metricsData.production[selectedYear].perHectare.toFixed(2)}t</div>
              <div className="text-sm text-gray-500">Sales: £1,012.37/t</div>
            </div>
          </div>
        </div>

        {/* Costs Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Costs</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Comprehensive cost metrics including per hectare, per tonne, and total costs
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Per hectare</div>
              <div className="text-xl font-bold">£{metricsData.costOfProduction[selectedYear].perHectare.toFixed(2)}/ha</div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Per tonne</div>
              <div className="text-xl font-bold">£{metricsData.costOfProduction[selectedYear].perTonne.toFixed(2)}/t</div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Total cost</div>
              <div className="text-xl font-bold">£157,265.46</div>
            </div>
          </div>
        </div>

        {/* Area Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Area Information</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Field and area statistics
              </div>
            </div>
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

        {/* Profitability Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Profitability</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Gross and net margin analysis
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Gross Margin</div>
              <div className="text-xl font-bold mb-2">£{metricsData.grossMargin[selectedYear].perHectare.toFixed(2)}/ha</div>
              <MarketRangeIndicator
                data={{
                  min: metricsData.grossMargin['Yearly avg'].perHectare * 0.7,
                  max: metricsData.grossMargin['Yearly avg'].perHectare * 1.3,
                  average: metricsData.grossMargin['Yearly avg'].perHectare,
                  current: metricsData.grossMargin[selectedYear].perHectare
                }}
                width={200}
                formatValue={(value: number) => `£${value.toFixed(2)}/ha`}
              />
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-600">Net Margin</div>
              <div className="text-xl font-bold">£{metricsData.netMargin[selectedYear].perHectare.toFixed(2)}/ha</div>
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
          performanceData={performanceData.map(item => ({
            name: item.name,
            area: item.area,
            performance: item.performance,
            yield: parseFloat(item.yield.split(' ')[0]),
            costPerHa: item.costPerHa
          }))}
        />
      </div>

      {/* Cost Breakdowns */}
      <div className="space-y-6 mb-6">
        <ExpandableCostPanel
          title="Variable Costs"
          categories={variableCostCategories}
          selectedYear={selectedYear}
          costFilters={costFilters}
        />
        
        <ExpandableCostPanel
          title="Operation Costs"
          categories={operationCostCategories}
          selectedYear={selectedYear}
          costFilters={costFilters}
        />
      </div>

      {/* Performance Table */}
      <div>
        <div className="mb-4">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'Variety' | 'Field' | 'Region')}
            className="border-gray-300 rounded-md"
          >
            <option value="Variety">Variety</option>
            <option value="Field">Field</option>
            <option value="Region">Region</option>
          </select>
        </div>

        <DetailedPerformanceTable
          data={performanceData}
          metricsData={metricsData}
          selectedYear={selectedYear}
          groupBy={groupBy}
          showNetMargin
          visibleColumns={visibleColumns}
        />
      </div>
    </div>
  );
}