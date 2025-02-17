// Explorer Crop Details page with Variable/Total view switching
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const variableCostData = [
  { year: '2018', marketMedian: 120, yourPerformance: 130 },
  { year: '2019', marketMedian: 125, yourPerformance: 128 },
  { year: '2020', marketMedian: 135, yourPerformance: 145 },
  { year: '2021', marketMedian: 130, yourPerformance: 132 },
  { year: '2022', marketMedian: 128, yourPerformance: 130 },
  { year: '2023', marketMedian: 140, yourPerformance: null }
];

const totalCostData = [
  { year: '2018', marketMedian: 288, yourPerformance: 312 },
  { year: '2019', marketMedian: 300, yourPerformance: 307 },
  { year: '2020', marketMedian: 324, yourPerformance: 348 },
  { year: '2021', marketMedian: 312, yourPerformance: 317 },
  { year: '2022', marketMedian: 307, yourPerformance: 312 },
  { year: '2023', marketMedian: 336, yourPerformance: null }
];

const grossMarginData = [
  { year: '2018', margin: 150 },
  { year: '2019', margin: 155 },
  { year: '2020', margin: 160 },
  { year: '2021', margin: 158 },
  { year: '2022', margin: 162 },
  { year: '2023', margin: 165 }
];

const netMarginData = [
  { year: '2018', margin: 85 },
  { year: '2019', margin: 88 },
  { year: '2020', margin: 92 },
  { year: '2021', margin: 90 },
  { year: '2022', margin: 93 },
  { year: '2023', margin: 95 }
];

