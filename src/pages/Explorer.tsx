import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cropData } from '../data/cropData';
import { VIEW_MULTIPLIERS } from '../constants/analytics';

export default function Explorer() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedView, setSelectedView] = useState('Variable');
  const [totalCost, setTotalCost] = useState(1600000);
  const [margin, setMargin] = useState(300000);
  const [costPerHa, setCostPerHa] = useState(10000);
  const [marginPerHa, setMarginPerHa] = useState(1875);

  useEffect(() => {
    const multiplier = VIEW_MULTIPLIERS[selectedView as keyof typeof VIEW_MULTIPLIERS];
    const baseCost = 1600000;
    
    const newTotalCost = baseCost * multiplier;
    const newCostPerHa = newTotalCost / 160;
    
    const newMargin = 300000 * (2 - multiplier);
    const newMarginPerHa = newMargin / 160;

    setTotalCost(newTotalCost);
    setCostPerHa(newCostPerHa);
    setMargin(newMargin);
    setMarginPerHa(newMarginPerHa);
  }, [selectedView]);

  const getMarginLabel = () => selectedView === 'Total' ? 'Net Margin' : 'Gross Margin';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explorer</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="bg-gray-50 px-3 py-2 rounded-md">
              <Link
                to="/analytics/multi-year"
                className="text-gray-700 hover:text-gray-900"
              >
                Multi year
              </Link>
            </button>
          </div>
          <div>
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
                <option value="Operations">Operations</option>
                <option value="Total">Total</option>
              </select>
            </div>
          </div>
          <div>
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
          <h2 className="text-xl font-semibold mb-6">Farm Overview</h2>
          <div className="grid grid-cols-5 gap-8">
            <div>
              <div className="text-sm text-gray-600 mb-1">Hectares</div>
              <div className="text-2xl font-bold">160</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Cost (£)</div>
              <div className="text-2xl font-bold">£{totalCost.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{getMarginLabel()} (£)</div>
              <div className="text-2xl font-bold">£{margin.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Cost (£/ha)</div>
              <div className="text-2xl font-bold">£{costPerHa.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{getMarginLabel()} (£/ha)</div>
              <div className="text-2xl font-bold">£{marginPerHa.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Crop Performance</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <span>Crop</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <span>Area</span>
                      <ChevronDown size={16} />
                    </div>
                  </th>
                  {selectedView === 'Variable' && (
                    <th className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <span>Market Range</span>
                        <HelpCircle size={16} className="text-gray-400" />
                      </div>
                    </th>
                  )}
                  <th className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-1">
                      <span>CoP</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Cost</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Yield</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-1">
                      <span>{selectedView === 'Total' ? 'NM' : 'GM'}</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cropData.map((crop, index) => {
                  const multiplier = VIEW_MULTIPLIERS[selectedView as keyof typeof VIEW_MULTIPLIERS] || 1;
                  const adjustedCost = crop.cost.value * multiplier;
                  const adjustedMargin = crop.gm.value * (2 - multiplier);

                  return (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-4">
                        <Link 
                          to={`/analytics/explorer/${encodeURIComponent(crop.name)}`} 
                          className="text-gray-700 hover:text-gray-900"
                        >
                          {crop.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4">{crop.area}</td>
                      {selectedView === 'Variable' && (
                        <td className="px-4 py-4">
                          <div className="relative w-48 mx-auto">
                            <div className="h-1 bg-gray-200 rounded">
                              <div
                                className="absolute h-1 bg-gray-400 rounded"
                                style={{
                                  left: `${(crop.marketRange.min / crop.marketRange.max) * 100}%`,
                                  right: `${100 - ((crop.marketRange.current / crop.marketRange.max) * 100)}%`
                                }}
                              />
                            </div>
                            <div
                              className="absolute top-1/2 w-2 h-2 bg-gray-600 rounded-full transform -translate-y-1/2"
                              style={{
                                left: `${(crop.marketRange.current / crop.marketRange.max) * 100}%`,
                                marginLeft: '-4px'
                              }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>£{crop.marketRange.min.toFixed(2)}/t</span>
                              <span>£{crop.marketRange.max.toFixed(2)}/t</span>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-4 text-right">
                        <span className={crop.cop.hasWarning ? 'text-gray-700 font-medium' : ''}>
                          £{(crop.cop.value * multiplier).toFixed(2)}/t
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        £{adjustedCost.toFixed(2)}/ha
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={crop.yield.hasWarning ? 'text-gray-700 font-medium' : ''}>
                          {crop.yield.value.toFixed(2)} t/ha
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={crop.gm.isInfo ? 'text-gray-700 font-medium' : ''}>
                          £{adjustedMargin.toFixed(2)}/ha
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-500 text-center">
            © 2025 - YAGRO Ltd. | Terms and Conditions
          </div>
        </div>
      </div>
    </div>
  );
}