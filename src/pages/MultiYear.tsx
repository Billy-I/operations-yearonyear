import { useState } from 'react';
import { HelpCircle, ArrowLeft, Leaf, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Year = '2019' | '2020' | '2021' | '2022' | '2023' | '2024' | 'Yearly avg';

const AVAILABLE_YEARS = ['2019', '2020', '2021', '2022', '2023', '2024'] as const;
const AVAILABLE_CROPS = ['Wheat(Winter)', 'Barley', 'Linseed'] as const;
const AVAILABLE_FILTERS = ['None', 'End Use Group', 'End Use Market', 'Varieties'] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseYearlyData: { [key in Year]: number } = {
  '2019': 974.06,
  '2020': 1004.06,
  '2021': 0,
  '2022': 895.58,
  '2023': 908.39,
  '2024': 915.45,
  'Yearly avg': 1082.47
};

interface MetricData {
  perTonne: number;
  perHectare: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface YearlyMetricData {
  [key: string]: MetricData;
}

interface MetricsData {
  costOfProduction: { [key in Year]: MetricData };
  seed: { [key in Year]: MetricData };
  fertiliser: { [key in Year]: MetricData };
  chemicals: { [key in Year]: MetricData };
  grossMargin: { [key in Year]: MetricData };
  cultivating: { [key in Year]: MetricData };
  drilling: { [key in Year]: MetricData };
  applications: { [key in Year]: MetricData };
  harvesting: { [key in Year]: MetricData };
  other: { [key in Year]: MetricData };
}

const metricsData: MetricsData = {
  costOfProduction: {
    '2019': { perTonne: 185.42, perHectare: 974.06 },
    '2020': { perTonne: 195.60, perHectare: 1004.06 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 178.25, perHectare: 895.58 },
    '2023': { perTonne: 182.50, perHectare: 908.39 },
    '2024': { perTonne: 184.75, perHectare: 915.45 },
    'Yearly avg': { perTonne: 198.45, perHectare: 1082.47 }
  },
  seed: {
    '2019': { perTonne: 12.05, perHectare: 98.45 },
    '2020': { perTonne: 12.20, perHectare: 99.80 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 11.42, perHectare: 93.40 },
    '2023': { perTonne: 10.51, perHectare: 86.00 },
    '2024': { perTonne: 10.85, perHectare: 89.20 },
    'Yearly avg': { perTonne: 11.50, perHectare: 94.10 }
  },
  fertiliser: {
    '2019': { perTonne: 64.19, perHectare: 524.43 },
    '2020': { perTonne: 66.20, perHectare: 541.20 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 67.30, perHectare: 550.24 },
    '2023': { perTonne: 54.46, perHectare: 445.20 },
    '2024': { perTonne: 56.80, perHectare: 465.50 },
    'Yearly avg': { perTonne: 64.99, perHectare: 531.20 }
  },
  chemicals: {
    '2019': { perTonne: 44.13, perHectare: 360.74 },
    '2020': { perTonne: 48.67, perHectare: 397.80 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 49.84, perHectare: 407.40 },
    '2023': { perTonne: 42.67, perHectare: 348.80 },
    '2024': { perTonne: 44.15, perHectare: 360.75 },
    'Yearly avg': { perTonne: 46.70, perHectare: 381.60 }
  },
  grossMargin: {
    '2019': { perTonne: 676.00, perHectare: 5532.92 },
    '2020': { perTonne: 793.40, perHectare: 6492.10 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 813.80, perHectare: 6660.09 },
    '2023': { perTonne: 669.80, perHectare: 5481.74 },
    '2024': { perTonne: 685.50, perHectare: 5625.85 },
    'Yearly avg': { perTonne: 727.60, perHectare: 5952.72 }
  },
  cultivating: {
    '2019': { perTonne: 35.20, perHectare: 287.58 },
    '2020': { perTonne: 36.40, perHectare: 297.45 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 34.80, perHectare: 284.35 },
    '2023': { perTonne: 35.50, perHectare: 290.20 },
    '2024': { perTonne: 35.90, perHectare: 293.45 },
    'Yearly avg': { perTonne: 35.56, perHectare: 290.61 }
  },
  drilling: {
    '2019': { perTonne: 28.40, perHectare: 232.15 },
    '2020': { perTonne: 29.20, perHectare: 238.65 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 27.90, perHectare: 228.10 },
    '2023': { perTonne: 28.60, perHectare: 233.70 },
    '2024': { perTonne: 28.80, perHectare: 235.45 },
    'Yearly avg': { perTonne: 28.58, perHectare: 233.61 }
  },
  applications: {
    '2019': { perTonne: 42.50, perHectare: 347.45 },
    '2020': { perTonne: 43.80, perHectare: 358.10 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 41.90, perHectare: 342.55 },
    '2023': { perTonne: 42.80, perHectare: 349.90 },
    '2024': { perTonne: 43.10, perHectare: 352.35 },
    'Yearly avg': { perTonne: 42.82, perHectare: 350.07 }
  },
  harvesting: {
    '2019': { perTonne: 52.30, perHectare: 427.50 },
    '2020': { perTonne: 53.90, perHectare: 440.65 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 51.60, perHectare: 421.75 },
    '2023': { perTonne: 52.70, perHectare: 430.85 },
    '2024': { perTonne: 53.10, perHectare: 434.20 },
    'Yearly avg': { perTonne: 52.72, perHectare: 430.99 }
  },
  other: {
    '2019': { perTonne: 27.02, perHectare: 220.88 },
    '2020': { perTonne: 28.30, perHectare: 231.41 },
    '2021': { perTonne: 0, perHectare: 0 },
    '2022': { perTonne: 26.45, perHectare: 216.23 },
    '2023': { perTonne: 27.40, perHectare: 223.94 },
    '2024': { perTonne: 27.65, perHectare: 226.10 },
    'Yearly avg': { perTonne: 27.36, perHectare: 223.71 }
  }
};

export default function MultiYear() {
  const [selectedView, setSelectedView] = useState('Variable');
  const [selectedYears, setSelectedYears] = useState<string[]>(['2019', '2020', '2021', '2022', '2023', '2024']);
  const [selectedUnit, setSelectedUnit] = useState<'£/t' | '£/ha'>('£/t');
  const [selectedCrop, setSelectedCrop] = useState('Wheat(Winter)');
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [selectedTab, setSelectedTab] = useState<'comparison' | 'rotation'>('comparison');
  const [selectedMetric, setSelectedMetric] = useState<string>('costOfProduction');

  const getAvailableMetrics = () => {
    switch (selectedView) {
      case 'Variable':
        return [
          { value: 'costOfProduction', label: 'Cost of Production' },
          { value: 'seed', label: 'Seed' },
          { value: 'fertiliser', label: 'Fertiliser' },
          { value: 'chemicals', label: 'Chemicals' }
        ];
      case 'Operations':
        return [
          { value: 'cultivating', label: 'Cultivating' },
          { value: 'drilling', label: 'Drilling' },
          { value: 'applications', label: 'Applications' },
          { value: 'harvesting', label: 'Harvesting' },
          { value: 'other', label: 'Other' }
        ];
      case 'Total':
        return [
          { value: 'variableCosts', label: 'Variable Costs' },
          { value: 'operationsCosts', label: 'Operations Costs' },
          { value: 'totalCosts', label: 'Total Costs' }
        ];
      default:
        return [];
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const productionData: { [key in Year]: number } = {
    '2019': 4957.64,
    '2020': 4992.10,
    '2021': 0,
    '2022': 4660.09,
    '2023': 4481.74,
    '2024': 4585.25,
    'Yearly avg': 4837.66
  };

  // Calculate base cost for a given year
  const getBaseYearlyCost = (year: Year): number => {
    return baseYearlyData[year] || 0;
  };

  // Type-safe metric data accessor
  const getYearlyMetricData = (year: Year): YearlyMetricData => {
    const metrics: YearlyMetricData = {};
    Object.keys(metricsData).forEach((metric) => {
      metrics[metric] = metricsData[metric as keyof MetricsData][year];
    });
    return metrics;
  };

  const getValue = (metric: keyof MetricsData, year: string) => {
    const data = metricsData[metric][year as Year];
    if (!data) return 0;
    
    // Apply base cost adjustment for Total view
    if (selectedView === 'Total' && metric === 'costOfProduction') {
      const baseCost = getBaseYearlyCost(year as Year);
      return selectedUnit === '£/t' ?
        (data.perTonne + baseCost / 8.17) :
        (data.perHectare + baseCost);
    }
    
    return selectedUnit === '£/t' ? data.perTonne : data.perHectare;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/analytics/explorer" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-sm text-gray-600">Explorer / Multi year</div>
            <h1 className="text-2xl font-bold">Multi Year Analysis</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Link to="/analytics/explorer" className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Explorer Overview
            </Link>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <select
                value={selectedView}
                onChange={(e) => {
                  const newView = e.target.value;
                  setSelectedView(newView);
                  // Update selectedMetric based on the new view
                  switch (newView) {
                    case 'Variable':
                      setSelectedMetric('costOfProduction');
                      break;
                    case 'Operations':
                      setSelectedMetric('cultivating');
                      break;
                    case 'Total':
                      setSelectedMetric('totalCosts');
                      break;
                  }
                }}
                className="bg-transparent border-none focus:ring-0"
              >
                <option value="Variable">Variable</option>
                <option value="Operations">Operations</option>
                <option value="Total">Total</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <div className="relative">
                <button
                  className="bg-transparent border-none focus:ring-0 flex items-center space-x-2"
                  onClick={(e) => {
                    const target = e.currentTarget.nextElementSibling;
                    if (target) {
                      target.classList.toggle('hidden');
                    }
                  }}
                >
                  <span>{selectedYears.length} years selected</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-50 hidden">
                  {AVAILABLE_YEARS.map((year) => (
                    <label key={year} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedYears.includes(year)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedYears([...selectedYears, year]);
                          } else {
                            setSelectedYears(selectedYears.filter((y) => y !== year));
                          }
                        }}
                        className="mr-2"
                      />
                      {year}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Crop(s)</div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                    <Leaf className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="bg-transparent border-none focus:ring-0"
                    >
                      {AVAILABLE_CROPS.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Filter By</div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="bg-transparent border-none focus:ring-0"
                    >
                      {AVAILABLE_FILTERS.map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  className={`px-4 py-2 ${selectedTab === 'comparison' ? 'bg-gray-500 text-white' : 'bg-gray-200'} rounded-l-md`}
                  onClick={() => setSelectedTab('comparison')}
                >
                  Crop Comparison
                </button>
                <button
                  className={`px-4 py-2 ${selectedTab === 'rotation' ? 'bg-gray-500 text-white' : 'bg-gray-200'} rounded-r-md`}
                  onClick={() => setSelectedTab('rotation')}
                >
                  Field Rotation
                </button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <span>Metrics</span>
                      <div className="ml-2 flex space-x-1">
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
                  {selectedView === 'Variable' ? (
                    <>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Cost of production
                        </td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('costOfProduction', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('costOfProduction', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Seed</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('seed', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('seed', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Fertiliser</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('fertiliser', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('fertiliser', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Chemicals</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('chemicals', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('chemicals', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Cost</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(
                              getValue('costOfProduction', year) +
                              getValue('seed', year) +
                              getValue('fertiliser', year) +
                              getValue('chemicals', year)
                            ).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(
                            getValue('costOfProduction', 'Yearly avg') +
                            getValue('seed', 'Yearly avg') +
                            getValue('fertiliser', 'Yearly avg') +
                            getValue('chemicals', 'Yearly avg')
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : selectedView === 'Operations' ? (
                    <>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cultivating</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('cultivating', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('cultivating', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Drilling</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('drilling', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('drilling', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Applications</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('applications', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('applications', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Harvesting</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('harvesting', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('harvesting', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Other</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getValue('other', year).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getValue('other', 'Yearly avg').toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Cost</td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(
                              getValue('cultivating', year) +
                              getValue('drilling', year) +
                              getValue('applications', year) +
                              getValue('harvesting', year) +
                              getValue('other', year)
                            ).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(
                            getValue('cultivating', 'Yearly avg') +
                            getValue('drilling', 'Yearly avg') +
                            getValue('applications', 'Yearly avg') +
                            getValue('harvesting', 'Yearly avg') +
                            getValue('other', 'Yearly avg')
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : selectedView === 'Total' ? (
                    <>
                      {/* Variable Costs */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Variable Costs
                        </td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(
                              getValue('seed', year) +
                              getValue('fertiliser', year) +
                              getValue('chemicals', year)
                            ).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(
                            getValue('seed', 'Yearly avg') +
                            getValue('fertiliser', 'Yearly avg') +
                            getValue('chemicals', 'Yearly avg')
                          ).toFixed(2)}
                        </td>
                      </tr>
                      {/* Operations Costs */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Operations Costs
                        </td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(
                              getValue('cultivating', year) +
                              getValue('drilling', year) +
                              getValue('applications', year) +
                              getValue('harvesting', year) +
                              getValue('other', year)
                            ).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(
                            getValue('cultivating', 'Yearly avg') +
                            getValue('drilling', 'Yearly avg') +
                            getValue('applications', 'Yearly avg') +
                            getValue('harvesting', 'Yearly avg') +
                            getValue('other', 'Yearly avg')
                          ).toFixed(2)}
                        </td>
                      </tr>
                      {/* Total Costs */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Total Costs
                        </td>
                        {selectedYears.map((year) => (
                          <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(
                              getValue('seed', year) +
                              getValue('fertiliser', year) +
                              getValue('chemicals', year) +
                              getValue('cultivating', year) +
                              getValue('drilling', year) +
                              getValue('applications', year) +
                              getValue('harvesting', year) +
                              getValue('other', year) +
                              getBaseYearlyCost(year as Year)
                            ).toFixed(2)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(
                            getValue('seed', 'Yearly avg') +
                            getValue('fertiliser', 'Yearly avg') +
                            getValue('chemicals', 'Yearly avg') +
                            getValue('cultivating', 'Yearly avg') +
                            getValue('drilling', 'Yearly avg') +
                            getValue('applications', 'Yearly avg') +
                            getValue('harvesting', 'Yearly avg') +
                            getValue('other', 'Yearly avg') +
                            getBaseYearlyCost('Yearly avg')
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : null}
                  {/* Common rows for all views */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Production</td>
                    {selectedYears.map((year) => (
                      <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedUnit === '£/t'
                          ? (productionData[year as Year] / 8.17).toFixed(2)
                          : productionData[year as Year].toFixed(2)
                        }
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedUnit === '£/t'
                        ? (productionData['Yearly avg'] / 7.75).toFixed(2)
                        : productionData['Yearly avg'].toFixed(2)
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {selectedView === 'Total' ? 'Net margin' : 'Gross margin'}
                    </td>
                    {selectedYears.map((year) => (
                      <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {selectedView === 'Total'
                          ? (getValue('grossMargin', year) * 0.75).toFixed(2) // Net margin for Total view
                          : selectedView === 'Operations'
                            ? (getValue('grossMargin', year) * 0.85).toFixed(2) // Adjusted value for Operations view
                            : getValue('grossMargin', year).toFixed(2)
                        }
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedView === 'Total'
                        ? (getValue('grossMargin', 'Yearly avg') * 0.75).toFixed(2) // Net margin for Total view
                        : selectedView === 'Operations'
                          ? (getValue('grossMargin', 'Yearly avg') * 0.85).toFixed(2) // Adjusted value for Operations view
                          : getValue('grossMargin', 'Yearly avg').toFixed(2)
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yield</td>
                    {selectedYears.map((year) => (
                      <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {year === '2021' ? '-' : selectedUnit === '£/t' ? '1.00' : '8.17'}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedUnit === '£/t' ? '1.00' : '7.75'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Performance Metrics</h2>
                <HelpCircle size={20} className="text-gray-400" />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 mr-2"
                >
                  {getAvailableMetrics().map(metric => (
                    <option key={metric.value} value={metric.value}>{metric.label}</option>
                  ))}
                </select>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value as '£/t' | '£/ha')}
                  className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="£/t">£/t</option>
                  <option value="£/ha">£/ha</option>
                </select>
              </div>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedYears.map((year) => {
                  const data: any = { year };
                  if (selectedView === 'Total') {
                    if (selectedMetric === 'variableCosts') {
                      data[selectedMetric] = getValue('seed', year) + getValue('fertiliser', year) + getValue('chemicals', year);
                    } else if (selectedMetric === 'operationsCosts') {
                      data[selectedMetric] = getValue('cultivating', year) + getValue('drilling', year) + getValue('applications', year) + getValue('harvesting', year) + getValue('other', year);
                    } else if (selectedMetric === 'totalCosts') {
                      data[selectedMetric] = getValue('seed', year) + getValue('fertiliser', year) + getValue('chemicals', year) + getValue('cultivating', year) + getValue('drilling', year) + getValue('applications', year) + getValue('harvesting', year) + getValue('other', year) + getBaseYearlyCost(year as Year);
                    }
                  } else {
                    data[selectedMetric] = getValue(selectedMetric as keyof MetricsData, year);
                  }
                  return data;
                })}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="year" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#404040"
                    name={getAvailableMetrics().find(m => m.value === selectedMetric)?.label || selectedMetric}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}