// AI Yield Forecaster Types

export interface YieldPrediction {
  crop: string;
  currentYield: number;
  predictedYield: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  lastUpdated: string;
  accuracy?: number; // Historical accuracy for this crop
}

export interface InfluenceFactor {
  name: string;
  impact: number; // -100 to +100 percentage impact
  description: string;
  category: 'weather' | 'soil' | 'inputs' | 'management';
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'fertilizer' | 'seed' | 'chemical' | 'timing' | 'harvest' | 'management';
  estimatedImpact: {
    yield: number; // percentage change
    revenue: number; // £ change
  };
  actionRequired: string;
  deadline?: string;
}

export interface ScenarioAnalysis {
  id: string;
  name: string;
  description: string;
  changes: {
    factor: string;
    adjustment: number;
  }[];
  predictedOutcome: {
    yieldChange: number;
    revenueChange: number;
    confidence: number;
  };
}

export interface AIAlert {
  id: string;
  type: 'warning' | 'opportunity' | 'critical';
  title: string;
  message: string;
  impact: string;
  created: string;
  fieldId?: string;
  cropName?: string;
}

export interface AIForecastData {
  fieldId: string;
  fieldName: string;
  cropName: string;
  area: number; // hectares
  prediction: YieldPrediction;
  factors: InfluenceFactor[];
  recommendations: AIRecommendation[];
  scenarios: ScenarioAnalysis[];
  alerts: AIAlert[];
  historicalAccuracy: {
    season: string;
    predicted: number;
    actual: number;
    accuracy: number;
  }[];
}

export interface AISystemStatus {
  lastUpdate: string;
  nextUpdate: string;
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  modelVersion: string;
  overallAccuracy: number;
}
