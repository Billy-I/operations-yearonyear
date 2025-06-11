import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mockInsights,
  mockPodcastEpisodes,
  mockDashboardCropsData,
  mockCommoditiesData,
  mockBreakEvenData,
  mockCashFlowData,
  mockExplorerSnapshotData,
  mockMultiYearTrendsData,
  mockKpiSummaryData,
  mockWeatherData,
  mockMarketPricesData,
  mockFarmInsightsData
} from '../data/dashboardMockData';

// Import components
import PodcastWidget from '../components/widgets/PodcastWidget';
import CropMonitoringWidget from '../components/widgets/CropMonitoringWidget';
import CropBreakEvenAnalysisWidget from '../components/widgets/CropBreakEvenAnalysisWidget';
import CashFlowWidget from '../components/widgets/CashFlowWidget';
import MultiYearTrendsWidget from '../components/widgets/MultiYearTrendsWidget';
import KpiCard from '../components/widgets/KpiCard';
import WeatherWidget from '../components/widgets/WeatherWidget';
import MarketPricesWidget from '../components/widgets/MarketPricesWidget';
import FarmInsightsWidget from '../components/widgets/FarmInsightsWidget';

const HiddenDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleViewTracker = () => {
    navigate('/tracker/crop-progress');
  };

  const handleViewMarketplace = () => {
    navigate('/marketplace');
  };

  const handleViewAllInsights = () => {
    navigate('/insights');
  };

  const handleInsightClick = (insight: any) => {
    console.log('Insight clicked:', insight);
    // Future: navigate to detailed insight view
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-yagro-background min-h-screen">
      <div className="w-full">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-yagro-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
            </div>
            <div>
              <h1 className="heading-primary mb-2">Farm Dashboard</h1>
              <p className="text-lg text-muted">Complete overview of your farming operations and performance</p>
            </div>
          </div>

          {/* KPI Cards Grid */}
          {mockKpiSummaryData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-12 mb-8">
              {mockKpiSummaryData.map((kpi) => (
                <KpiCard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8 lg:space-y-10">
          
          {/* Priority Section: Weather, Farm Insights, Market Prices - Full Width Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
            {/* Weather Widget */}
            <WeatherWidget weatherData={mockWeatherData} />
            
            {/* Farm Insights Widget - AI Powered */}
            <FarmInsightsWidget
              insights={mockFarmInsightsData}
              onViewAllInsights={handleViewAllInsights}
              onInsightClick={handleInsightClick}
            />
            
            {/* Market Prices Widget */}
            <MarketPricesWidget
              marketData={mockMarketPricesData}
              onViewMarketplaceClick={handleViewMarketplace}
            />
          </div>

          {/* Zone 2: Crop Monitoring & Break-Even Analysis */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <CropMonitoringWidget
              crops={mockDashboardCropsData}
              onViewTrackerClick={handleViewTracker}
            />
            <CropBreakEvenAnalysisWidget
              crops={mockDashboardCropsData}
            />
          </div>

          {/* Zone 3: Cash Flow Chart Section */}
          <div>
            <CashFlowWidget
              title="AA Clifton Monthly Cash Flow for Financial Year 2023-2024"
              data={mockCashFlowData}
            />
          </div>

          {/* Zone 4: Analytics Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <MultiYearTrendsWidget
              trendsData={mockMultiYearTrendsData}
            />
            <PodcastWidget episodes={mockPodcastEpisodes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenDashboard;