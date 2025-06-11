// Types
export interface InsightData {
  id: string;
  title: string;
  summary: string;
  date: string;
  contentType: 'text' | 'graph_placeholder';
  expandedContent: string;
  link?: string;
}

export interface PodcastEpisode {
  id: string;
  episode_title: string;
  description_snippet: string;
  date: string;
  duration: string;
  guest_name: string;
  spotify_link: string;
  cover_art_url: string;
}

export interface DashboardCropData {
  id: string;
  name: string;
  area: number;
  yield: number;
  yield_value: number;
  yield_change: number;
  yieldChange: number;
  cost: number;
  revenue: number;
  costToDate_value: number;
  costToDate_change: number;
  soldPercentage: number;
}

export interface CommodityPricePoint {
  date: string;
  price: number;
}

export interface CommodityDetails {
  name: string;
  unit: string;
  currentPrice: number;
  oneYearHigh: number;
  oneYearLow: number;
  priceHistory: {
    last30days: CommodityPricePoint[];
    last90days: CommodityPricePoint[];
    last1year: CommodityPricePoint[];
  };
}

export interface BreakEvenAnalysis {
  cropId: string;
  cropName: string;
  budgetedCosts: number;
  actualSales: number;
  breakEvenPoint: number;
  salesProgress: number;
  monthlyData: {
    month: string;
    budgetedCosts: number;
    actualSales: number;
  }[];
}

export const mockBreakEvenData: { [key: string]: BreakEvenAnalysis } = {
  '1': {
    cropId: '1',
    cropName: 'Wheat',
    budgetedCosts: 250000,
    actualSales: 175000,
    breakEvenPoint: 200000,
    salesProgress: 70,
    monthlyData: [
      { month: 'Jan', budgetedCosts: 20000, actualSales: 18000 },
      { month: 'Feb', budgetedCosts: 40000, actualSales: 35000 },
      { month: 'Mar', budgetedCosts: 65000, actualSales: 55000 },
      { month: 'Apr', budgetedCosts: 95000, actualSales: 85000 },
      { month: 'May', budgetedCosts: 125000, actualSales: 115000 },
      { month: 'Jun', budgetedCosts: 150000, actualSales: 140000 },
      { month: 'Jul', budgetedCosts: 175000, actualSales: 155000 },
      { month: 'Aug', budgetedCosts: 200000, actualSales: 165000 },
      { month: 'Sep', budgetedCosts: 220000, actualSales: 175000 }
    ]
  },
  '2': {
    cropId: '2',
    cropName: 'Barley',
    budgetedCosts: 180000,
    actualSales: 145000,
    breakEvenPoint: 160000,
    salesProgress: 85,
    monthlyData: [
      { month: 'Jan', budgetedCosts: 15000, actualSales: 16000 },
      { month: 'Feb', budgetedCosts: 35000, actualSales: 32000 },
      { month: 'Mar', budgetedCosts: 55000, actualSales: 50000 },
      { month: 'Apr', budgetedCosts: 85000, actualSales: 80000 },
      { month: 'May', budgetedCosts: 105000, actualSales: 100000 },
      { month: 'Jun', budgetedCosts: 130000, actualSales: 120000 },
      { month: 'Jul', budgetedCosts: 155000, actualSales: 135000 },
      { month: 'Aug', budgetedCosts: 170000, actualSales: 140000 },
      { month: 'Sep', budgetedCosts: 180000, actualSales: 145000 }
    ]
  },
  '3': {
    cropId: '3',
    cropName: 'Oilseed Rape',
    budgetedCosts: 220000,
    actualSales: 195000,
    breakEvenPoint: 180000,
    salesProgress: 95,
    monthlyData: [
      { month: 'Jan', budgetedCosts: 18000, actualSales: 20000 },
      { month: 'Feb', budgetedCosts: 38000, actualSales: 40000 },
      { month: 'Mar', budgetedCosts: 60000, actualSales: 65000 },
      { month: 'Apr', budgetedCosts: 90000, actualSales: 95000 },
      { month: 'May', budgetedCosts: 120000, actualSales: 125000 },
      { month: 'Jun', budgetedCosts: 150000, actualSales: 155000 },
      { month: 'Jul', budgetedCosts: 180000, actualSales: 175000 },
      { month: 'Aug', budgetedCosts: 200000, actualSales: 185000 },
      { month: 'Sep', budgetedCosts: 220000, actualSales: 195000 }
    ]
  }
};

