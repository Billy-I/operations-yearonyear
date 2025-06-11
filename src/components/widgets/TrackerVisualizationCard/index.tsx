import React, { useState } from 'react';
import { DashboardCropData } from '../../../data/dashboardMockData';
import ViewSwitcher from './ViewSwitcher';
import SalesDistView from './views/SalesDistView';
import YieldChangeView from './views/YieldChangeView';
import CostAreaView from './views/CostAreaView';

export type ViewType = 'sales' | 'yield' | 'cost';

interface TrackerVisualizationCardProps {
  crops: DashboardCropData[];
  initialView?: ViewType;
}

const views: ViewType[] = ['sales', 'yield', 'cost'];
const viewTitles: Record<ViewType, string> = {
  sales: 'Sales Distribution',
  yield: 'Yield Performance',
  cost: 'Cost vs Area'
};

const viewDescriptions: Record<ViewType, string> = {
  sales: 'Bar width indicates crop area',
  yield: 'Sorted by yield change',
  cost: 'Point size indicates yield (t/ha)'
};

const TrackerVisualizationCard: React.FC<TrackerVisualizationCardProps> = ({
  crops,
  initialView = 'yield'
}) => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);

  const handlePrevious = () => {
    const currentIndex = views.indexOf(currentView);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : views.length - 1;
    setCurrentView(views[newIndex]);
  };

  const handleNext = () => {
    const currentIndex = views.indexOf(currentView);
    const newIndex = currentIndex < views.length - 1 ? currentIndex + 1 : 0;
    setCurrentView(views[newIndex]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Add/remove keyboard event listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentView]); // Re-add listener when view changes to ensure latest state

  const renderCurrentView = () => {
    switch (currentView) {
      case 'sales':
        return <SalesDistView crops={crops} />;
      case 'yield':
        return <YieldChangeView crops={crops} />;
      case 'cost':
        return <CostAreaView crops={crops} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with View Switcher */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {viewTitles[currentView]}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {viewDescriptions[currentView]}
          </p>
        </div>
        <ViewSwitcher 
          currentView={currentView}
          totalViews={views.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>

      {/* View Content */}
      <div className="relative">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default TrackerVisualizationCard;