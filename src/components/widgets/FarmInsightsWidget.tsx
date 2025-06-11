import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

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

interface FarmInsightsWidgetProps {
  insights: FarmInsight[];
  onViewAllInsights?: () => void;
  onInsightClick?: (insight: FarmInsight) => void;
}

const FarmInsightsWidget: React.FC<FarmInsightsWidgetProps> = ({ 
  insights, 
  onViewAllInsights,
  onInsightClick 
}) => {
  const getInsightIcon = (type: FarmInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-amber-600" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: FarmInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-96">
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Farm Insights</h2>
              <p className="text-sm text-gray-500">AI-powered recommendations</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">Updated 2h ago</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight) => (
            <div
              key={insight.id}
              className={`border-l-4 p-3 rounded-r-lg cursor-pointer hover:shadow-sm transition-shadow ${getPriorityColor(insight.priority)}`}
              onClick={() => onInsightClick?.(insight)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 text-sm">{insight.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{insight.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs">
                      {insight.aiGenerated && (
                        <div className="flex items-center gap-1">
                          <Brain className="w-3 h-3 text-indigo-500" />
                          <span className="text-indigo-600">AI</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Conf:</span>
                        <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}%
                        </span>
                      </div>
                      
                      {insight.estimatedImpact && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Impact:</span>
                          <span className="font-medium text-green-600 text-xs">{insight.estimatedImpact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {onViewAllInsights && (
        <div className="p-4 border-t border-gray-100 flex-shrink-0 text-center">
          <button
            onClick={onViewAllInsights}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
          >
            View All Insights →
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmInsightsWidget;