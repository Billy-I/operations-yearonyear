import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import CombinedCostChart from '../components/analytics/CombinedCostChart';
import ExpandableCostPanel from '../components/analytics/ExpandableCostPanel';
import DetailedPerformanceTable from '../components/analytics/DetailedPerformanceTable';
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
  const [selectedMetric, setSelectedMetric] = useState('Variable cost £/ha');
  const [groupBy, setGroupBy] = useState<'Variety' | 'Field' | 'Region'>('Variety');
  const [costUnit, setCostUnit] = useState<'per_ha' | 'total'>('per_ha');
  
  // Chart configuration state
  const [showVariableCosts, setShowVariableCosts] = useState(true);
  const [showOperationCosts, setShowOperationCosts] = useState(true);
  const [showTotalCosts, setShowTotalCosts] = useState(true);
  const [chartType, setChartType] = useState<'stacked-bar' | 'line' | 'grouped-bar'>('stacked-bar');
  
  // Cost category filters
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
  const totalHectares = 607.04; // This is the value shown in the KPI card

  // Cost categories for the expandable panels
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
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Yield</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-2">{metricsData.yield[selectedYear].perHectare.toFixed(2)} t/ha</div>
          <div className="relative w-full">
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="absolute h-1 bg-gray-400 rounded"
                style={{
                  left: '40%',
                  right: '20%'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>4.77t/ha</span>
              <span>11.15t/ha</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Cost per hectare</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Total cost per hectare including variable costs (seed, fertilizer, chemicals) and operation costs (cultivations, drilling, applications, harvesting)
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">£{metricsData.costOfProduction[selectedYear].perHectare.toFixed(2)}/ha</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600"># Fields</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">3</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Harvested area</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{totalHectares} ha (100%)</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Cost per tonne</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Total cost per tonne = (Variable Costs + Operation Costs) / Total Production. Shows the complete cost to produce one tonne of crop.
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold mb-2">£{metricsData.costOfProduction[selectedYear].perTonne.toFixed(2)}/t</div>
          <div className="relative w-full">
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="absolute h-1 bg-gray-400 rounded"
                style={{
                  left: '30%',
                  right: '25%'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>£3.56/t</span>
              <span>£254.32/t</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total cost</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                Total cost across all hectares = Cost per hectare × Total hectares. Includes all variable and operation costs for the entire crop area.
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold">£157,265.46</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Production</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{metricsData.production[selectedYear].perHectare.toFixed(2)}t</div>
          <div className="text-sm text-gray-500">Sales: £1,012.37/t</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Profitability</span>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-sm rounded p-2 w-64 right-0 mt-1">
                <div className="mb-2">
                  <strong>Gross Margin</strong> = Revenue - Variable Costs (seed, fertilizer, chemicals)
                </div>
                <div>
                  <strong>Net Margin</strong> = Gross Margin - Operation Costs (cultivations, drilling, applications, harvesting)
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-600">Gross Margin</div>
              <div className="text-2xl font-bold">£{metricsData.grossMargin[selectedYear].perHectare.toFixed(2)}/ha</div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="text-sm text-gray-600">Net Margin</div>
              <div className="text-2xl font-bold">£{metricsData.netMargin[selectedYear].perHectare.toFixed(2)}/ha</div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="text-sm text-gray-600">Difference</div>
              <div className="text-lg font-medium text-gray-700">
                £{(metricsData.grossMargin[selectedYear].perHectare - metricsData.netMargin[selectedYear].perHectare).toFixed(2)}/ha
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Cost Chart */}
      <div className="mb-6">
        <CombinedCostChart
          data={metricsData}
          years={AVAILABLE_YEARS}
          showVariableCosts={showVariableCosts}
          showOperationCosts={showOperationCosts}
          showTotalCosts={showTotalCosts}
          onToggleLayer={(layer) => {
            if (layer === 'variable') setShowVariableCosts(!showVariableCosts);
            if (layer === 'operations') setShowOperationCosts(!showOperationCosts);
            if (layer === 'total') setShowTotalCosts(!showTotalCosts);
          }}
          unit={costUnit}
          hectares={totalHectares}
          onUnitChange={setCostUnit}
          costFilters={costFilters}
          chartType={chartType}
          onChartTypeChange={setChartType}
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