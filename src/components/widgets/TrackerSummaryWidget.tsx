import React from 'react';
import { DashboardCropData } from '../../data/dashboardMockData';
import { TrendingUp, AlertCircle } from 'lucide-react'; // Removed unused icons

interface TrackerSummaryWidgetProps {
  crops: DashboardCropData[];
  onViewTrackerClick: () => void;
}

const TrackerSummaryWidget: React.FC<TrackerSummaryWidgetProps> = ({
  crops,
  onViewTrackerClick
}) => {
  if (!crops || crops.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tracker Highlights</h2>
        <p className="text-gray-500">No crop data available to display.</p>
        <button 
          onClick={onViewTrackerClick}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go to Tracker
        </button>
      </div>
    );
  }

  // Calculate overall totals
  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const totalCostToDate = crops.reduce((sum, crop) => sum + (crop.costToDate_value * crop.area), 0);
  
  // Weighted average sales progress (by area)
  const weightedAvgSalesProgress = totalArea > 0 ? (crops.reduce((sum, crop) => sum + (crop.soldPercentage * crop.area), 0) / totalArea) : 0;
  
  // Simple average sales progress (per crop)
  const simpleAvgSalesProgress = crops.length > 0 ? (crops.reduce((sum, crop) => sum + crop.soldPercentage, 0) / crops.length) : 0;

  // Identify notable crops
  const sortedByYieldChange = [...crops].sort((a, b) => b.yield_change - a.yield_change);
  const topPerformers = sortedByYieldChange.slice(0, 2).filter(c => c.yield_change > 0);
  
  const cropsNeedingAttention = [...crops].sort((a, b) => {
    if (a.yield_change < 0 && b.yield_change >= 0) return -1;
    if (b.yield_change < 0 && a.yield_change >= 0) return 1;
    if (a.yield_change < 0 && b.yield_change < 0) return a.yield_change - b.yield_change;
    return b.costToDate_change - a.costToDate_change;
  }).slice(0, 2).filter(c => c.yield_change < 0 || c.costToDate_change > 20);

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Tracker Highlights</h2>

      {/* Overall Totals Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <div>
          <div className="text-sm text-gray-500 mb-1">Total Area</div>
          <div className="text-2xl font-bold text-gray-700">{totalArea.toFixed(1)} <span className="text-sm">ha</span></div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Total Cost</div>
          <div className="text-2xl font-bold text-gray-700">£{(totalCostToDate / 1000).toFixed(1)}k</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Simple Avg. Sold %</div> {/* Changed Label */}
          <div className="text-2xl font-bold text-gray-700">{simpleAvgSalesProgress.toFixed(0)}%</div> {/* Display Simple Average */}
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Weighted Avg. Sold %</div> {/* Changed Label */}
          <div className="text-2xl font-bold text-blue-600">{weightedAvgSalesProgress.toFixed(0)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 rounded-full h-2" 
              style={{ width: `${weightedAvgSalesProgress.toFixed(0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Notable Crops Section */}
      {(topPerformers.length > 0 || cropsNeedingAttention.length > 0) && (
        <div className="mb-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-semibold mb-4 text-gray-700">Notable Crops</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topPerformers.map(crop => (
              <div key={`top-${crop.name}`} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">{crop.name}</span>
                  <TrendingUp className="text-green-600" size={18} />
                </div>
                <p className="text-xs text-green-700 mt-1">Yield: <span className="font-semibold">{formatPercentage(crop.yield_change)}</span></p>
              </div>
            ))}
            {cropsNeedingAttention.map(crop => (
              <div key={`attn-${crop.name}`} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-amber-800">{crop.name}</span>
                  <AlertCircle className="text-amber-600" size={18} />
                </div>
                {crop.yield_change < 0 && (
                  <p className="text-xs text-amber-700 mt-1">Yield: <span className="font-semibold">{formatPercentage(crop.yield_change)}</span></p>
                )}
                {crop.costToDate_change > 20 && crop.yield_change >=0 && (
                  <p className="text-xs text-amber-700 mt-1">Cost: <span className="font-semibold">{formatPercentage(crop.costToDate_change)}</span></p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={onViewTrackerClick}
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Go to Tracker
      </button>
    </div>
  );
};

export default TrackerSummaryWidget;