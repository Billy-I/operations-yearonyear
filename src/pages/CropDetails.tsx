import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VarietyData {
  name: string;
  area: string;
  costPerTonne: {
    variable: string;
    operations: string;
    total: string;
  };
  yield: string;
  costPerHa: {
    variable: string;
    operations: string;
    total: string;
  };
  gm: string;
}

interface CategoryData {
  name: string;
  marketRange: {
    min: number;
    max: number;
    current: number;
  };
  costPerTonne: {
    variable: string;
    operations: string;
    total: string;
  };
  costPerHa: {
    variable: string;
    operations: string;
    total: string;
  };
}

interface OperationData {
  name: string;
  costPerHa: string;
  total: string;
  allocation: string;
}

type MetricType =
  | 'Variable cost £/ha'
  | 'Operations cost £/ha'
  | 'Total cost £/ha'
  | 'Cost of production £/t'
  | 'Production (Tonnes)'
  | 'Gross margin'
  | 'Net margin'
  | 'Yield';
type ViewType = 'Variable' | 'Operations' | 'Total';

const getYearlyDataForView = (view: ViewType) => {
  const baseData = [
    { year: '2018', marketMedian: 125, cropPerformance: 130 },
    { year: '2019', marketMedian: 125, cropPerformance: 145 },
    { year: '2020', marketMedian: 150, cropPerformance: 195 },
    { year: '2021', marketMedian: 120, cropPerformance: 135 },
    { year: '2022', marketMedian: 125, cropPerformance: 130 },
    { year: '2023', marketMedian: 135, cropPerformance: 0 },
    { year: 'Year avg', marketMedian: 150, cropPerformance: 0 }
  ];

  const multipliers = {
    Variable: { cost: 1, performance: 1 },
    Operations: { cost: 1.3, performance: 1.4 },
    Total: { cost: 2.3, performance: 2.5 }
  };

  const viewMultipliers = multipliers[view];
  
  return baseData.map(item => ({
    year: item.year,
    marketMedian: Math.round(item.marketMedian * viewMultipliers.cost),
    cropPerformance: item.cropPerformance ? Math.round(item.cropPerformance * viewMultipliers.performance) : 0
  }));
};

const getYearlyDataForMetric = (view: ViewType, metric: MetricType) => {
  const baseData = [
    { year: '2018', marketMedian: 125, cropPerformance: 130 },
    { year: '2019', marketMedian: 125, cropPerformance: 145 },
    { year: '2020', marketMedian: 150, cropPerformance: 195 },
    { year: '2021', marketMedian: 120, cropPerformance: 135 },
    { year: '2022', marketMedian: 125, cropPerformance: 130 },
    { year: '2023', marketMedian: 135, cropPerformance: 0 },
    { year: 'Year avg', marketMedian: 150, cropPerformance: 0 }
  ];

  const costMultiplier = view === 'Variable' ? 1 : view === 'Operations' ? 1.3 : 2.3;
  const perfMultiplier = view === 'Variable' ? 1 : view === 'Operations' ? 1.4 : 2.5;

  const multipliers = {
    'Variable cost £/ha': {
      cost: costMultiplier,
      performance: perfMultiplier
    },
    'Operations cost £/ha': {
      cost: costMultiplier,
      performance: perfMultiplier
    },
    'Total cost £/ha': {
      cost: costMultiplier,
      performance: perfMultiplier
    },
    'Cost of production £/t': {
      cost: costMultiplier * 0.8,
      performance: perfMultiplier * 0.9
    },
    'Production (Tonnes)': {
      cost: 5,
      performance: 5.5
    },
    'Gross margin': {
      cost: costMultiplier * 1.5,
      performance: perfMultiplier * 1.7
    },
    'Net margin': {
      cost: costMultiplier * 1.5,
      performance: perfMultiplier * 1.7
    },
    'Yield': {
      cost: 0.7,
      performance: 0.8
    }
  };

  const viewMultipliers = multipliers[metric];
  
  return baseData.map(item => ({
    year: item.year,
    marketMedian: view === 'Variable' ? Math.round(item.marketMedian * viewMultipliers.cost) : 0,
    cropPerformance: item.cropPerformance ? Math.round(item.cropPerformance * viewMultipliers.performance) : 0
  }));
};

