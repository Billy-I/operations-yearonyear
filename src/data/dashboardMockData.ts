// Mock data types and sample data for the new dashboard widgets

export interface InsightData {
  id: string;
  title: string;
  summary: string;
  date: string;
  contentType: 'text' | 'graph_placeholder';
  expandedContent: string;
  link?: string;
}

export interface FuelPriceData {
  fuel_type: string;
  current_price: number;
  price_trend: 'up' | 'down' | 'stable';
  unit: string;
}

export interface PodcastEpisode {
  id: string;
  episode_title: string;
  guest_name: string;
  publish_date: string;
  duration: string;
  spotify_link: string;
  cover_art_url: string;
  description_snippet: string;
}

// New interface for individual crop data for the dashboard tracker widget
export interface DashboardCropData {
  name: string;
  area: number; // hectares
  yield_value: number; // t/ha
  yield_change: number; // percentage
  costToDate_value: number; // £/ha
  costToDate_change: number; // percentage
  soldPercentage: number; // percentage
}

// Sample mock data
export const mockInsights: InsightData[] = [
  {
    id: "1",
    title: "Cropping Overview Q2 2025",
    summary: "Review the changing cropping area over time. Winter wheat showing strong performance.",
    date: "2025-05-13",
    contentType: 'graph_placeholder',
    expandedContent: "https://i.imgur.com/YOUR_CROPPING_OVERVIEW_IMAGE.png",
    link: "/analytics/crops"
  },
  {
    id: "2",
    title: "Market Alert: Fuel Prices",
    summary: "Red diesel prices trending downward. Consider reviewing fuel contracts for potential savings.",
    date: "2025-05-12",
    contentType: 'text',
    expandedContent: "Detailed analysis shows a 5% decrease in average red diesel prices over the past month, attributed to increased global supply. We recommend contacting your suppliers to renegotiate terms. White diesel prices remain stable.",
    link: "/marketplace/fuel"
  },
  {
    id: "3",
    title: "New Feature: Automated Anomaly Detection",
    summary: "Our latest update includes AI-powered anomaly detection for your field data.",
    date: "2025-05-10",
    contentType: 'text',
    expandedContent: "The new anomaly detection system continuously monitors your sensor data, satellite imagery, and operational logs to identify unusual patterns that may indicate pest infestations, nutrient deficiencies, or irrigation issues. You'll receive alerts directly in your dashboard and via email.",
  }
];

export const mockFuelPrices: FuelPriceData[] = [
  {
    fuel_type: "Red Diesel",
    current_price: 0.85,
    price_trend: "down",
    unit: "£/L"
  },
  {
    fuel_type: "White Diesel",
    current_price: 1.45,
    price_trend: "stable",
    unit: "£/L"
  }
];

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep1",
    episode_title: "Future of Precision Agriculture",
    guest_name: "Dr. Sarah Johnson",
    publish_date: "2025-05-10",
    duration: "45:30",
    spotify_link: "https://spotify.com/episode1",
    cover_art_url: "/podcast/episode1-cover.jpg",
    description_snippet: "Exploring how AI and automation are transforming modern farming practices."
  },
  {
    id: "ep2",
    episode_title: "Sustainable Farming Practices",
    guest_name: "Michael Roberts",
    publish_date: "2025-05-03",
    duration: "38:15",
    spotify_link: "https://spotify.com/episode2",
    cover_art_url: "/podcast/episode2-cover.jpg",
    description_snippet: "Discussing innovative approaches to reduce environmental impact while maintaining profitability."
  }
];

// New mock data for the Tracker Widget, reflecting CropProgress structure
export const mockDashboardCropsData: DashboardCropData[] = [
  {
    name: 'Wheat (Winter)',
    area: 641.16,
    yield_value: 8.30, yield_change: 12, // Positive yield change
    costToDate_value: 769.43, costToDate_change: 7,
    soldPercentage: 45,
  },
  {
    name: 'Field Bean (Spring)',
    area: 234.53,
    yield_value: 5.55, yield_change: -8, // Negative yield change
    costToDate_value: 346.63, costToDate_change: 10,
    soldPercentage: 0,
  },
  {
    name: 'Barley (Winter)',
    area: 195.78,
    yield_value: 10.11, yield_change: 9,
    costToDate_value: 630.34, costToDate_change: -2,
    soldPercentage: 0,
  },
  {
    name: 'Linseed',
    area: 157.68,
    yield_value: 1.99, yield_change: -14, // Significant negative yield change
    costToDate_value: 478.46, costToDate_change: 39, // High cost increase
    soldPercentage: 0,
  },
  {
    name: 'Oats (Spring)',
    area: 122.79,
    yield_value: 7.14, yield_change: 10,
    costToDate_value: 380.49, costToDate_change: 28, // High cost increase
    soldPercentage: 60,
  },
];

// The old TrackerSummary type and mockTrackerSummary object are no longer needed
// as the widget will now process mockDashboardCropsData directly.