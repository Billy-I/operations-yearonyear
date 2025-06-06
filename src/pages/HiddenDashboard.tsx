import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mockInsights,
  mockPodcastEpisodes,
  mockDashboardCropsData,
  mockCommoditiesData,
  mockBreakEvenData
} from '../data/dashboardMockData';

// Import components
import LatestInsightsWidget from '../components/widgets/LatestInsightsWidget';
import PodcastWidget from '../components/widgets/PodcastWidget';
import TrackerZone from '../components/zones/TrackerZone';
import CommoditiesWidget from '../components/widgets/CommoditiesWidget';
import BreakEvenWidget from '../components/widgets/BreakEvenWidget';

const HiddenDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleViewTracker = () => {
    navigate('/tracker/crop-progress');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard (Hidden Preview)</h1>
      
      {/* Zone 1: Prime Visibility */}
      <div className="space-y-6 mb-8">
        {/* Primary Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latest Insights Widget */}
          <LatestInsightsWidget insights={mockInsights} />
          
          {/* Commodities Widget */}
          <CommoditiesWidget
            allCommoditiesData={mockCommoditiesData}
            onViewInMarketplaceClick={(commodityKey) => {
              console.log(`CommoditiesWidget: View in Marketplace clicked for ${commodityKey}`);
              // Future: navigate(`/marketplace/commodities/${commodityKey.toLowerCase().replace(' ', '-')}`);
            }}
          />
        </div>
      </div>

      {/* Zone 2: Tracker Overview */}
      <TrackerZone 
        crops={mockDashboardCropsData}
        onViewTrackerClick={handleViewTracker}
      />

      {/* Zone 3: Break-Even Analysis and Latest Podcasts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreakEvenWidget data={mockBreakEvenData} />
        <PodcastWidget episodes={mockPodcastEpisodes} />
      </div>

      {/* Zone 4: Future expansion area */}
      <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
        <p className="text-center text-gray-500">
          Additional widgets coming soon...
        </p>
      </div>
    </div>
  );
};

export default HiddenDashboard;