// Generate price history data
const generatePriceHistory = (basePrice: number, days: number): CommodityPricePoint[] => {
  const data: CommodityPricePoint[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * 0.1; // +/- 5% variation
    data.push({
      date: date.toISOString(),
      price: +(basePrice * (1 + variation)).toFixed(2)
    });
  }
  return data;
};

// Mock data
export const mockInsights: InsightData[] = [
  {
    id: '1',
    title: 'Cost Savings Opportunity',
    summary: 'Potential savings identified in fertilizer costs',
    date: '2025-05-13',
    contentType: 'text',
    expandedContent: 'Analysis shows you could save up to 15% on fertilizer costs by adjusting application timing...'
  },
  {
    id: '2',
    title: 'Yield Performance Alert',
    summary: 'Above average yields detected in Field Group A',
    date: '2025-05-12',
    contentType: 'graph_placeholder',
    expandedContent: '/yield-performance-graph.png',
    link: '/analytics/yield'
  },
  {
    id: '3',
    title: 'Market Price Update',
    summary: 'Wheat prices trending upward',
    date: '2025-05-11',
    contentType: 'text',
    expandedContent: 'Current market analysis indicates a positive trend in wheat prices...'
  }
];

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: '1',
    episode_title: 'Future of Farming',
    description_snippet: 'Exploring technological innovations in agriculture and how they will shape the future of farming.',
    date: '2025-05-10',
    duration: '45min',
    guest_name: 'John Smith',
    spotify_link: 'https://open.spotify.com/episode/1',
    cover_art_url: '/images/podcasts/future-farming.svg'
  },
  {
    id: '2',
    episode_title: 'Sustainable Agriculture',
    description_snippet: 'Discussing sustainable farming practices and their impact on the environment.',
    date: '2025-05-03',
    duration: '38min',
    guest_name: 'Sarah Johnson',
    spotify_link: 'https://open.spotify.com/episode/2',
    cover_art_url: '/images/podcasts/sustainable-agriculture.svg'
  },
  {
    id: '3',
    episode_title: 'Market Trends 2025',
    description_snippet: 'Analysis of current market trends and predictions for the agricultural sector.',
    date: '2025-04-26',
    duration: '42min',
    guest_name: 'Michael Brown',
    spotify_link: 'https://open.spotify.com/episode/3',
    cover_art_url: '/images/podcasts/market-trends.svg'
  },
  {
    id: '4',
    episode_title: 'Smart Irrigation Systems',
    description_snippet: 'Deep dive into modern irrigation technologies and water management.',
    date: '2025-04-19',
    duration: '35min',
    guest_name: 'Emily Wilson',
    spotify_link: 'https://open.spotify.com/episode/4',
    cover_art_url: '/images/podcasts/smart-irrigation.svg'
  }
];

export const mockDashboardCropsData: DashboardCropData[] = [
  {
    id: '1',
    name: 'Wheat',
    area: 150,
    yield: 8.5,
    yield_value: 8.5,
    yield_change: 0.3,
    yieldChange: 0.3,
    cost: 45000,
    revenue: 85000,
    costToDate_value: 35000,
    costToDate_change: 15,
    soldPercentage: 65
  },
  {
    id: '2',
    name: 'Barley',
    area: 100,
    yield: 7.2,
    yield_value: 7.2,
    yield_change: -0.1,
    yieldChange: -0.1,
    cost: 35000,
    revenue: 65000,
    costToDate_value: 28000,
    costToDate_change: 22,
    soldPercentage: 45
  },
  {
    id: '3',
    name: 'Oilseed Rape',
    area: 85,
    yield: 3.8,
    yield_value: 3.8,
    yield_change: 0.8,
    yieldChange: 0.8,
    cost: 38000,
    revenue: 72000,
    costToDate_value: 32000,
    costToDate_change: 18,
    soldPercentage: 75
  },
  {
    id: '4',
    name: 'Potatoes',
    area: 45,
    yield: 42.5,
    yield_value: 42.5,
    yield_change: -0.4,
    yieldChange: -0.4,
    cost: 65000,
    revenue: 95000,
    costToDate_value: 55000,
    costToDate_change: 25,
    soldPercentage: 85
  },
  {
    id: '5',
    name: 'Sugar Beet',
    area: 60,
    yield: 75.0,
    yield_value: 75.0,
    yield_change: 0.5,
    yieldChange: 0.5,
    cost: 42000,
    revenue: 78000,
    costToDate_value: 36000,
    costToDate_change: 12,
    soldPercentage: 55
  },
  {
    id: '6',
    name: 'Peas',
    area: 30,
    yield: 4.2,
    yield_value: 4.2,
    yield_change: -0.2,
    yieldChange: -0.2,
    cost: 25000,
    revenue: 45000,
    costToDate_value: 20000,
    costToDate_change: 8,
    soldPercentage: 90
  }
];

