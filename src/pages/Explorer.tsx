import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cropData } from '../data/cropData';
import MarketRangeIndicator from '../components/analytics/charts/common/MarketRangeIndicator';

export default function Explorer() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [costFilters, setCostFilters] = useState({
    variable: true,
    operations: true
  });
  const [totalCost, setTotalCost] = useState(1600000);
  const [margin, setMargin] = useState(300000);
  const [costPerHa, setCostPerHa] = useState(10000);
  const [marginPerHa, setMarginPerHa] = useState(1875);

  useEffect(() => {
    const baseCost = 1600000;
    
    // Adjust costs based on filters
    let costMultiplier = 0;
    if (costFilters.variable) costMultiplier += 0.6; // Variable costs are 60% of total
    if (costFilters.operations) costMultiplier += 0.4; // Operation costs are 40% of total
    
    const newTotalCost = baseCost * costMultiplier;
    const newCostPerHa = newTotalCost / 160;
    
    // Adjust margins based on filters
    const baseMargin = 300000;
    let marginMultiplier = 0;
    
    if (costFilters.variable && costFilters.operations) {
      marginMultiplier = 1; // Net margin when both filters are active
    } else if (costFilters.variable) {
      marginMultiplier = 1.5; // Gross margin when only variable costs are active
    }
    
    const newMargin = baseMargin * marginMultiplier;
    const newMarginPerHa = newMargin / 160;

    setTotalCost(newTotalCost);
    setCostPerHa(newCostPerHa);
    setMargin(newMargin);
    setMarginPerHa(newMarginPerHa);
  }, [costFilters]);

  const getMarginLabel = () => {
    if (!costFilters.variable) return 'Margin';
    return costFilters.variable && costFilters.operations ? 'Net Margin' : 'Gross Margin';
  };

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

      {/* Cost Category Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Cost Categories:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCostFilters(prev => ({ ...prev, variable: !prev.variable }))}
              className={`px-3 py-1 rounded-full text-sm ${
                costFilters.variable
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Variable Costs
            </button>
            <button
              onClick={() => setCostFilters(prev => ({ ...prev, operations: !prev.operations }))}
              className={`px-3 py-1 rounded-full text-sm ${
                costFilters.operations
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Operation Costs
            </button>
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
              <div className="text-sm text-gray-600 mb-1">{getMarginLabel()} (£)</div>
              <div className="text-2xl font-bold">£{margin.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Cost (£)</div>
              <div className="text-2xl font-bold">£{totalCost.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
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

          <div className="overflow-hidden">
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
                  {costFilters.variable && !costFilters.operations && (
                    <th className="px-4 py-3 overflow-hidden">
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
                      <span>{!costFilters.variable ? 'Margin' : (costFilters.variable && costFilters.operations ? 'Net Margin' : 'GM')}</span>
                      <HelpCircle size={16} className="text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cropData.map((crop, index) => {
                  // Adjust costs based on filters
                  let costMultiplier = 0;
                  if (costFilters.variable) costMultiplier += 0.6; // Variable costs are 60% of total
                  if (costFilters.operations) costMultiplier += 0.4; // Operation costs are 40% of total
                  const adjustedCost = crop.cost.value * costMultiplier;

                  // Adjust margins based on filters
                  let marginMultiplier = 0;
                  if (costFilters.variable && costFilters.operations) {
                    marginMultiplier = 1; // Net margin when both filters are active
                  } else if (costFilters.variable) {
                    marginMultiplier = 1.5; // Gross margin when only variable costs are active
                  }
                  const adjustedMargin = crop.gm.value * marginMultiplier;

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
                      {costFilters.variable && !costFilters.operations && (
                        <td className="px-4 py-4 overflow-hidden">
                          <MarketRangeIndicator
                            data={{
                              min: crop.marketRange.min,
                              max: crop.marketRange.max,
                              average: (crop.marketRange.min + crop.marketRange.max) / 2,
                              current: crop.marketRange.current
                            }}
                            formatValue={(value) => `£${value.toFixed(2)}/t`}
                          />
                        </td>
                      )}
                      <td className="px-4 py-4 text-right">
                        <span className={crop.cop.hasWarning ? 'text-gray-700 font-medium' : ''}>
                          £{crop.cop.value.toFixed(2)}/t
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