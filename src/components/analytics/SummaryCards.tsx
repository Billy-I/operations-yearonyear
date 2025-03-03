import { FieldData } from '../../data/fieldData';
import { UnitType } from '../../types/analytics';
import { getValue } from '../../utils/metricsCalculations';

interface CropSummaryCardProps {
  crop: string;
  onViewDetails: () => void;
  selectedUnit: UnitType;
}

export const CropSummaryCard = ({ crop, onViewDetails, selectedUnit }: CropSummaryCardProps) => {
  // Get crop data from metrics data
  // This is simplified - in a real implementation, you'd aggregate data for this crop
  const netMargin = getValue('netMargin', '2024', selectedUnit);
  const yield_ = getValue('yield', '2024', selectedUnit);
  
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h4 className="font-medium">{crop}</h4>
      <div className="mt-2 text-sm">
        <div>Net Margin: £{netMargin.toFixed(2)} {selectedUnit === '£/t' ? '/t' : '/ha'}</div>
        <div>Yield: {yield_.toFixed(2)} {selectedUnit === '£/t' ? 't' : 't/ha'}</div>
      </div>
      <button 
        onClick={onViewDetails}
        className="mt-3 text-blue-600 text-sm"
      >
        View Details →
      </button>
    </div>
  );
};

interface FieldSummaryCardProps {
  field: FieldData;
  onViewDetails: () => void;
  selectedUnit: UnitType;
}

export const FieldSummaryCard = ({ field, onViewDetails, selectedUnit }: FieldSummaryCardProps) => {
  const currentYear = '2024';
  const currentCrop = field.rotations[currentYear] || 'Unknown';
  
  // Get field-specific metrics
  const netMargin = field.metrics[currentYear]?.grossMargin || 0; // Using grossMargin as a fallback
  
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h4 className="font-medium">{field.name}</h4>
      <div className="mt-2 text-sm">
        <div>Current Crop: {currentCrop}</div>
        <div>Net Margin: £{netMargin.toFixed(2)} {selectedUnit === '£/t' ? '/t' : '/ha'}</div>
      </div>
      <button 
        onClick={onViewDetails}
        className="mt-3 text-blue-600 text-sm"
      >
        View Details →
      </button>
    </div>
  );
};