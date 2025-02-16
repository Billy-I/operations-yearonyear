import { useState } from 'react';

const CropProgress = () => {
  const [view, setView] = useState<'Table' | 'Grid'>('Table');
  const [year, setYear] = useState('2024');

  const crops = [
    {
      name: 'Wheat (Winter)',
      area: 641.16,
      yield: { value: 8.30, change: -5 },
      costToDate: { value: 769.43, change: 7 },
      soldPercentage: 45,
      avgPrice: 219.17
    },
    {
      name: 'Field Bean (Spring)',
      area: 234.53,
      yield: { value: 5.55, change: 10 },
      costToDate: { value: 346.63, change: 10 },
      soldPercentage: 0,
      avgPrice: 220.00
    },
    {
      name: 'Barley (Winter)',
      area: 195.78,
      yield: { value: 10.11, change: 9 },
      costToDate: { value: 630.34, change: -2 },
      soldPercentage: 0,
      avgPrice: 160.00
    },
    {
      name: 'Linseed',
      area: 157.68,
      yield: { value: 1.99, change: -14 },
      costToDate: { value: 478.46, change: 39 },
      soldPercentage: 0,
      avgPrice: 413.32
    },
    {
      name: 'Oats (Spring)',
      area: 122.79,
      yield: { value: 7.14, change: 10 },
      costToDate: { value: 380.49, change: 28 },
      soldPercentage: 0,
      avgPrice: 200.00
    },
    {
      name: 'Mustard',
      area: 88.98,
      yield: { value: 0.88, change: 0 },
      costToDate: { value: 296.03, change: 0 },
      soldPercentage: 0,
      avgPrice: 1199.97
    },
    {
      name: 'Maize (Forage)',
      area: 3.00,
      yield: { value: 35.00, change: 0 },
      costToDate: { value: 151.56, change: -81 },
      soldPercentage: 0,
      avgPrice: 0
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Tracker</h1>
          <span className="text-gray-400">/</span>
          <span className="text-2xl text-gray-600">Crop Progress</span>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 bg-white"
          >
            <option value="2024">2024</option>
          </select>
          <div className="flex gap-2 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setView('Table')}
              className={`px-4 py-2 rounded ${view === 'Table' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
            >
              Table
            </button>
            <button
              onClick={() => setView('Grid')}
              className={`px-4 py-2 rounded ${view === 'Grid' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Crop Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Area
                <span className="text-gray-400 text-sm ml-1">ha</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Yield
                <span className="text-gray-400 text-sm ml-1">t/ha</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Cost to Date
                <span className="text-gray-400 text-sm ml-1">/ha</span>
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">% Sold</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">
                Your Avg Price
                <span className="text-gray-400 text-sm ml-1">/t</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop, index) => (
              <tr key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-200">
                <td className="p-4 text-gray-900">{crop.name}</td>
                <td className="p-4 text-gray-600">{crop.area.toFixed(2)}</td>
                <td className="p-4">
                  <span className="text-gray-600">{crop.yield.value.toFixed(2)}</span>
                  {crop.yield.change !== 0 && (
                    <span className="ml-2 text-gray-400">
                      {crop.yield.change > 0 ? '+' : ''}{crop.yield.change}%
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className="text-gray-600">£{crop.costToDate.value.toFixed(2)}</span>
                  {crop.costToDate.change !== 0 && (
                    <span className="ml-2 text-gray-400">
                      {crop.costToDate.change > 0 ? '+' : ''}{crop.costToDate.change}%
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="w-32 bg-gray-100 rounded-lg h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-lg" 
                      style={{ width: `${crop.soldPercentage}%` }}
                    />
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {crop.avgPrice > 0 ? `£${crop.avgPrice.toFixed(2)}` : 'No sales data'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CropProgress;