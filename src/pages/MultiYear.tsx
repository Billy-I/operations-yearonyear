import React, { useState } from 'react';
import { TabType } from '../types/analytics';
import MultiYearControls from '../components/analytics/MultiYearControls';
import { AVAILABLE_CROPS } from '../constants/analytics';

const MultiYear: React.FC = () => {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    AVAILABLE_CROPS.map(crop => crop.id)
  );
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState<TabType>('summary');

  const handleCropChange = (cropId: string, selected: boolean) => {
    if (selected) {
      setSelectedCrops([...selectedCrops, cropId]);
    } else {
      setSelectedCrops(selectedCrops.filter(id => id !== cropId));
    }
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    // Apply filter logic here
  };

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Multi-Year Analysis</h1>
      </div>

      <MultiYearControls
        selectedCrops={selectedCrops}
        selectedFilter={selectedFilter}
        selectedTab={selectedTab}
        onCropChange={handleCropChange}
        onFilterChange={handleFilterChange}
        onTabChange={handleTabChange}
      />

      <div className="bg-white rounded-lg shadow p-6">
        {/* Content will change based on selectedTab */}
        <div className="h-[500px]">
          {/* Chart or table will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default MultiYear;