export const mockCommoditiesData: { [key: string]: CommodityDetails } = {
  fertilizer: {
    name: 'Fertilizer',
    unit: '£',
    currentPrice: 350.50,
    oneYearHigh: 380.00,
    oneYearLow: 320.00,
    priceHistory: {
      last30days: generatePriceHistory(350.50, 30),
      last90days: generatePriceHistory(350.50, 90),
      last1year: generatePriceHistory(350.50, 365)
    }
  },
  fuel: {
    name: 'Fuel',
    unit: '£',
    currentPrice: 1.45,
    oneYearHigh: 1.65,
    oneYearLow: 1.35,
    priceHistory: {
      last30days: generatePriceHistory(1.45, 30),
      last90days: generatePriceHistory(1.45, 90),
      last1year: generatePriceHistory(1.45, 365)
    }
  }
};

export const mockWeatherData = [
  {
    date: '2025-05-13',
    condition: 'sunny' as const,
    temperature: 22,
    rainfall: 0
  },
  {
    date: '2025-05-14',
    condition: 'cloudy' as const,
    temperature: 19,
    rainfall: 0
  },
  {
    date: '2025-05-15',
    condition: 'rainy' as const,
    temperature: 17,
    rainfall: 12
  },
  {
    date: '2025-05-16',
    condition: 'cloudy' as const,
    temperature: 18,
    rainfall: 3
  },
  {
    date: '2025-05-17',
    condition: 'sunny' as const,
    temperature: 21,
    rainfall: 0
  }
];

// Cash Flow Data
export interface CashFlowDataPoint {
  month: string;
  salesWheat?: number;
  salesOats?: number;
  salesBarley?: number;
  salesOilseedRape?: number;
  invoiceSeed?: number;
  invoiceFertiliser?: number;
  invoiceChemical?: number;
  netCashFlow: number;
}

export const mockCashFlowData: CashFlowDataPoint[] = [
  { month: 'Apr', salesWheat: 80, invoiceChemical: -90, netCashFlow: 85.89 },
  { month: 'May', salesOats: 60, invoiceChemical: -100, netCashFlow: 50 },
  { month: 'Jun', invoiceChemical: -30, invoiceFertiliser: -20, netCashFlow: -10 },
  { month: 'Jul', salesOilseedRape: 70, invoiceSeed: -10, invoiceFertiliser: -110, invoiceChemical: -5, netCashFlow: -105 },
  { month: 'Aug', salesBarley: 90, invoiceFertiliser: -60, invoiceChemical: -20, netCashFlow: -85 },
  { month: 'Sep', invoiceChemical: -100, invoiceFertiliser: -30, netCashFlow: -190 },
  { month: 'Oct', invoiceChemical: -20, netCashFlow: -205 },
  { month: 'Nov', invoiceChemical: -10, netCashFlow: -210 },
  { month: 'Dec', invoiceChemical: -5, netCashFlow: -212 },
  { month: 'Jan', invoiceChemical: -15, netCashFlow: -220 },
  { month: 'Feb', invoiceChemical: -30, netCashFlow: -250 },
  { month: 'Mar', invoiceChemical: -25, netCashFlow: -274.54 },
];

// Mock data for Explorer Snapshot Widget
export interface CropPerformanceMetric {
  label: string; 
  value: string; 
}

export interface ExplorerCropYearData {
  cropName: string;
  harvestYear: string; 
  metrics: CropPerformanceMetric[];
}

export type MockExplorerSnapshotDataType = {
  [cropId: string]: ExplorerCropYearData; 
};

export const mockExplorerSnapshotData: MockExplorerSnapshotDataType = {
  'winter_wheat': {
    cropName: 'Winter Wheat',
    harvestYear: '2024',
    metrics: [
      { label: 'Avg. Yield', value: '9.1 t/ha' },
      { label: 'Avg. Gross Margin', value: '£650/ha' },
      { label: 'Avg. Net Margin', value: '£395/ha' },
      { label: 'Seed Cost', value: '£75/ha' },
      { label: 'Fertiliser Cost', value: '£220/ha' },
      { label: 'Spray Cost', value: '£110/ha' },
    ]
  },
  'oilseed_rape': {
    cropName: 'Oilseed Rape',
    harvestYear: '2024',
    metrics: [
      { label: 'Avg. Yield', value: '3.8 t/ha' },
      { label: 'Avg. Gross Margin', value: '£580/ha' },
      { label: 'Avg. Net Margin', value: '£340/ha' },
      { label: 'Seed Cost', value: '£60/ha' },
      { label: 'Fertiliser Cost', value: '£190/ha' },
      { label: 'Spray Cost', value: '£135/ha' },
    ]
  },
  'spring_barley': {
    cropName: 'Spring Barley',
    harvestYear: '2024',
    metrics: [
      { label: 'Avg. Yield', value: '7.2 t/ha' },
      { label: 'Avg. Gross Margin', value: '£550/ha' },
      { label: 'Avg. Net Margin', value: '£310/ha' },
      { label: 'Seed Cost', value: '£65/ha' },
      { label: 'Fertiliser Cost', value: '£180/ha' },
      { label: 'Spray Cost', value: '£95/ha' },
    ]
  }
};

// --- New Structure for Multi-Year Trends Widget ---
export interface TrendDataPoint {
  year: string;
  value: number;
}

export interface MetricTrend {
  label: string;
  unit: string;
  history: TrendDataPoint[];
}

export type MockMultiYearTrendsDataType = {
  contextName: string;
  availableMetrics: {
    [metricKey: string]: MetricTrend;
  };
};

export const mockMultiYearTrendsData: MockMultiYearTrendsDataType = {
  contextName: "Farm Performance - Last 3 Years",
  availableMetrics: {
    'yield': {
      label: "Avg. Yield",
      unit: "t/ha",
      history: [
        { year: "2022", value: 8.8 },
        { year: "2023", value: 9.1 },
        { year: "2024", value: 9.0 },
      ]
    },
    'grossMargin': {
      label: "Avg. Gross Margin",
      unit: "£/ha",
      history: [
        { year: "2022", value: 620 },
        { year: "2023", value: 650 },
        { year: "2024", value: 635 },
      ]
    },
    'netMargin': {
      label: "Avg. Net Margin",
      unit: "£/ha",
      history: [
        { year: "2022", value: 380 },
        { year: "2023", value: 395 },
        { year: "2024", value: 385 },
      ]
    },
    'totalCosts': {
      label: "Avg. Total Costs",
      unit: "£/ha",
      history: [
        { year: "2022", value: 500 },
        { year: "2023", value: 515 },
        { year: "2024", value: 515 },
      ]
    }
  }
};
// --- End of New Structure for Multi-Year Trends Widget ---

// --- Key Performance Indicators (KPI) Summary Card Data ---
export interface KpiDataItem {
  id: string;
  label: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  link?: string;

  // For typical display KPIs
  value?: string;        // The main large value e.g., "40,689"
  trendIcon?: 'ArrowUpRight' | 'ArrowDownRight' | 'Minus'; // Optional: Lucide icon for trend
  trendText?: string;      // Text like "8.5% Up from yesterday"
  trendColorClass?: string; // Tailwind class for trend text & icon e.g., "text-green-600"

  // For action-oriented cards
  actionText?: string;    // e.g., "Import your latest field data"
}

export const mockKpiSummaryData: KpiDataItem[] = [
  {
    id: 'profitability',
    label: 'Farm Profitability',
    value: '£12.3k',
    icon: 'TrendingUp',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    trendIcon: 'ArrowUpRight',
    trendText: '5.2% YTD vs Target',
    trendColorClass: 'text-green-600',
    link: '/financials/overview'
  },
  {
    id: 'critical_alerts',
    label: 'Critical Alerts',
    value: '2 Active',
    icon: 'AlertTriangle',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    trendText: 'Requires attention',
    trendColorClass: 'text-red-600',
    link: '/alerts'
  },
  {
    id: 'weather',
    label: 'Local Forecast',
    value: '18°C, Showers',
    icon: 'CloudRain',
    iconBgColor: 'bg-sky-100',
    iconColor: 'text-sky-600',
    trendText: 'Next 24h',
    trendColorClass: 'text-gray-500',
    link: '/weather'
  },
  {
    id: 'upload_data',
    label: 'Data Import',
    icon: 'UploadCloud',
    iconBgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    actionText: 'Upload new field or financial data to update your dashboard.',
    link: '/data/upload' // Example link to an upload page
  }
];
// --- End of KPI Summary Card Data ---

// --- Market Prices Data ---
export interface MarketItem {
  id: string;
  name: string;
  category: 'fuel' | 'fertilizer' | 'seeds' | 'chemicals';
  currentPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  icon?: string;
}

export const mockMarketPricesData: MarketItem[] = [
  {
    id: 'diesel',
    name: 'Red Diesel',
    category: 'fuel',
    currentPrice: 1.45,
    unit: 'L',
    trend: 'up',
    changePercent: 3.2
  },
  {
    id: 'petrol',
    name: 'Petrol',
    category: 'fuel',
    currentPrice: 1.52,
    unit: 'L',
    trend: 'down',
    changePercent: 1.8
  },
  {
    id: 'nitrogen',
    name: 'Nitrogen (34.5%)',
    category: 'fertilizer',
    currentPrice: 385.50,
    unit: 'tonne',
    trend: 'stable',
    changePercent: 0.1
  },
  {
    id: 'phosphate',
    name: 'Triple Super Phosphate',
    category: 'fertilizer',
    currentPrice: 520.00,
    unit: 'tonne',
    trend: 'up',
    changePercent: 2.5
  },
  {
    id: 'wheat_seed',
    name: 'Winter Wheat Seed',
    category: 'seeds',
    currentPrice: 75.00,
    unit: 'ha',
    trend: 'down',
    changePercent: 1.2
  },
  {
    id: 'barley_seed',
    name: 'Spring Barley Seed',
    category: 'seeds',
    currentPrice: 65.00,
    unit: 'ha',
    trend: 'stable',
    changePercent: 0.5
  },
  {
    id: 'herbicide',
    name: 'Glyphosate 360',
    category: 'chemicals',
    currentPrice: 4.25,
    unit: 'L',
    trend: 'up',
    changePercent: 4.1
  },
  {
    id: 'fungicide',
    name: 'Azoxystrobin',
    category: 'chemicals',
    currentPrice: 12.80,
    unit: 'L',
    trend: 'down',
    changePercent: 2.3
  }
];

// --- Farm Insights Data ---
export interface FarmInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'alert' | 'recommendation' | 'trend';
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  aiGenerated: boolean;
  actionable?: boolean;
  estimatedImpact?: string;
}

export const mockFarmInsightsData: FarmInsight[] = [
  {
    id: 'yield_optimization',
    title: 'Yield Optimization Opportunity',
    description: 'AI analysis suggests optimizing nitrogen application timing in Field Group A could increase wheat yield by 8-12%.',
    type: 'opportunity',
    priority: 'high',
    confidence: 87,
    aiGenerated: true,
    actionable: true,
    estimatedImpact: '+£8.5k revenue'
  },
  {
    id: 'weather_alert',
    title: 'Weather Risk Alert',
    description: 'Heavy rainfall predicted for next week. Consider delaying herbicide application to prevent runoff.',
    type: 'alert',
    priority: 'medium',
    confidence: 92,
    aiGenerated: true,
    actionable: true,
    estimatedImpact: 'Risk mitigation'
  },
  {
    id: 'cost_reduction',
    title: 'Fertilizer Cost Reduction',
    description: 'Market analysis shows fertilizer prices expected to drop 5-7% in the next 3 weeks. Consider delaying large purchases.',
    type: 'recommendation',
    priority: 'medium',
    confidence: 74,
    aiGenerated: true,
    actionable: true,
    estimatedImpact: '-£3.2k costs'
  },
  {
    id: 'yield_trend',
    title: 'Above-Average Yield Trend',
    description: 'Your oilseed rape is tracking 15% above regional average. Current practices are highly effective.',
    type: 'trend',
    priority: 'low',
    confidence: 95,
    aiGenerated: true,
    actionable: false,
    estimatedImpact: 'Positive trend'
  },
  {
    id: 'equipment_maintenance',
    title: 'Preventive Maintenance Due',
    description: 'Combine harvester maintenance scheduled based on usage patterns. Book service to avoid harvest delays.',
    type: 'alert',
    priority: 'high',
    confidence: 98,
    aiGenerated: false,
    actionable: true,
    estimatedImpact: 'Prevent downtime'
  }
];