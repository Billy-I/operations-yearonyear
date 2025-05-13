import React from 'react';
import { DashboardCropData } from '../../data/dashboardMockData';
import TrackerHighlightsCard from '../widgets/TrackerHighlightsCard';
import TrackerVisualizationCard from '../widgets/TrackerVisualizationCard';

interface TrackerZoneProps {
  crops: DashboardCropData[];
  onViewTrackerClick: () => void;
}

const TrackerZone: React.FC<TrackerZoneProps> = ({
  crops,
  onViewTrackerClick
}) => {
  return (
    <div className="space-y-6 mb-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
      {/* Left Card - Tracker Highlights */}
      <div className="w-full">
        <TrackerHighlightsCard 
          crops={crops}
          onViewTrackerClick={onViewTrackerClick}
        />
      </div>

      {/* Right Card - Visualizations */}
      <div className="w-full">
        <TrackerVisualizationCard crops={crops} />
      </div>
    </div>
  );
};

export default TrackerZone;