import { Calendar } from 'lucide-react';
import { FieldData } from '../../data/fieldData';
import { AVAILABLE_YEARS } from '../../constants/analytics';
import type { Year } from '../../types/analytics';

interface FieldCropHistoryProps {
  field: FieldData;
}

export default function FieldCropHistory({ field }: FieldCropHistoryProps) {
  // Get the last 3 years from available years (excluding 'Yearly avg')
  const years = AVAILABLE_YEARS
    .filter(year => year in field.rotations)
    .sort()
    .reverse()
    .slice(0, 3);

  return (
    <div className="space-y-2">
      {years.map((year) => {
        const crop = field.rotations[year];
        const isCurrentYear = year === years[0];

        return (
          <div
            key={year}
            className={`p-2 rounded ${
              isCurrentYear ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center text-sm">
              <Calendar size={14} className={`mr-1 ${isCurrentYear ? 'text-blue-600' : 'text-gray-600'}`} />
              <span className={isCurrentYear ? 'text-blue-600' : 'text-gray-600'}>
                {year}
              </span>
            </div>
            <div className="font-medium mt-1">{crop || 'No crop'}</div>
          </div>
        );
      })}
    </div>
  );
}