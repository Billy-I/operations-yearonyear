import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ViewType, UnitType } from '../../types/analytics';
import { AVAILABLE_YEARS } from '../../constants/analytics';

interface MultiYearHeaderProps {
  selectedView: ViewType;
  setSelectedView: (view: ViewType) => void;
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
  selectedUnit: UnitType;
  setSelectedUnit: (unit: UnitType) => void;
}

export const MultiYearHeader = ({
  selectedView,
  setSelectedView,
  selectedYears,
  setSelectedYears,
  selectedUnit,
  setSelectedUnit
}: MultiYearHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <Link to="/analytics/explorer" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="text-sm text-gray-600">Explorer / Multi year</div>
          <h1 className="text-2xl font-bold">Multi Year Analysis</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/analytics/explorer" className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
          Explorer Overview
        </Link>
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value as ViewType)}
            className="bg-transparent border-none focus:ring-0"
          >
            <option value="Variable">Variable</option>
            <option value="Operations">Operations</option>
            <option value="Total">Total</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
          <div className="relative">
            <button
              className="bg-transparent border-none focus:ring-0 flex items-center space-x-2"
              onClick={(e) => {
                const target = e.currentTarget.nextElementSibling;
                if (target) {
                  target.classList.toggle('hidden');
                }
              }}
            >
              <span>{selectedYears.length} years selected</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-1 bg-white border rounded-md shadow-lg z-50 hidden">
              {AVAILABLE_YEARS.map((year) => (
                <label key={year} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedYears.includes(year)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedYears([...selectedYears, year]);
                      } else {
                        setSelectedYears(selectedYears.filter((y) => y !== year));
                      }
                    }}
                    className="mr-2"
                  />
                  {year}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};