import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ViewSwitcherProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* View position indicators */}
      <div className="flex gap-1">
        {Array.from({ length: totalItems }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-blue-600'
                : 'bg-gray-300'
            }`}
            role="presentation"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevious}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous item"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onNext}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next item"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ViewSwitcher;