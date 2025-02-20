import React from 'react';
import { CostChartView } from '../../types/chart-types';

interface FinancialViewSelectorProps {
  currentView: CostChartView;
  onViewChange: (view: CostChartView) => void;
}

const views = [
  { id: 'financial-impact', label: 'Waterfall', icon: '📊' },
  { id: 'financial-impact-stacked', label: 'Stacked Bar', icon: '📈' },
  { id: 'financial-impact-sunburst', label: 'Sunburst', icon: '🔆' },
  { id: 'financial-impact-treemap', label: 'Tree Map', icon: '🔲' },
  { id: 'financial-impact-gauge', label: 'Gauges', icon: '⏲️' },
  { id: 'financial-impact-stepline', label: 'Step Line', icon: '📉' }
] as const;

const FinancialViewSelector: React.FC<FinancialViewSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <div className="flex gap-2 mb-4">
      {views.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id as CostChartView)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm
            transition-colors duration-200
            ${currentView === id 
              ? 'bg-blue-100 text-blue-700 font-medium' 
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default FinancialViewSelector;