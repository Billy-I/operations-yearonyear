import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Calendar, Target, ChevronRight, Brain, Zap } from 'lucide-react';
import { getAISummaryData, getTopPredictions, getActiveAlerts, getUrgentRecommendations } from '../../data/aiForecasterMockData';

interface AIYieldForecasterWidgetProps {
  className?: string;
}

const AIYieldForecasterWidget: React.FC<AIYieldForecasterWidgetProps> = ({ className = '' }) => {
  const [selectedTab, setSelectedTab] = useState<'predictions' | 'alerts' | 'recommendations'>('predictions');

  // Get data from mock functions
  const summaryData = getAISummaryData();
  const topPredictions = getTopPredictions(3);
  const activeAlerts = getActiveAlerts();
  const urgentRecommendations = getUrgentRecommendations();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success-base bg-success-light border-success-base/20';
      case 'medium': return 'text-warning-base bg-warning-light border-warning-base/20';
      case 'high': return 'text-danger-base bg-danger-light border-danger-base/20';
      default: return 'text-gray-600 bg-secondary-light border-secondary-base';
    }
  };

  const getYieldChangeColor = (current: number, predicted: number) => {
    const change = predicted - current;
    if (change > 0) return 'text-success-base';
    if (change < 0) return 'text-danger-base';
    return 'text-gray-600';
  };

  const formatYieldChange = (current: number, predicted: number) => {
    const change = predicted - current;
    const percentage = ((change / current) * 100).toFixed(1);
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}t/ha (${sign}${percentage}%)`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return 'text-danger-base';
      case 'warning': return 'text-warning-base';
      case 'opportunity': return 'text-information-base';
      default: return 'text-gray-600';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`glass-strong rounded-2xl border-0 p-8 ${className}`} style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div 
            className="p-3"
            style={{
              background: 'rgba(0, 104, 56, 0.1)',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Brain className="w-8 h-8 text-yagro-brand" />
          </div>
          <div>
            <h3 className="heading-secondary">AI Yield Forecaster</h3>
            <p className="text-muted">Machine learning predictions for your crops</p>
          </div>
        </div>
        <button className="btn-primary inline-flex items-center gap-2">
          View Full Analysis
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="text-center p-4"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
          }}
        >
          <div className="metric-value text-gray-900 mb-1">{summaryData.totalFields}</div>
          <div className="metric-label">Fields Monitored</div>
        </div>
        <div 
          className="text-center p-4"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
          }}
        >
          <div className="metric-value text-success-base mb-1">{summaryData.averageConfidence}%</div>
          <div className="metric-label">Avg Confidence</div>
        </div>
        <div 
          className="text-center p-4"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
          }}
        >
          <div className="metric-value text-warning-base mb-1">{summaryData.totalAlerts}</div>
          <div className="metric-label">Active Alerts</div>
        </div>
        <div 
          className="text-center p-4"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
          }}
        >
          <div className={`metric-value mb-1 ${summaryData.averageYieldChange >= 0 ? 'text-success-base' : 'text-danger-base'}`}>
            {summaryData.averageYieldChange > 0 ? '+' : ''}{summaryData.averageYieldChange}%
          </div>
          <div className="metric-label">Yield Change</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8">
        {(['predictions', 'alerts', 'recommendations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              selectedTab === tab
                ? 'bg-yagro-brand text-white'
                : 'bg-white/60 text-gray-700 border border-gray-200 hover:bg-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {selectedTab === 'predictions' && (
          <>
            {topPredictions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.fieldName}</span>
                    <span className="text-sm text-gray-600">• {item.cropName}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getRiskColor(item.prediction.riskLevel)}`}>
                      {item.prediction.riskLevel} risk
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Predicted: </span>
                      <span className="font-medium">{item.prediction.predictedYield}t/ha</span>
                    </div>
                    <div className={getYieldChangeColor(item.prediction.currentYield, item.prediction.predictedYield)}>
                      {formatYieldChange(item.prediction.currentYield, item.prediction.predictedYield)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.prediction.confidence}%</div>
                  <div className="text-xs text-gray-600">confidence</div>
                </div>
              </div>
            ))}
          </>
        )}

        {selectedTab === 'alerts' && (
          <>
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No active alerts</p>
                <p className="text-sm">All fields are performing optimally</p>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${getAlertIcon(alert.type)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{alert.title}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        alert.type === 'critical' ? 'bg-red-100 text-red-700' :
                        alert.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{alert.cropName}</span>
                      <span>{formatDateTime(alert.created)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {selectedTab === 'recommendations' && (
          <>
            {urgentRecommendations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No urgent recommendations</p>
                <p className="text-sm">Your fields are well managed</p>
              </div>
            ) : (
              urgentRecommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{rec.title}</span>
                    <span 
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: rec.priority === 'high' ? '#FEF2F2' : rec.priority === 'medium' ? '#FFFBEB' : '#F0FDF4',
                        color: rec.priority === 'high' ? '#DC2626' : rec.priority === 'medium' ? '#F59E0B' : '#059855'
                      }}
                    >
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                                      <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{rec.actionRequired}</span>
                      <div className="flex items-center gap-3">
                        <span style={{ color: '#059855' }}>+£{rec.estimatedImpact.revenue}</span>
                        {rec.deadline && (
                          <span style={{ color: '#F59E0B' }}>Due: {formatDateTime(rec.deadline)}</span>
                        )}
                      </div>
                    </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#059855' }}></div>
          <span>System Active • {summaryData.systemStatus.overallAccuracy}% accuracy</span>
        </div>
        <span>Updated: {formatDateTime(summaryData.systemStatus.lastUpdate)}</span>
      </div>
    </div>
  );
};

export default AIYieldForecasterWidget;
