import React from 'react';
import { BenchmarkData } from '../types/chart-types';

interface MarketRangeIndicatorProps {
  data: BenchmarkData;
  width?: number;
  height?: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  formatValue?: (value: number) => string;
}

const MarketRangeIndicator: React.FC<MarketRangeIndicatorProps> = ({
  data,
  width = 120,
  height = 24,
  className = '',
  orientation = 'horizontal',
  showLabels = true,
  formatValue = (value: number) => `£${value.toFixed(2)}`
}) => {
  const { min, max, average, current } = data;
  
  // Calculate positions as percentages
  const range = max - min;
  const getPosition = (value: number) => ((value - min) / range) * 100;
  
  const averagePosition = getPosition(average);
  const currentPosition = getPosition(current);
  
  // Determine if we're rendering horizontally or vertically
  const isHorizontal = orientation === 'horizontal';
  const containerStyle = {
    width: isHorizontal ? width : height,
    height: isHorizontal ? height : width
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className="relative"
        style={containerStyle}
      >
        {/* Range bar background */}
        <div
          className={`absolute bg-gray-200 rounded ${
            isHorizontal ? 'h-2 left-0 right-0 top-1/2 -mt-1' : 'w-2 top-0 bottom-0 left-1/2 -ml-1'
          }`}
        />
        
        {/* Market range */}
        <div
          className={`absolute bg-blue-100 rounded ${
            isHorizontal ? 'h-2 top-1/2 -mt-1' : 'w-2 left-1/2 -ml-1'
          }`}
          style={
            isHorizontal
              ? { left: '0%', width: '100%' }
              : { top: '0%', height: '100%' }
          }
        />
        
        {/* Average marker */}
        <div
          className={`absolute ${
            isHorizontal ? 'h-4 w-0.5 top-1/2 -mt-2' : 'w-4 h-0.5 left-1/2 -ml-2'
          } bg-blue-600`}
          style={
            isHorizontal
              ? { left: `${averagePosition}%` }
              : { top: `${averagePosition}%` }
          }
        />
        
        {/* Current value marker */}
        <div
          className={`absolute ${
            isHorizontal ? 'w-3 h-3 top-1/2 -mt-1.5' : 'h-3 w-3 left-1/2 -ml-1.5'
          } bg-green-500 rounded-full border-2 border-white shadow-sm`}
          style={
            isHorizontal
              ? { left: `${currentPosition}%` }
              : { top: `${currentPosition}%` }
          }
        />
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className={`flex justify-between text-xs text-gray-500 mt-1 ${
          isHorizontal ? 'flex-row' : 'flex-col'
        }`}>
          <span>{formatValue(min)}</span>
          <span className="text-blue-600">{formatValue(average)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
};

export default MarketRangeIndicator;