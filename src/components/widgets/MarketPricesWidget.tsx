import React from 'react';
import { TrendingUp, TrendingDown, Minus, Fuel, Sprout, FlaskConical, Wheat } from 'lucide-react';

export interface MarketItem {
  id: string;
  name: string;
  category: 'fuel' | 'fertilizer' | 'seeds' | 'chemicals';
  currentPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  icon?: string;
}

interface MarketPricesWidgetProps {
  marketData: MarketItem[];
  onViewMarketplaceClick?: () => void;
}

const MarketPricesWidget: React.FC<MarketPricesWidgetProps> = ({ 
  marketData, 
  onViewMarketplaceClick 
}) => {
  const getCategoryIcon = (category: MarketItem['category']) => {
    switch (category) {
      case 'fuel':
        return <Fuel className="w-4 h-4" />;
      case 'fertilizer':
        return <FlaskConical className="w-4 h-4" />;
      case 'seeds':
        return <Sprout className="w-4 h-4" />;
      case 'chemicals':
        return <Wheat className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: MarketItem['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: MarketItem['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getCategoryColor = (category: MarketItem['category']) => {
    switch (category) {
      case 'fuel':
        return 'bg-orange-100 text-orange-700';
      case 'fertilizer':
        return 'bg-green-100 text-green-700';
      case 'seeds':
        return 'bg-amber-100 text-amber-700';
      case 'chemicals':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-96">
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Market Prices</h2>
          <div className="text-sm text-gray-500">Live updates</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {marketData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    £{item.currentPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">/{item.unit}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(item.trend)}`}>
                  {getTrendIcon(item.trend)}
                  <span>
                    {item.trend === 'stable' ? 'Stable' : `${Math.abs(item.changePercent)}%`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onViewMarketplaceClick && (
        <div className="p-4 border-t border-gray-100 flex-shrink-0 text-center">
          <button
            onClick={onViewMarketplaceClick}
            className="text-yagro-brand hover:text-yagro-brand-dark text-sm font-medium transition-colors"
          >
            View Marketplace →
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketPricesWidget;