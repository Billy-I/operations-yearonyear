import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CommodityDetails, CommodityPricePoint } from '../../data/dashboardMockData'; // Assuming interfaces are exported

interface CommoditiesWidgetProps {
  allCommoditiesData: { [key: string]: CommodityDetails };
  onViewInMarketplaceClick: (commodityKey: string) => void;
}

type TimeRangeKey = 'last30days' | 'last90days' | 'last1year';

const timeRangeOptions: { key: TimeRangeKey; label: string }[] = [
  { key: 'last30days', label: 'Last 30 Days' },
  { key: 'last90days', label: 'Last 90 Days' },
  { key: 'last1year', label: 'Last 1 Year' },
];

const CommoditiesWidget: React.FC<CommoditiesWidgetProps> = ({ allCommoditiesData, onViewInMarketplaceClick }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeKey>('last30days');
  const [selectedCommodityKey, setSelectedCommodityKey] = useState<string>(Object.keys(allCommoditiesData)[0]);
  
  const currentCommodityData = allCommoditiesData[selectedCommodityKey];

  const chartData = useMemo(() => {
    return currentCommodityData.priceHistory[selectedTimeRange].map(p => ({
      date: new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      price: p.price,
    }));
  }, [currentCommodityData, selectedTimeRange]);

  const formatYAxisTick = (tick: number) => `${currentCommodityData.unit}${tick.toFixed(2)}`;

  const renderPriceStat = (label: string, value: number, unit: string) => (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{unit}{value.toFixed(2)}</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Commodities - Inputs</h3>
          <div className="flex gap-2 mt-2">
            {Object.entries(allCommoditiesData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedCommodityKey(key)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCommodityKey === key
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {data.name}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as TimeRangeKey)}
            className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:bg-white focus:border-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="flex-grow mb-4" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis tickFormatter={formatYAxisTick} tick={{ fontSize: 10, fill: '#6b7280' }} domain={['dataMin - 0.02', 'dataMax + 0.02']} />
            <Tooltip
              formatter={(value: number) => [`${currentCommodityData.unit}${value.toFixed(2)}`, 'Price']}
              labelStyle={{ fontSize: 12, color: '#374151' }}
              itemStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name={currentCommodityData.name} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 border-t border-gray-200 pt-4">
        {renderPriceStat("Current", currentCommodityData.currentPrice, currentCommodityData.unit)}
        {renderPriceStat("1 Yr High", currentCommodityData.oneYearHigh, currentCommodityData.unit)}
        {renderPriceStat("1 Yr Low", currentCommodityData.oneYearLow, currentCommodityData.unit)}
      </div>

      <button
        onClick={() => onViewInMarketplaceClick(selectedCommodityKey)}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        View in Marketplace
      </button>
    </div>
  );
};

export default CommoditiesWidget;