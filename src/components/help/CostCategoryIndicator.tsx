import React from 'react';
import { Link } from 'lucide-react';

type CostCategoryIndicatorProps = {
  className?: string;
  size?: number;
  showIcon?: boolean;
  isTotalCostsCheckbox?: boolean;
};

/**
 * A visual indicator component to show which areas are affected by cost category changes
 */
const CostCategoryIndicator: React.FC<CostCategoryIndicatorProps> = ({
  className = "",
  size = 16,
  showIcon = true,
  isTotalCostsCheckbox = false
}) => {
  const tooltipText = isTotalCostsCheckbox
    ? "Enabling or disabling this checkbox will affect the values of Costs KPI card and the Performance by table"
    : "This section is affected by the cost categories checkbox selection";

  return (
    <div className="relative group inline-flex items-center">
      {showIcon && (
        <Link
          size={size}
          className={`text-blue-500 animate-pulse-once ${className} cursor-help`}
          data-testid="cost-category-indicator"
          aria-label={tooltipText}
        />
      )}
      <div className="absolute z-10 invisible group-hover:visible bg-black text-white text-xs rounded p-2 w-48 left-0 mt-1 top-full">
        {tooltipText}
      </div>
    </div>
  );
};

export default CostCategoryIndicator;