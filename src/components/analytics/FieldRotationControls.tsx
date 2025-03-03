import { MapPin } from 'lucide-react';
import { TabType, UnitType } from '../../types/analytics';
import { fieldsData } from '../../data/fieldData';

interface FieldRotationControlsProps {
  selectedField: string;
  setSelectedField: (field: string) => void;
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  selectedUnit: UnitType;
  setSelectedUnit: (unit: UnitType) => void;
}

export const FieldRotationControls = ({
  selectedField,
  setSelectedField,
  selectedTab,
  setSelectedTab,
  selectedUnit,
  setSelectedUnit
}: FieldRotationControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        {/* Field Selector */}
        <div>
          <div className="text-sm text-gray-600 mb-2">Field</div>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <MapPin className="w-5 h-5 text-gray-500" />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="bg-transparent border-none focus:ring-0"
            >
              {fieldsData.map((field) => (
                <option key={field.id} value={field.id}>{field.name}</option>
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