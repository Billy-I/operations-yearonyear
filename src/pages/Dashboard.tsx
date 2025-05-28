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

const Dashboard: React.FC = () => {
  // const navigate = useNavigate(); // No longer needed

  // const handleViewTracker = () => { // No longer needed
  //   navigate('/tracker/crop-progress'); // No longer needed
  // }; // No longer needed

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard: Soon to be updated</h1>
    </div>
  );
};

export default Dashboard;