const varietyData: VarietyData[] = [
  {
    name: "KWS Extase",
    area: "363.36 ha",
    costPerTonne: {
      variable: "£117.90/t",
      operations: "£145.50/t",
      total: "£263.40/t"
    },
    yield: "8.40 t/ha",
    costPerHa: {
      variable: "£976.27/ha",
      operations: "£1,221.20/ha",
      total: "£2,197.47/ha"
    },
    gm: "£536.38/ha"
  },
  {
    name: "Mayflower",
    area: "109.47 ha",
    costPerTonne: {
      variable: "£122.38/t",
      operations: "£156.80/t",
      total: "£279.18/t"
    },
    yield: "8.16 t/ha",
    costPerHa: {
      variable: "£996.93/ha",
      operations: "£1,279.49/ha",
      total: "£2,276.42/ha"
    },
    gm: "£47,135/ha"
  },
  {
    name: "Crusoe",
    area: "134.21 ha",
    costPerTonne: {
      variable: "£126.00/t",
      operations: "£168.30/t",
      total: "£294.30/t"
    },
    yield: "7.53 t/ha",
    costPerHa: {
      variable: "£949.32/ha",
      operations: "£1,267.30/ha",
      total: "£2,216.62/ha"
    },
    gm: "£858.84/ha"
  }
];

const categoryData: CategoryData[] = [
  {
    name: "Seed",
    marketRange: { min: 2, max: 39, current: 12 },
    costPerTonne: {
      variable: "£12.05/t",
      operations: "£15.20/t",
      total: "£27.25/t"
    },
    costPerHa: {
      variable: "£97.49/ha",
      operations: "£122.90/ha",
      total: "£220.39/ha"
    }
  },
  {
    name: "Fertiliser",
    marketRange: { min: 8, max: 77, current: 45 },
    costPerTonne: {
      variable: "£64.19/t",
      operations: "£78.50/t",
      total: "£142.69/t"
    },
    costPerHa: {
      variable: "£519.46/ha",
      operations: "£635.30/ha",
      total: "£1,154.76/ha"
    }
  },
  {
    name: "Chemicals",
    marketRange: { min: 6, max: 75, current: 55 },
    costPerTonne: {
      variable: "£44.13/t",
      operations: "£58.90/t",
      total: "£103.03/t"
    },
    costPerHa: {
      variable: "£357.11/ha",
      operations: "£476.80/ha",
      total: "£833.91/ha"
    }
  }
];

const operationsData: OperationData[] = [
  {
    name: "Cultivations",
    costPerHa: "£1,099.02/ha",
    total: "£32,970.60",
    allocation: "20%"
  },
  {
    name: "Drilling",
    costPerHa: "£896.10/ha",
    total: "£26,883.00",
    allocation: "30%"
  },
  {
    name: "Applications",
    costPerHa: "£217.14/ha",
    total: "£6,514.20",
    allocation: "10%"
  },
  {
    name: "Harvesting",
    costPerHa: "£1,153.13/ha",
    total: "£34,593.90",
    allocation: "40%"
  }
];

