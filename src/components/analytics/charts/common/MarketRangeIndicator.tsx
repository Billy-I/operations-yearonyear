import React from 'react';
import { BenchmarkData } from '../types/chart-types';

interface MarketRangeIndicatorProps {
  data: BenchmarkData;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  formatValue?: (value: number) => string;
}

const MarketRangeIndicator: React.FC<MarketRangeIndicatorProps> = ({
  data,
  className = '',
  orientation = 'horizontal',
  showLabels = true,
  formatValue = (value: number) => `£${value.toFixed(2)}`
}) => {
  const { min, max, average, current } = data;
  
  // Calculate positions as percentages
  const range = max - min;
  const getPosition = (value: number) => ((value - min) / range) * 100;
  
  const currentPosition = getPosition(current);
  
  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-8">
        {/* Range bar */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-gray-200 rounded overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-blue-100"
            style={{ width: '100%' }}
          />
          <div 
            className="absolute inset-y-0 w-0.5 bg-blue-600"
            style={{ left: `${currentPosition}%`, transform: 'translateX(-50%)' }}
          />
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${current > average ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ left: `${currentPosition}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className="mt-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">{formatValue(min)}</span>
            <span className="text-blue-600">{formatValue(current)}</span>
            <span className="text-gray-500">{formatValue(max)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketRangeIndicator;