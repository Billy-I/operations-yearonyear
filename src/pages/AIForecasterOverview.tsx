import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Filter, Search, ChevronRight } from 'lucide-react';
import { mockAIForecastData, getAISummaryData, getActiveAlerts, getUrgentRecommendations } from '../data/aiForecasterMockData';

const AIForecasterOverview: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get summary data
  const summaryData = getAISummaryData();
  const activeAlerts = getActiveAlerts();
  const urgentRecommendations = getUrgentRecommendations();

  // Filter fields based on risk level and search term
  const filteredFields = mockAIForecastData.filter(field => {
    const matchesFilter = selectedFilter === 'all' || field.prediction.riskLevel === selectedFilter;
    const matchesSearch = searchTerm === '' || 
      field.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-status-success bg-status-success-light border-status-success/20';
      case 'medium': return 'text-status-warning bg-status-warning-light border-status-warning/20';
      case 'high': return 'text-status-error bg-status-error-light border-status-error/20';
      default: return 'text-neutral-500 bg-neutral-100 border-neutral-200';
    }
  };

  const getYieldChangeColor = (current: number, predicted: number) => {
    const change = predicted - current;
    if (change > 0) return 'text-status-success';
    if (change < 0) return 'text-status-error';
    return 'text-neutral-500';
  };

  const formatYieldChange = (current: number, predicted: number) => {
    const change = predicted - current;
    const percentage = ((change / current) * 100).toFixed(1);
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}t/ha (${sign}${percentage}%)`;
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
    <div className="p-4 md:p-6 bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-6 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="p-3 md:p-4 bg-white rounded-lg border border-gray-200 flex-shrink-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="heading-primary mb-1 md:mb-2 text-xl md:text-3xl">AI Yield Forecaster</h1>
              <p className="text-base md:text-lg text-muted">Machine learning predictions and recommendations for all your fields</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="metric-card">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 gradient-brand rounded-xl">
                  <Target className="w-4 h-4 md:w-6 md:h-6 text-brand-primary" />
                </div>
              </div>
              <div className="metric-value text-brand-primary mb-1 text-xl md:text-2xl">{summaryData.totalFields}</div>
              <div className="metric-label text-xs md:text-sm">Fields Monitored</div>
            </div>
            <div className="metric-card">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 gradient-success rounded-xl">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-status-success" />
                </div>
              </div>
              <div className="metric-value text-status-success mb-1 text-xl md:text-2xl">{summaryData.averageConfidence}%</div>
              <div className="metric-label text-xs md:text-sm">Avg Confidence</div>
            </div>
            <div className="metric-card">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 gradient-warning rounded-xl">
                  <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-status-warning" />
                </div>
              </div>
              <div className="metric-value text-status-warning mb-1 text-xl md:text-2xl">{summaryData.totalAlerts}</div>
              <div className="metric-label text-xs md:text-sm">Active Alerts</div>
            </div>
            <div className="metric-card">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                  <Zap className="w-4 h-4 md:w-6 md:h-6 text-brand-accent" />
                </div>
              </div>
              <div className={`metric-value mb-1 text-xl md:text-2xl ${summaryData.averageYieldChange >= 0 ? 'text-status-success' : 'text-status-error'}`}>
                {summaryData.averageYieldChange > 0 ? '+' : ''}{summaryData.averageYieldChange}%
              </div>
              <div className="metric-label text-xs md:text-sm">Avg Yield Change</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          
          {/* Main Content - Field Predictions */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            
            {/* Filters and Search */}
            <div className="glass-strong rounded-2xl p-4 md:p-6 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 gradient-brand rounded-lg">
                      <Filter className="w-4 h-4 md:w-5 md:h-5 text-brand-primary" />
                    </div>
                    <span className="text-emphasis text-sm md:text-base">Risk Level</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {(['all', 'low', 'medium', 'high'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                          selectedFilter === filter
                            ? 'bg-brand-primary text-white'
                            : 'bg-white/60 text-gray-700 border border-gray-200 hover:bg-white'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search fields or crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Field Predictions List */}
            <div className="space-y-4 md:space-y-6">
              {filteredFields.map((field) => (
                <div key={field.fieldId} className="field-card" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-3 md:mb-4">
                          <h3 className="heading-secondary text-lg md:text-xl">{field.fieldName}</h3>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted">
                            <span className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              {field.cropName}
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              {field.area} ha
                            </span>
                          </div>
                          <span className={`px-2 md:px-3 py-1 md:py-1.5 text-xs font-semibold rounded-full border-2 ${getRiskColor(field.prediction.riskLevel)}`}>
                            {field.prediction.riskLevel} risk
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
                          <div 
                            className="rounded-xl p-3 md:p-4 bg-white border border-neutral-200"
                            style={{
                              boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
                            }}
                          >
                            <p className="metric-label mb-1 md:mb-2 text-xs md:text-sm">Current Yield</p>
                            <p className="text-lg md:text-2xl font-bold text-gray-900">{field.prediction.currentYield}<span className="text-sm md:text-base font-normal text-muted">t/ha</span></p>
                          </div>
                          <div 
                            className="rounded-xl p-3 md:p-4 bg-neutral-100 border border-brand-primary/20"
                            style={{
                              boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
                            }}
                          >
                            <p className="metric-label mb-1 md:mb-2 text-xs md:text-sm">AI Prediction</p>
                            <p className="text-lg md:text-2xl font-bold text-brand-primary">{field.prediction.predictedYield}<span className="text-sm md:text-base font-normal text-muted">t/ha</span></p>
                          </div>
                          <div 
                            className={`rounded-xl p-3 md:p-4 sm:col-span-2 lg:col-span-1 border ${field.prediction.predictedYield > field.prediction.currentYield ? 'bg-status-success-light border-status-success/20' : 'bg-status-error-light border-status-error/20'}`}
                            style={{
                              boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
                            }}
                          >
                            <p className="metric-label mb-1 md:mb-2 text-xs md:text-sm">Expected Change</p>
                            <p className={`text-lg md:text-2xl font-bold ${getYieldChangeColor(field.prediction.currentYield, field.prediction.predictedYield)}`}>
                              {formatYieldChange(field.prediction.currentYield, field.prediction.predictedYield)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-6 mb-4 md:mb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-6 text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-status-success rounded-full"></div>
                              <span className="font-semibold text-gray-900">{field.prediction.confidence}% confidence</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                              <span className="text-muted">{field.recommendations.length} recommendations</span>
                            </div>
                            <span className="text-muted">Updated {formatDateTime(field.prediction.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/ai-forecaster/field/${field.fieldId}`)}
                        className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 text-sm font-semibold"
                      >
                        View Analysis
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Top Factors */}
                    <div className="border-t border-gray-100 pt-4 md:pt-6">
                      <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <span className="text-emphasis text-sm md:text-base">Key Influencing Factors</span>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {field.factors.slice(0, 3).map((factor, index) => (
                          <span
                            key={index}
                            className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg border bg-gray-50 text-gray-700 border-gray-200"
                          >
                            {factor.name} ({factor.impact > 0 ? '+' : ''}{factor.impact}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredFields.length === 0 && (
                <div className="bg-white p-8 rounded-lg border border-neutral-200 text-center shadow-sm">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No fields found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Alerts and Recommendations */}
          <div className="space-y-4 md:space-y-6">
            
            {/* Active Alerts */}
            <div className="glass-strong rounded-2xl p-4 md:p-6 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h3 className="heading-secondary mb-4 md:mb-6 text-lg md:text-xl">Active Alerts</h3>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm md:text-base">No active alerts</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {activeAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="glass-subtle rounded-xl p-3 md:p-4 border-l-4 border-l-warning-base">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className={`p-1.5 md:p-2 rounded-lg ${
                          alert.type === 'critical' ? 'gradient-danger' :
                          alert.type === 'warning' ? 'gradient-warning' :
                          'bg-gradient-to-br from-blue-50 to-indigo-100'
                        }`}>
                          <AlertTriangle className={`w-3 h-3 md:w-4 md:h-4 ${
                            alert.type === 'critical' ? 'text-danger-base' :
                            alert.type === 'warning' ? 'text-warning-base' :
                            'text-information-base'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-emphasis mb-1 text-sm md:text-base">{alert.title}</h4>
                          <p className="text-xs md:text-sm text-muted">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Urgent Recommendations */}
            <div className="glass-strong rounded-2xl p-4 md:p-6 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h3 className="heading-secondary mb-4 md:mb-6 text-lg md:text-xl">Urgent Recommendations</h3>
              {urgentRecommendations.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm md:text-base">No urgent recommendations</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {urgentRecommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-3 border border-secondary-base rounded-lg">
                      <p className="font-medium text-gray-900 text-xs md:text-sm mb-1">{rec.title}</p>
                      <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-success-base">+£{rec.estimatedImpact.revenue}</span>
                        {rec.deadline && (
                          <span className="text-warning-base">Due: {formatDateTime(rec.deadline)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="glass-strong rounded-2xl p-4 md:p-6 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h3 className="heading-secondary mb-4 md:mb-6 text-lg md:text-xl">System Status</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Model Version</span>
                  <span className="text-xs md:text-sm font-medium">{summaryData.systemStatus.modelVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Overall Accuracy</span>
                  <span className="text-xs md:text-sm font-medium text-yagro-brand">{summaryData.systemStatus.overallAccuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Data Quality</span>
                  <span className={`text-xs md:text-sm font-medium ${
                    summaryData.systemStatus.dataQuality === 'excellent' ? 'text-success-base' : 'text-warning-base'
                  }`}>
                    {summaryData.systemStatus.dataQuality}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Last Update</span>
                  <span className="text-xs md:text-sm">{formatDateTime(summaryData.systemStatus.lastUpdate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIForecasterOverview;
