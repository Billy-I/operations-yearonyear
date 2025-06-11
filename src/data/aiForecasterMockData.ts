import { 
  AIForecastData, 
  YieldPrediction, 
  InfluenceFactor, 
  AIRecommendation, 
  ScenarioAnalysis, 
  AIAlert, 
  AISystemStatus 
} from '../types/aiForecaster';

// Mock AI Forecast Data for multiple fields
export const mockAIForecastData: AIForecastData[] = [
  {
    fieldId: 'field_01',
    fieldName: 'North Field',
    cropName: 'Winter Wheat',
    area: 45.2,
    prediction: {
      crop: 'Winter Wheat',
      currentYield: 8.2,
      predictedYield: 8.7,
      confidence: 87,
      riskLevel: 'low',
      factors: ['Favorable weather forecast', 'Optimal soil moisture', 'Good nutrient levels'],
      lastUpdated: '2025-01-05T09:30:00Z',
      accuracy: 91
    },
    factors: [
      {
        name: 'Weather Conditions',
        impact: 12,
        description: 'Optimal rainfall and temperature patterns forecasted',
        category: 'weather'
      },
      {
        name: 'Soil Health',
        impact: 8,
        description: 'Good organic matter and pH levels',
        category: 'soil'
      },
      {
        name: 'Fertilizer Application',
        impact: 5,
        description: 'Well-timed nitrogen application',
        category: 'inputs'
      },
      {
        name: 'Pest Pressure',
        impact: -3,
        description: 'Slight aphid activity detected',
        category: 'management'
      }
    ],
    recommendations: [
      {
        id: 'rec_001',
        title: 'Optimize Final Nitrogen Application',
        description: 'Apply final nitrogen dose 2 weeks earlier than planned to maximize uptake before flowering',
        priority: 'high',
        category: 'fertilizer',
        estimatedImpact: {
          yield: 3.2,
          revenue: 580
        },
        actionRequired: 'Schedule application for next week',
        deadline: '2025-01-15'
      },
      {
        id: 'rec_002',
        title: 'Monitor Aphid Populations',
        description: 'Increase field monitoring frequency to prevent potential yield loss',
        priority: 'medium',
        category: 'chemical',
        estimatedImpact: {
          yield: 1.8,
          revenue: 320
        },
        actionRequired: 'Weekly field inspections'
      }
    ],
    scenarios: [
      {
        id: 'scenario_001',
        name: 'Early Harvest',
        description: 'Harvest 1 week earlier than planned',
        changes: [
          { factor: 'Harvest Timing', adjustment: -7 }
        ],
        predictedOutcome: {
          yieldChange: -2.1,
          revenueChange: -380,
          confidence: 79
        }
      },
      {
        id: 'scenario_002',
        name: 'Additional Fungicide',
        description: 'Apply preventive fungicide treatment',
        changes: [
          { factor: 'Disease Protection', adjustment: 15 }
        ],
        predictedOutcome: {
          yieldChange: 4.3,
          revenueChange: 650,
          confidence: 82
        }
      }
    ],
    alerts: [],
    historicalAccuracy: [
      { season: '2024', predicted: 8.1, actual: 8.3, accuracy: 97 },
      { season: '2023', predicted: 7.8, actual: 7.6, accuracy: 97 },
      { season: '2022', predicted: 8.5, actual: 8.0, accuracy: 94 }
    ]
  },
  {
    fieldId: 'field_02',
    fieldName: 'South Paddock',
    cropName: 'Spring Barley',
    area: 32.8,
    prediction: {
      crop: 'Spring Barley',
      currentYield: 6.8,
      predictedYield: 6.3,
      confidence: 73,
      riskLevel: 'medium',
      factors: ['Variable rainfall forecast', 'Late frost risk', 'Good soil preparation'],
      lastUpdated: '2025-01-05T09:30:00Z',
      accuracy: 84
    },
    factors: [
      {
        name: 'Frost Risk',
        impact: -18,
        description: 'Late frost warning for next 2 weeks',
        category: 'weather'
      },
      {
        name: 'Soil Preparation',
        impact: 10,
        description: 'Excellent seedbed preparation',
        category: 'soil'
      },
      {
        name: 'Seed Quality',
        impact: 6,
        description: 'High germination rate variety selected',
        category: 'inputs'
      },
      {
        name: 'Planting Timing',
        impact: -8,
        description: 'Planted slightly later than optimal',
        category: 'management'
      }
    ],
    recommendations: [
      {
        id: 'rec_003',
        title: 'Frost Protection Strategy',
        description: 'Implement frost protection measures for vulnerable areas',
        priority: 'high',
        category: 'management',
        estimatedImpact: {
          yield: 8.5,
          revenue: 890
        },
        actionRequired: 'Install frost protection or select resistant varieties',
        deadline: '2025-01-12'
      }
    ],
    scenarios: [
      {
        id: 'scenario_003',
        name: 'Frost Protection',
        description: 'Implement comprehensive frost protection',
        changes: [
          { factor: 'Frost Risk', adjustment: -50 }
        ],
        predictedOutcome: {
          yieldChange: 12.3,
          revenueChange: 1250,
          confidence: 85
        }
      }
    ],
    alerts: [
      {
        id: 'alert_001',
        type: 'warning',
        title: 'Frost Risk Alert',
        message: 'Late frost conditions predicted for next week. Consider protection measures.',
        impact: 'Potential 15-20% yield reduction',
        created: '2025-01-05T08:00:00Z',
        fieldId: 'field_02',
        cropName: 'Spring Barley'
      }
    ],
    historicalAccuracy: [
      { season: '2024', predicted: 6.5, actual: 6.2, accuracy: 95 },
      { season: '2023', predicted: 6.9, actual: 7.1, accuracy: 97 },
      { season: '2022', predicted: 6.4, actual: 6.0, accuracy: 94 }
    ]
  },
  {
    fieldId: 'field_03',
    fieldName: 'East Block',
    cropName: 'Oilseed Rape',
    area: 28.5,
    prediction: {
      crop: 'Oilseed Rape',
      currentYield: 3.4,
      predictedYield: 3.8,
      confidence: 91,
      riskLevel: 'low',
      factors: ['Strong pollination forecast', 'Good pest management', 'Optimal growth stage'],
      lastUpdated: '2025-01-05T09:30:00Z',
      accuracy: 89
    },
    factors: [
      {
        name: 'Pollination Conditions',
        impact: 15,
        description: 'Favorable weather for bee activity',
        category: 'weather'
      },
      {
        name: 'Pest Management',
        impact: 8,
        description: 'Effective flea beetle control achieved',
        category: 'management'
      },
      {
        name: 'Canopy Development',
        impact: 5,
        description: 'Good leaf area index for light capture',
        category: 'management'
      },
      {
        name: 'Weed Competition',
        impact: -4,
        description: 'Minor weed pressure in field edges',
        category: 'management'
      }
    ],
    recommendations: [
      {
        id: 'rec_004',
        title: 'Sclerotinia Prevention',
        description: 'Apply preventive fungicide during peak flowering',
        priority: 'medium',
        category: 'chemical',
        estimatedImpact: {
          yield: 6.8,
          revenue: 950
        },
        actionRequired: 'Schedule application during 20-30% flowering',
        deadline: '2025-01-20'
      }
    ],
    scenarios: [
      {
        id: 'scenario_004',
        name: 'Early Desiccation',
        description: 'Apply desiccant 5 days earlier to avoid wet harvest conditions',
        changes: [
          { factor: 'Harvest Timing', adjustment: -5 }
        ],
        predictedOutcome: {
          yieldChange: 2.8,
          revenueChange: 420,
          confidence: 84
        }
      },
      {
        id: 'scenario_005',
        name: 'Delayed Harvest',
        description: 'Delay harvest by 1 week to maximize oil content',
        changes: [
          { factor: 'Oil Content', adjustment: 12 }
        ],
        predictedOutcome: {
          yieldChange: 1.2,
          revenueChange: 680,
          confidence: 78
        }
      },
      {
        id: 'scenario_006',
        name: 'Intensive Weed Control',
        description: 'Additional herbicide application to field edges',
        changes: [
          { factor: 'Weed Competition', adjustment: -75 }
        ],
        predictedOutcome: {
          yieldChange: 3.5,
          revenueChange: 520,
          confidence: 86
        }
      }
    ],
    alerts: [
      {
        id: 'alert_002',
        type: 'opportunity',
        title: 'Optimal Pollination Window',
        message: 'Perfect weather conditions for pollination this week. Expect above-average pod set.',
        impact: 'Potential 10-15% yield increase',
        created: '2025-01-05T07:30:00Z',
        fieldId: 'field_03',
        cropName: 'Oilseed Rape'
      }
    ],
    historicalAccuracy: [
      { season: '2024', predicted: 3.6, actual: 3.5, accuracy: 97 },
      { season: '2023', predicted: 3.2, actual: 3.4, accuracy: 94 },
      { season: '2022', predicted: 3.7, actual: 3.6, accuracy: 97 }
    ]
  }
];

