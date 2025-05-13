import React from 'react';

interface FuelPriceData {
  fuel_type: string;
  current_price: number;
  unit: string;
  price_trend: 'up' | 'down' | 'stable';
}

interface FuelPricesWidgetProps {
  fuelPrices: FuelPriceData[];
  onExploreClick: () => void;
}

const FuelPricesWidget: React.FC<FuelPricesWidgetProps> = ({ 
  fuelPrices, 
  onExploreClick 
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Fuel Prices</h2>
      <div className="space-y-4">
        {fuelPrices.map((fuel, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{fuel.fuel_type}</span>
              <div className="text-sm text-gray-600">Current Price</div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {fuel.current_price.toFixed(2)} {fuel.unit}
              </div>
              <div className={`text-sm ${getTrendColor(fuel.price_trend)}`}>
                {getTrendIcon(fuel.price_trend)} 
                {fuel.price_trend.charAt(0).toUpperCase() + fuel.price_trend.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={onExploreClick}
        className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Explore Marketplace
      </button>
    </div>
  );
};

export default FuelPricesWidget;