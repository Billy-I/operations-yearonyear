import React from 'react';
import { DashboardCropData } from '../../data/dashboardMockData'; // Assuming types are here
import GaugeChart from '../common/GaugeChart'; // Reusing the gauge for progress

interface CropProfitabilitySnapshotProps {
  crops: DashboardCropData[];
}

const CropProfitabilitySnapshot: React.FC<CropProfitabilitySnapshotProps> = ({ crops }) => {
  if (!crops || crops.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Crop Profitability Snapshot</h2>
        <p className="text-gray-500">No crop data available for profitability analysis.</p>
      </div>
    );
  }

  const calculateProfitability = (crop: DashboardCropData) => {
    const budgetedCost = crop.cost; // This is the break-even target in terms of revenue needed
    const revenueAchieved = crop.revenue * (crop.soldPercentage / 100);
    
    let progressToBreakEven = 0;
    if (budgetedCost > 0) {
      progressToBreakEven = (revenueAchieved / budgetedCost) * 100;
    } else if (revenueAchieved > 0) {
      progressToBreakEven = 100; // Costs are zero, any revenue is profit
    }

    const remainingToBreakEven = Math.max(0, budgetedCost - revenueAchieved);
    const isProfitable = revenueAchieved >= budgetedCost;
    const surplusOrDeficit = revenueAchieved - budgetedCost;

    return {
      ...crop,
      budgetedCost,
      revenueAchieved,
      progressToBreakEven: Math.min(progressToBreakEven, 100), // Cap at 100% for gauge
      actualProgressToBreakEven: progressToBreakEven, // For text display, can exceed 100%
      remainingToBreakEven,
      isProfitable,
      surplusOrDeficit,
    };
  };

  const profitableCrops = crops.map(calculateProfitability);

  // Define a max height for the card, e.g., matching typical podcast widget height
  // This can be adjusted. Let's use Tailwind's h-96 (24rem = 384px) or h-[400px] / h-[500px]
  // For now, let's try a specific pixel value that might be common.
  // Or, we can use a class like 'max-h-[450px]' and 'overflow-y-auto'
  return (
    <div className="bg-white rounded-lg shadow p-6 h-[530px]">
      <h2 className="text-lg font-semibold mb-4">Crop Profitability Snapshot</h2>
      
      <div className="space-y-6 overflow-y-auto h-[440px] pr-2">
        {profitableCrops.map((crop) => (
          <div key={crop.id} className="pb-4 border-b border-gray-200 last:border-b-0">
            <h3 className="text-md font-medium text-gray-800 mb-3">{crop.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"> {/* Changed md: to sm: for better responsiveness in tighter space */}
              <div className="sm:col-span-1 flex justify-center sm:justify-start">
                <GaugeChart
                  value={crop.progressToBreakEven}
                  size={100} // Increased size for better visibility
                  strokeWidth={10}
                  valueText={`${crop.actualProgressToBreakEven.toFixed(0)}%`}
                  color={crop.isProfitable ? '#10B981' : '#EF4444'} // Green for profitable, Red otherwise
                  label={crop.soldPercentage > 0 ? `${crop.soldPercentage}% Sold` : 'No Sales'} // Added sold percentage label
                />
              </div>
              <div className="sm:col-span-2 text-sm text-gray-600 space-y-1 text-center sm:text-left"> {/* Changed md: to sm: */}
                <p>
                  Revenue Achieved: <span className="font-semibold text-gray-700">£{crop.revenueAchieved.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </p>
                <p>
                  Budgeted Cost (Break-Even Target): <span className="font-semibold text-gray-700">£{crop.budgetedCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </p>
                {crop.isProfitable ? (
                  <p className="text-green-600 font-semibold">
                    Surplus: £{crop.surplusOrDeficit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    £{crop.remainingToBreakEven.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} to Break-Even
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropProfitabilitySnapshot;