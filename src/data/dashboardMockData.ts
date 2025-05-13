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
    cover_art_url: 'https://source.unsplash.com/random/400x400?farm'
  },
  {
    id: '2',
    episode_title: 'Sustainable Agriculture',
    description_snippet: 'Discussing sustainable farming practices and their impact on the environment.',
    date: '2025-05-03',
    duration: '38min',
    guest_name: 'Sarah Johnson',
    spotify_link: 'https://open.spotify.com/episode/2',
    cover_art_url: 'https://source.unsplash.com/random/400x400?agriculture'
  },
  {
    id: '3',
    episode_title: 'Market Trends 2025',
    description_snippet: 'Analysis of current market trends and predictions for the agricultural sector.',
    date: '2025-04-26',
    duration: '42min',
    guest_name: 'Michael Brown',
    spotify_link: 'https://open.spotify.com/episode/3',
    cover_art_url: 'https://source.unsplash.com/random/400x400?market'
  },
  {
    id: '4',
    episode_title: 'Smart Irrigation Systems',
    description_snippet: 'Deep dive into modern irrigation technologies and water management.',
    date: '2025-04-19',
    duration: '35min',
    guest_name: 'Emily Wilson',
    spotify_link: 'https://open.spotify.com/episode/4',
    cover_art_url: 'https://source.unsplash.com/random/400x400?irrigation'
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