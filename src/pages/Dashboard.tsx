import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mockInsights,
  mockPodcastEpisodes,
  mockDashboardCropsData,
  mockCommoditiesData,
  mockBreakEvenData,
  mockKpiSummaryData,
  mockMultiYearTrendsData,
  mockExplorerSnapshotData,
  mockCashFlowData,
  mockWeatherData
} from '../data/dashboardMockData';

// Import components
import LatestInsightsWidget from '../components/widgets/LatestInsightsWidget';
import PodcastWidget from '../components/widgets/PodcastWidget';
import TrackerZone from '../components/zones/TrackerZone';
import CommoditiesWidget from '../components/widgets/CommoditiesWidget';
import BreakEvenWidget from '../components/widgets/BreakEvenWidget';
import AIYieldForecasterWidget from '../components/widgets/AIYieldForecasterWidget';
import KpiCard from '../components/widgets/KpiCard';
import MultiYearTrendsWidget from '../components/widgets/MultiYearTrendsWidget';
import ExplorerSnapshotWidget from '../components/widgets/ExplorerSnapshotWidget';
import CashFlowWidget from '../components/widgets/CashFlowWidget';
import WeatherWidget from '../components/widgets/WeatherWidget';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening on your farm.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AI Yield Forecaster - Featured Widget */}
            <AIYieldForecasterWidget className="col-span-full" />
            
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {mockKpiSummaryData.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>

            {/* Multi-Year Trends and Cash Flow */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MultiYearTrendsWidget trendsData={mockMultiYearTrendsData} />
              <CashFlowWidget data={mockCashFlowData} title="Farm Cash Flow" />
            </div>

            {/* Explorer Snapshot */}
            <ExplorerSnapshotWidget 
              snapshotData={mockExplorerSnapshotData} 
            />

          </div>

          {/* Right Column - Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Weather Widget */}
            <WeatherWidget weatherData={mockWeatherData} />
            
            {/* Latest Insights */}
            <LatestInsightsWidget insights={mockInsights} />
            
            {/* Podcast Widget */}
            <PodcastWidget episodes={mockPodcastEpisodes} />
            
            {/* Commodities */}
            <CommoditiesWidget 
              allCommoditiesData={mockCommoditiesData} 
              onViewInMarketplaceClick={(commodityKey) => console.log('View marketplace:', commodityKey)}
            />

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