// Mock AI System Status
export const mockAISystemStatus: AISystemStatus = {
  lastUpdate: '2025-01-05T09:30:00Z',
  nextUpdate: '2025-01-06T06:00:00Z',
  dataQuality: 'excellent',
  modelVersion: 'YieldForecaster v2.1.3',
  overallAccuracy: 89
};

// Helper function to get summary data for dashboard widget
export const getAISummaryData = () => {
  const totalFields = mockAIForecastData.length;
  const averageConfidence = Math.round(
    mockAIForecastData.reduce((sum, field) => sum + field.prediction.confidence, 0) / totalFields
  );
  
  const totalAlerts = mockAIForecastData.reduce((sum, field) => sum + field.alerts.length, 0);
  const totalRecommendations = mockAIForecastData.reduce((sum, field) => sum + field.recommendations.length, 0);
  
  const highPriorityRecommendations = mockAIForecastData
    .flatMap(field => field.recommendations)
    .filter(rec => rec.priority === 'high').length;

  const averageYieldChange = mockAIForecastData.reduce((sum, field) => {
    const change = ((field.prediction.predictedYield - field.prediction.currentYield) / field.prediction.currentYield) * 100;
    return sum + change;
  }, 0) / totalFields;

  return {
    totalFields,
    averageConfidence,
    totalAlerts,
    totalRecommendations,
    highPriorityRecommendations,
    averageYieldChange: Math.round(averageYieldChange * 10) / 10, // Round to 1 decimal
    systemStatus: mockAISystemStatus
  };
};

// Function to get top predictions for dashboard display
export const getTopPredictions = (limit: number = 3) => {
  return mockAIForecastData
    .sort((a, b) => b.prediction.confidence - a.prediction.confidence)
    .slice(0, limit)
    .map(field => ({
      fieldName: field.fieldName,
      cropName: field.cropName,
      prediction: field.prediction,
      highestImpactFactor: field.factors.reduce((prev, current) => 
        Math.abs(current.impact) > Math.abs(prev.impact) ? current : prev
      )
    }));
};

// Function to get active alerts for dashboard
export const getActiveAlerts = () => {
  return mockAIForecastData
    .flatMap(field => field.alerts)
    .sort((a, b) => {
      const priority = { critical: 3, warning: 2, opportunity: 1 };
      return priority[b.type] - priority[a.type];
    });
};

// Function to get urgent recommendations
export const getUrgentRecommendations = () => {
  return mockAIForecastData
    .flatMap(field => field.recommendations)
    .filter(rec => rec.priority === 'high')
    .sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return b.estimatedImpact.revenue - a.estimatedImpact.revenue;
    });
};
