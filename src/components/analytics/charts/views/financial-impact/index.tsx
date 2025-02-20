import React from 'react';
import { CostChartView, FinancialImpactViewProps } from '../../types/chart-types';
import WaterfallView from './WaterfallView';
import FinancialImpactStackedView from './FinancialImpactStackedView';
import SunburstView from './SunburstView';
import TreeMapView from './TreeMapView';
import GaugeView from './GaugeView';
import StepLineView from './StepLineView';
import FinancialViewSelector from './FinancialViewSelector';

interface FinancialImpactContainerProps extends FinancialImpactViewProps {
  view: CostChartView;
  onViewChange: (view: CostChartView) => void;
}

export const FinancialImpactContainer: React.FC<FinancialImpactContainerProps> = ({
  view,
  onViewChange,
  ...props
}) => {
  // Only show view selector for financial impact views
  const isFinancialView = view.startsWith('financial-impact');

  // Render the appropriate view based on the current view type
  const renderView = () => {
    switch (view) {
      case 'financial-impact':
        return <WaterfallView {...props} />;
      case 'financial-impact-stacked':
        return <FinancialImpactStackedView {...props} />;
      case 'financial-impact-sunburst':
        return <SunburstView {...props} />;
      case 'financial-impact-treemap':
        return <TreeMapView {...props} />;
      case 'financial-impact-gauge':
        return <GaugeView {...props} />;
      case 'financial-impact-stepline':
        return <StepLineView {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {isFinancialView && (
        <FinancialViewSelector
          currentView={view}
          onViewChange={onViewChange}
        />
      )}
      {renderView()}
    </div>
  );
};

export {
  WaterfallView,
  FinancialImpactStackedView,
  SunburstView,
  TreeMapView,
  GaugeView,
  StepLineView,
  FinancialViewSelector
};