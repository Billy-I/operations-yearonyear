import { Leaf, Filter } from 'lucide-react';
import { AVAILABLE_CROPS, AVAILABLE_FILTERS } from '../../constants/analytics';
import { TabType, UnitType } from '../../types/analytics';

type AvailableCrop = typeof AVAILABLE_CROPS[number];

interface MultiYearControlsProps {
  selectedCrop: AvailableCrop;
  setSelectedCrop: (crop: AvailableCrop) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  selectedUnit: UnitType;
  setSelectedUnit: (unit: UnitType) => void;
}

export const MultiYearControls = ({
  selectedCrop,
  setSelectedCrop,
  selectedFilter,
  setSelectedFilter,
  selectedTab,
  setSelectedTab,
  selectedUnit,
  setSelectedUnit
}: MultiYearControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        {/* Crop Selector */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Crop(s)</div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <Leaf className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value as AvailableCrop)}
              className="bg-transparent border-none focus:ring-0"
            >
              {AVAILABLE_CROPS.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Filter Selector */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Filter By</div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0"
            >
              {AVAILABLE_FILTERS.map((filter) => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Unit Toggle */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Display Units</div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <div className="flex items-center space-x-2">
              <button
                className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/t' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedUnit('£/t')}
              >
                £/t
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${selectedUnit === '£/ha' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedUnit('£/ha')}
              >
                £/ha
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${selectedUnit === '£' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedUnit('£')}
              >
                Total (£)
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tab Switcher */}
      <div className="flex">
        <button
          className={`px-4 py-2 ${selectedTab === 'comparison' ? 'bg-gray-500 text-white' : 'bg-gray-200'} rounded-l-md`}
          onClick={() => setSelectedTab('comparison')}
        >
          Crop Comparison
        </button>
        <button
          className={`px-4 py-2 ${selectedTab === 'rotation' ? 'bg-gray-500 text-white' : 'bg-gray-200'} rounded-r-md`}
          onClick={() => setSelectedTab('rotation')}
        >
          Field Rotation
        </button>
      </div>
    </div>
  );
};