export default function ExplorerCropDetails() {
  const { crop } = useParams();
  const [selectedView, setSelectedView] = useState('Variable');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('Variable cost £/ha');

  const variableData = {
    costPerHectare: '£976.27/ha',
    totalCost: '£65,528.93',
    costPerTonne: '£117.90/t',
    costRangeMin: '£3.56/t',
    costRangeMax: '£254.32/t',
    grossMargin: '£536.38/ha',
  };

  const totalData = {
    costPerHectare: '£2,342.64/ha',
    totalCost: '£157,265.46',
    costPerTonne: '£282.96/t',
    costRangeMin: '£8.54/t',
    costRangeMax: '£610.37/t',
    grossMargin: '£287.15/ha',
  };

  const variablePerformanceData = [
    {
      name: 'KWS Estate',
      area: '363.36 ha',
      costPerTonne: '£117.90/t',
      performance: 75,
      yield: '8.40 t/ha',
      costPerHa: '£976.27/ha',
      gm: '£536.38/ha'
    },
    {
      name: 'Mayflower',
      area: '109.47 ha',
      costPerTonne: '£122.38/t',
      performance: 66,
      yield: '8.16 t/ha',
      costPerHa: '£996.93/ha',
      gm: '£47,135/ha'
    },
    {
      name: 'Crusoe',
      area: '134.21 ha',
      costPerTonne: '£126.00/t',
      performance: 50,
      yield: '7.53 t/ha',
      costPerHa: '£949.32/ha',
      gm: '£858.84/ha'
    }
  ];

  const totalPerformanceData = [
    {
      name: 'KWS Estate',
      area: '363.36 ha',
      costPerTonne: '£282.96/t',
      performance: 75,
      yield: '8.40 t/ha',
      costPerHa: '£2,342.64/ha',
      gm: '£287.15/ha'
    },
    {
      name: 'Mayflower',
      area: '109.47 ha',
      costPerTonne: '£293.71/t',
      performance: 66,
      yield: '8.16 t/ha',
      costPerHa: '£2,392.63/ha',
      gm: '£25,272/ha'
    },
    {
      name: 'Crusoe',
      area: '134.21 ha',
      costPerTonne: '£302.40/t',
      performance: 50,
      yield: '7.53 t/ha',
      costPerHa: '£2,278.37/ha',
      gm: '£461.53/ha'
    }
  ];

  const currentData = selectedView === 'Variable' ? variableData : totalData;
  const currentPerformanceData = selectedView === 'Variable' ? variablePerformanceData : totalPerformanceData;

  return (
    <div className="p-6">
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
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="bg-transparent border-none focus:ring-0"
            >
              <option value="Variable">Variable</option>
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

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Yield</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-2">8.40 t/ha</div>
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
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{currentData.costPerHectare}</div>
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
          <div className="text-2xl font-bold">607.04 ha (100%)</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Cost per tonne</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-2">{currentData.costPerTonne}</div>
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
              <span>{currentData.costRangeMin}</span>
              <span>{currentData.costRangeMax}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total cost</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{currentData.totalCost}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Production</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">5,099.14t</div>
          <div className="text-sm text-gray-500">Sales: £1,012.37 t</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Gross margin</span>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{currentData.grossMargin}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-48"
              >
                <option value="Variable cost £/ha">Variable cost £/ha</option>
                <option value="Cost of production £/t">Cost of production £/t</option>
                <option value="Production (Tonnes)">Production (Tonnes)</option>
                <option value="Yield">Yield</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedView === 'Variable' ? variableCostData : totalCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marketMedian" name="Market median" fill="#666666" />
                  <Bar dataKey="yourPerformance" name="Your Crop performance" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              {selectedView === 'Variable' ? 'Gross Margin Analysis' : 'Net Margin Analysis'}
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedView === 'Variable' ? grossMarginData : netMarginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="margin" stroke="#000000" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Performance by</h2>
          <div className="flex items-center space-x-2 mb-4">
            <select className="border-gray-300 rounded-md">
              <option>Variety</option>
              <option>Field</option>
              <option>Region</option>
            </select>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 font-medium text-gray-600">Variety</th>
                  <th className="text-left py-3 font-medium text-gray-600">Area</th>
                  <th className="text-left py-3 font-medium text-gray-600">Cost(£/t)</th>
                  <th className="text-center py-3 font-medium text-gray-600">Performance</th>
                  <th className="text-right py-3 font-medium text-gray-600">Yield</th>
                  <th className="text-right py-3 font-medium text-gray-600">Cost(£/ha)</th>
                  <th className="text-right py-3 font-medium text-gray-600">
                    {selectedView === 'Variable' ? 'GM' : 'Net margin'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPerformanceData.map((item) => (
                  <tr key={item.name} className="border-b border-gray-100">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.area}</td>
                    <td className="py-3">{item.costPerTonne}</td>
                    <td className="text-center py-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full mx-auto relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gray-600 rounded-full"
                          style={{ width: `${item.performance}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="text-right py-3">{item.yield}</td>
                    <td className="text-right py-3">{item.costPerHa}</td>
                    <td className="text-right py-3">{item.gm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Category</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 font-medium text-gray-600">Category</th>
                    <th className="text-center py-3 font-medium text-gray-600">Market Range</th>
                    <th className="text-right py-3 font-medium text-gray-600">Cost(£/t)</th>
                    <th className="text-right py-3 font-medium text-gray-600">Cost(£/ha)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Seed</td>
                    <td className="py-3 px-4">
                      <div className="w-48 h-2 bg-gray-100 rounded-full relative overflow-hidden mx-auto">
                        <div className="absolute top-0 left-[30%] right-[40%] h-full bg-gray-600 rounded-full"></div>
                      </div>
                    </td>
                    <td className="text-right py-3">£12.05/t</td>
                    <td className="text-right py-3">£97.49/ha</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Fertiliser</td>
                    <td className="py-3 px-4">
                      <div className="w-48 h-2 bg-gray-100 rounded-full relative overflow-hidden mx-auto">
                        <div className="absolute top-0 left-[25%] right-[35%] h-full bg-gray-600 rounded-full"></div>
                      </div>
                    </td>
                    <td className="text-right py-3">£64.19/t</td>
                    <td className="text-right py-3">£519.46/ha</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Chemicals</td>
                    <td className="py-3 px-4">
                      <div className="w-48 h-2 bg-gray-100 rounded-full relative overflow-hidden mx-auto">
                        <div className="absolute top-0 left-[35%] right-[30%] h-full bg-gray-600 rounded-full"></div>
                      </div>
                    </td>
                    <td className="text-right py-3">£44.13/t</td>
                    <td className="text-right py-3">£357.11/ha</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Operations</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 font-medium text-gray-600">Operations</th>
                    <th className="text-right py-3 font-medium text-gray-600">Cost (£/ha)</th>
                    <th className="text-right py-3 font-medium text-gray-600">Total (£)</th>
                    <th className="text-right py-3 font-medium text-gray-600">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Cultivations</td>
                    <td className="text-right py-3">£1,099.02/ha</td>
                    <td className="text-right py-3">£32,970.60</td>
                    <td className="text-right py-3">20%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Drilling</td>
                    <td className="text-right py-3">£896.10/ha</td>
                    <td className="text-right py-3">£26,883.00</td>
                    <td className="text-right py-3">30%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Applications</td>
                    <td className="text-right py-3">£217.14/ha</td>
                    <td className="text-right py-3">£6,514.20</td>
                    <td className="text-right py-3">10%</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Harvesting</td>
                    <td className="text-right py-3">£1,153.13/ha</td>
                    <td className="text-right py-3">£34,593.90</td>
                    <td className="text-right py-3">40%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              ⚠️ Operation costs are using derived data and not completely verified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}