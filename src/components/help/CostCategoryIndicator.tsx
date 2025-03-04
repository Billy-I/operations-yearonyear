import React from 'react';
import { Link } from 'lucide-react';

type CostCategoryIndicatorProps = {
  className?: string;
  size?: number;
};

/**
 * A visual indicator component to show which areas are affected by cost category changes
 */
const CostCategoryIndicator: React.FC<CostCategoryIndicatorProps> = ({
  className = "",
  size = 16
}) => {
  return (
    <div className="relative group inline-flex items-center">
      <Link
        size={size}
        className={`text-blue-500 animate-pulse-once ${className} cursor-help`}
        data-testid="cost-category-indicator"
        aria-label="This section is affected by cost category selection"
      />
      <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1 top-full">
        This section is affected by the cost categories checkbox selection
      </div>
    </div>
  );
};

export default CostCategoryIndicator;