export default function CropDetails() {
  const { crop } = useParams();
  const [selectedView, setSelectedView] = useState<ViewType>('Variable');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('Variable cost £/ha');

  const getCostValue = (data: any, type: 'costPerTonne' | 'costPerHa') => {
    if (!data[type]) return '£0.00';
    return data[type][selectedView.toLowerCase()] || '£0.00';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/analytics/explorer" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="text-sm text-gray-600">Explorer / {crop}</div>
            <h1 className="text-2xl font-bold">Explorer</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-100 rounded-md text-gray-700">
            <Link
              to="/analytics/multi-year"
              className="text-gray-700 hover:text-gray-900"
            >
              Multi year
            </Link>
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-md text-gray-700">
            View programmes
          </button>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <select 
                value={selectedView}
                onChange={(e) => {
                  const newView = e.target.value as ViewType;
                  setSelectedView(newView);
                  // Update metric if it's currently showing a cost view
                  if (selectedMetric.includes('cost £/ha')) {
                    const newMetric = `${newView === 'Variable' ? 'Variable' : newView === 'Operations' ? 'Operations' : 'Total'} cost £/ha` as MetricType;
                    setSelectedMetric(newMetric);
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
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none focus:ring-0"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Crop Performance - {crop}</h2>
          
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Yield</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                {crop === "Wheat (Winter)" && selectedView !== "Variable" ? (
                  <div className="font-bold">Not available</div>
                ) : (
                  <>
                    <div className="font-bold mb-2">8.40 t/ha</div>
                    <div className="relative w-full h-1 bg-gray-200 rounded">
                      <div className="absolute h-full bg-gray-400 rounded" style={{ width: '60%' }} />
                      <div className="absolute w-2 h-2 bg-black rounded-full top-1/2 transform -translate-y-1/2" style={{ left: '60%' }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>4.77t/ha</span>
                      <span>11.15t/ha</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cost per hectare</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">{getCostValue(varietyData[0], 'costPerHa')}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600"># Fields</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">3</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Harvested area</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">607.04 ha (100%)</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cost per tonne</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                {crop === "Wheat (Winter)" && selectedView !== "Variable" ? (
                  <div className="font-bold">Not available</div>
                ) : (
                  <>
                    <div className="font-bold mb-2">{getCostValue(varietyData[0], 'costPerTonne')}</div>
                    <div className="relative w-full h-1 bg-gray-200 rounded">
                      <div className="absolute h-full bg-gray-400 rounded" style={{ width: '40%' }} />
                      <div className="absolute w-2 h-2 bg-black rounded-full top-1/2 transform -translate-y-1/2" style={{ left: '40%' }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>£3.08/t</span>
                      <span>£254.32/t</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total cost</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">£{selectedView === 'Total' ? '100,961.70' : selectedView === 'Operations' ? '45,432.77' : '55,528.93'}</div>
              </div>
            </div>

            <div className="col-span-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Production</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">5,099.14t</div>
                <div className="text-sm text-gray-500">Sales: £{selectedView === 'Total' ? '285.50' : selectedView === 'Operations' ? '165.30' : '120.20'} /t</div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{selectedView === 'Total' ? 'Net margin' : 'Gross margin'}</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">£536.38/ha</div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Sales</span>
                <HelpCircle size={16} className="text-gray-400" />
              </div>
              <div className="p-4 bg-gray-50 rounded-lg h-[120px]">
                <div className="font-bold">£1,455.80/t</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Cost Over Time</h3>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                    className="bg-transparent border-none focus:ring-0"
                  >
                    <option value="Variable cost £/ha">
                      {selectedView === 'Variable' ? 'Variable' : selectedView === 'Operations' ? 'Operations' : 'Total'} cost £/ha
                    </option>
                    <option value="Cost of production £/t">Cost of production £/t</option>
                    <option value="Production (Tonnes)">Production (Tonnes)</option>
                    <option value="Yield">Yield</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg h-[300px]">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-sm mr-2"></div>
                  <span className="text-sm">Market median</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-sm ml-4 mr-2"></div>
                  <span className="text-sm">Your Crop performance</span>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getYearlyDataForMetric(selectedView, selectedMetric)} margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" angle={-45} textAnchor="end" height={60} />
                      <YAxis
                        label={{
                          value: selectedMetric,
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                        domain={[0, 400]}
                      />
                      <Tooltip formatter={(value) => {
                        if (selectedMetric === 'Production (Tonnes)') return `${value}t`;
                        return selectedMetric.includes('£') ? `£${value}` : `${value}`;
                      }} />
                      <Bar dataKey="marketMedian" name="Market median" fill="#374151" />
                      <Bar dataKey="cropPerformance" name="Your Crop performance" fill="#9CA3AF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{selectedView === 'Total' ? 'Net Margin Analysis' : 'Gross Margin Analysis'}</h3>
              <div className="bg-gray-50 p-4 rounded-lg h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getYearlyDataForView(selectedView)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" angle={-45} textAnchor="end" height={60} />
                    <YAxis
                      label={{
                        value: selectedView === 'Total' ? 'Net Margin (£/ha)' : 'Gross Margin (£/ha)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                      domain={[0, 400]}
                    />
                    <Tooltip formatter={(value) => `£${value}/ha`} />
                    <Line
                      type="monotone"
                      dataKey="marketMedian"
                      name="Market median"
                      stroke="#374151"
                      strokeWidth={2}
                      dot={{ fill: '#374151' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Performance by</h3>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                <select className="bg-transparent border-none focus:ring-0" defaultValue="Variety">
                  <option value="Field">Field</option>
                  <option value="Variety">Variety</option>
                  <option value="End use market">End use market</option>
                  <option value="End use group">End use group</option>
                  <option value="1st wheat">1st wheat</option>
                  <option value="2nd wheat">2nd wheat</option>
                </select>
              </div>
            </div>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Variety</th>
                    <th className="px-4 py-2 text-left">Area</th>
                    <th className="px-4 py-2 text-left">Cost(£/t)</th>
                    <th className="px-4 py-2 text-center">Performance</th>
                    <th className="px-4 py-2 text-right">Yield</th>
                    <th className="px-4 py-2 text-right">Cost(£/ha)</th>
                    <th className="px-4 py-2 text-right">GM</th>
                  </tr>
                </thead>
                <tbody>
                  {varietyData.map((variety) => (
                    <tr key={variety.name} className="border-t">
                      <td className="px-4 py-2">{variety.name}</td>
                      <td className="px-4 py-2">{variety.area}</td>
                      <td className="px-4 py-2">{getCostValue(variety, 'costPerTonne')}</td>
                      <td className="px-4 py-2">
                        <div className="w-24 h-2 bg-gray-200 rounded mx-auto">
                          <div className="h-full bg-gray-600 rounded" style={{ width: '60%' }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">{variety.yield}</td>
                      <td className="px-4 py-2 text-right">{getCostValue(variety, 'costPerHa')}</td>
                      <td className="px-4 py-2 text-right">{variety.gm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2">Market Range</th>
                    <th className="px-4 py-2 text-right">Cost(£/t)</th>
                    <th className="px-4 py-2 text-right">Cost(£/ha)</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((category) => (
                    <tr key={category.name} className="border-t">
                      <td className="px-4 py-2">{category.name}</td>
                      <td className="px-4 py-2">
                        <div className="relative w-48 mx-auto">
                          <div className="h-1 bg-gray-200 rounded">
                            <div 
                              className="absolute h-1 bg-gray-400 rounded"
                              style={{
                                left: `${(category.marketRange.min / category.marketRange.max) * 100}%`,
                                right: `${100 - ((category.marketRange.current / category.marketRange.max) * 100)}%`
                              }}
                            />
                          </div>
                          <div 
                            className="absolute top-1/2 w-2 h-2 bg-black rounded-full transform -translate-y-1/2"
                            style={{
                              left: `${(category.marketRange.current / category.marketRange.max) * 100}%`,
                              marginLeft: '-4px'
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">{getCostValue(category, 'costPerTonne')}</td>
                      <td className="px-4 py-2 text-right">{getCostValue(category, 'costPerHa')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Operations</h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Operations</th>
                    <th className="px-4 py-2 text-right">Cost (£/ha)</th>
                    <th className="px-4 py-2 text-right">Total (£)</th>
                    <th className="px-4 py-2 text-right">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {operationsData.map((operation) => (
                    <tr key={operation.name} className="border-t">
                      <td className="px-4 py-2">{operation.name}</td>
                      <td className="px-4 py-2 text-right">{operation.costPerHa}</td>
                      <td className="px-4 py-2 text-right">{operation.total}</td>
                      <td className="px-4 py-2 text-right">{operation.allocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-start text-sm text-gray-600">
              <div className="flex-shrink-0 mt-1">⚠️</div>
              <p className="ml-2">
                Operation costs are using derived data and not completely verified.<br />
                To refine your inputs please, edit operations here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
