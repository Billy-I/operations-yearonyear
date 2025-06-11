import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Target, 
  ArrowLeft, 
  MessageSquare,
  Send,
  ChevronDown,
  BarChart3,
  Lightbulb,
  Clock,
  DollarSign
} from 'lucide-react';
import { mockAIForecastData } from '../data/aiForecasterMockData';
import { AIForecastData, InfluenceFactor } from '../types/aiForecaster';

const FieldAnalysisPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai';
    message: string;
    timestamp: string;
  }>>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<string>(''); // Track which scenario is being analyzed
  const [scenarioAnalysis, setScenarioAnalysis] = useState<{[key: string]: string}>({}); // Store analysis results

  // Find the field data
  const fieldData = mockAIForecastData.find(field => field.fieldId === fieldId);

  if (!fieldData) {
    return (
      <div className="p-6 bg-neutral-100 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Field Not Found</h1>
          <button 
            onClick={() => navigate('/ai-forecaster')}
            className="text-brand-primary hover:text-brand-primary-dark"
          >
            Return to AI Forecaster
          </button>
        </div>
      </div>
    );
  }

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

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    // Add user message
    const newUserMessage = {
      type: 'user' as const,
      message: chatMessage,
      timestamp: new Date().toISOString()
    };

    // Generate AI response based on the message
    const aiResponse = generateAIResponse(chatMessage, fieldData);
    const newAIMessage = {
      type: 'ai' as const,
      message: aiResponse,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newUserMessage, newAIMessage]);
    setChatMessage('');
  };

  const generateAIResponse = (userMessage: string, field: AIForecastData): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('yield') || message.includes('production')) {
      return `Based on current conditions, I predict your ${field.cropName} yield will be ${field.prediction.predictedYield}t/ha, which is ${formatYieldChange(field.prediction.currentYield, field.prediction.predictedYield)}. This prediction has ${field.prediction.confidence}% confidence. The main factors influencing this are ${field.factors.slice(0, 2).map(f => f.name.toLowerCase()).join(' and ')}.`;
    }
    
    if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      const weatherFactor = field.factors.find(f => f.category === 'weather');
      if (weatherFactor) {
        return `Weather conditions are currently ${weatherFactor.impact > 0 ? 'favorable' : 'challenging'} for your ${field.cropName}. ${weatherFactor.description}. This is contributing a ${weatherFactor.impact > 0 ? '+' : ''}${weatherFactor.impact}% impact to your yield prediction.`;
      }
    }
    
    if (message.includes('recommend') || message.includes('advice') || message.includes('should')) {
      const topRecommendation = field.recommendations[0];
      if (topRecommendation) {
        return `I recommend: ${topRecommendation.title}. ${topRecommendation.description} This could potentially increase your yield by ${topRecommendation.estimatedImpact.yield}% and add £${topRecommendation.estimatedImpact.revenue} in revenue. ${topRecommendation.actionRequired}`;
      }
    }
    
    if (message.includes('confidence') || message.includes('accurate') || message.includes('sure')) {
      return `My prediction confidence for ${field.fieldName} is ${field.prediction.confidence}%. This is based on historical accuracy of ${field.prediction.accuracy}% for ${field.cropName}. The confidence level reflects data quality, weather forecast reliability, and historical model performance for similar conditions.`;
    }
    
    if (message.includes('risk') || message.includes('problem') || message.includes('concern')) {
      return `Current risk level for ${field.fieldName} is ${field.prediction.riskLevel}. ${field.alerts.length > 0 ? `Active concerns include: ${field.alerts[0].title} - ${field.alerts[0].message}` : 'No immediate risks detected based on current conditions and forecasts.'}`;
    }
    
    if (message.includes('factor') || message.includes('influence') || message.includes('affect')) {
      const topFactors = field.factors.slice(0, 3);
      return `The main factors affecting your ${field.cropName} yield are: ${topFactors.map(f => `${f.name} (${f.impact > 0 ? '+' : ''}${f.impact}%)`).join(', ')}. ${topFactors[0].description}`;
    }
    
    // Default response
    return `I can help you analyze your ${field.fieldName} with ${field.cropName}. Current prediction is ${field.prediction.predictedYield}t/ha with ${field.prediction.confidence}% confidence. Ask me about yield predictions, weather impacts, recommendations, or specific factors affecting your crop.`;
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

  const handleScenarioChange = async (scenarioId: string) => {
    setIsAnalyzing(scenarioId);
    setSelectedScenario(scenarioId);
    
    // Simulate analysis time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add AI message about scenario
    const scenario = fieldData.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      const detailedAnalysis = generateDetailedScenarioAnalysis(scenario, fieldData);
      
      // Store analysis in both chat and visible results
      const aiMessage = {
        type: 'ai' as const,
        message: detailedAnalysis,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiMessage]);
      
      // Store analysis for visible display
      setScenarioAnalysis(prev => ({
        ...prev,
        [scenarioId]: detailedAnalysis
      }));
    }
    
    setIsAnalyzing('');
  };

  const generateDetailedScenarioAnalysis = (scenario: any, field: AIForecastData): string => {
    const outcome = scenario.predictedOutcome;
    const yieldChangeText = outcome.yieldChange > 0 ? 'increase' : 'decrease';
    const revenueChangeText = outcome.revenueChange > 0 ? 'gain' : 'loss';
    const yieldImpact = (field.prediction.predictedYield * (outcome.yieldChange/100)).toFixed(1);
    
    let analysis = `✅ ${scenario.name} Analysis Complete\n\n`;
    analysis += `Scenario: ${scenario.description}\n\n`;
    analysis += `Predicted Outcomes:\n`;
    analysis += `• Yield ${yieldChangeText}: ${Math.abs(outcome.yieldChange)}% (${outcome.yieldChange > 0 ? '+' : ''}${yieldImpact}t/ha)\n`;
    analysis += `• Revenue impact: ${outcome.revenueChange > 0 ? '+' : ''}£${Math.abs(outcome.revenueChange)} ${revenueChangeText}\n`;
    analysis += `• Confidence level: ${outcome.confidence}%\n\n`;
    
    // Add impact assessment
    if (Math.abs(outcome.yieldChange) > 10) {
      analysis += `⚠️ High Impact Scenario\n`;
      analysis += `This change would significantly affect your farm's performance. Consider carefully before implementing.\n\n`;
    } else if (Math.abs(outcome.yieldChange) > 5) {
      analysis += `📊 Moderate Impact\n`;
      analysis += `Noticeable change to field performance. Review costs and benefits.\n\n`;
    } else {
      analysis += `📈 Low Impact\n`;
      analysis += `Minor adjustment to current predictions. Low risk implementation.\n\n`;
    }
    
    // Add recommendation based on outcome
    if (outcome.yieldChange > 0 && outcome.revenueChange > 0) {
      analysis += `💡 Recommendation\n`;
      analysis += `This scenario shows positive returns. Consider implementing if field conditions and resources allow.`;
    } else if (outcome.yieldChange < 0 || outcome.revenueChange < 0) {
      analysis += `⚠️ Caution\n`;
      analysis += `This scenario may reduce performance. Only consider if necessary for risk management or field constraints require it.`;
    } else {
      analysis += `📋 Neutral Impact\n`;
      analysis += `This scenario maintains similar performance levels. Choose based on operational preferences.`;
    }
    
    return analysis;
  };

  return (
    <div className="p-3 md:p-6 bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <button 
            onClick={() => navigate('/ai-forecaster')}
            className="flex items-center gap-2 text-brand-primary hover:text-brand-primary-dark mb-4 md:mb-6 transition-colors font-medium text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back to Overview
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 md:mb-6">
            <div className="p-3 md:p-4 gradient-brand rounded-xl md:rounded-2xl" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">{fieldData.fieldName}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm md:text-base text-gray-600">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  {fieldData.cropName}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  {fieldData.area} hectares
                </span>
                <span className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full border-2 ${getRiskColor(fieldData.prediction.riskLevel)}`}>
                  {fieldData.prediction.riskLevel} risk
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Main Analysis Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            
            {/* Prediction Overview */}
            <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-8 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-8">AI Prediction Analysis</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
                <div 
                  className="rounded-lg md:rounded-xl p-4 md:p-6 text-center bg-white border border-neutral-200"
                  style={{
                    boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
                  }}
                >
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">Current Estimate</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{fieldData.prediction.currentYield}<span className="text-sm md:text-lg font-normal text-gray-600">t/ha</span></p>
                </div>
                <div 
                  className="rounded-lg md:rounded-xl p-4 md:p-6 text-center bg-neutral-100 border border-brand-primary/20"
                  style={{
                    boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
                  }}
                >
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">AI Prediction</p>
                  <p className="text-lg md:text-2xl font-bold text-brand-primary">{fieldData.prediction.predictedYield}<span className="text-sm md:text-lg font-normal text-gray-600">t/ha</span></p>
                </div>
                <div 
                  className={`sm:col-span-2 md:col-span-1 rounded-lg md:rounded-xl p-4 md:p-6 text-center border ${fieldData.prediction.predictedYield > fieldData.prediction.currentYield ? 'bg-status-success-light border-status-success/20' : 'bg-status-error-light border-status-error/20'}`}
                  style={{
                    boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)'
                  }}
                >
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">Expected Change</p>
                  <p className={`text-base md:text-xl font-bold ${getYieldChangeColor(fieldData.prediction.currentYield, fieldData.prediction.predictedYield)}`}>
                    {formatYieldChange(fieldData.prediction.currentYield, fieldData.prediction.predictedYield)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-status-success rounded-full"></div>
                  <span className="text-sm md:text-base font-medium text-gray-900">Confidence Level: {fieldData.prediction.confidence}%</span>
                </div>
                <span className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full border-2 ${getRiskColor(fieldData.prediction.riskLevel)}`}>
                  {fieldData.prediction.riskLevel} risk
                </span>
              </div>

              <div className="glass-subtle rounded-lg md:rounded-xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-4 md:mb-6">Key Influencing Factors</h3>
                <div className="space-y-3 md:space-y-4">
                  {fieldData.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-white/60 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-900 text-sm md:text-base">{factor.name}</span>
                      <span className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                        {factor.impact > 0 ? '+' : ''}{factor.impact}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-8 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-8">AI Recommendations</h2>
              <div className="space-y-4 md:space-y-6">
                {fieldData.recommendations.map((rec) => (
                  <div key={rec.id} className="glass-subtle rounded-lg md:rounded-xl p-4 md:p-6 border-l-4 border-l-brand-primary">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 md:mb-4">
                      <h3 className="text-base md:text-lg font-medium text-gray-900">{rec.title}</h3>
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 text-xs font-semibold rounded-lg border-2 ${
                        rec.priority === 'high' ? 'border-status-error/20 bg-status-error-light text-status-error-dark' :
                        rec.priority === 'medium' ? 'border-status-warning/20 bg-status-warning-light text-status-warning-dark' :
                        'border-status-success/20 bg-status-success-light text-status-success-dark'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{rec.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs md:text-sm text-gray-600">{rec.actionRequired}</span>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-status-success rounded-full"></div>
                          <span className="text-xs md:text-sm font-semibold text-status-success">+{rec.estimatedImpact.yield}% yield</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-status-success rounded-full"></div>
                          <span className="text-xs md:text-sm font-semibold text-status-success">+£{rec.estimatedImpact.revenue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Analysis */}
            {fieldData.scenarios.length > 0 && (
              <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-8 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-8">What-If Scenarios</h2>
                <div className="space-y-4 md:space-y-6">
                  {fieldData.scenarios.map((scenario) => (
                    <div key={scenario.id} className="glass-subtle rounded-lg md:rounded-xl p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 md:mb-4">
                        <h3 className="text-base md:text-lg font-medium text-gray-900">{scenario.name}</h3>
                        <button
                          onClick={() => handleScenarioChange(scenario.id)}
                          disabled={isAnalyzing === scenario.id}
                          className={`btn-primary inline-flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2 md:py-2.5 ${
                            isAnalyzing === scenario.id
                              ? 'opacity-60 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          {isAnalyzing === scenario.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Analyzing...
                            </>
                          ) : (
                            'Analyze Impact'
                          )}
                        </button>
                      </div>
                      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{scenario.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-sm mb-3 md:mb-4">
                        <div>
                          <span className="text-gray-600">Yield Change:</span>
                          <span className={`ml-2 font-medium ${scenario.predictedOutcome.yieldChange > 0 ? 'text-status-success' : 'text-status-error'}`}>
                            {scenario.predictedOutcome.yieldChange > 0 ? '+' : ''}{scenario.predictedOutcome.yieldChange}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue Impact:</span>
                          <span className={`ml-2 font-medium ${scenario.predictedOutcome.revenueChange > 0 ? 'text-status-success' : 'text-status-error'}`}>
                            {scenario.predictedOutcome.revenueChange > 0 ? '+' : ''}£{scenario.predictedOutcome.revenueChange}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <span className="ml-2 font-medium text-brand-primary">{scenario.predictedOutcome.confidence}%</span>
                        </div>
                      </div>
                      
                      {/* AI Analysis Results */}
                      {scenarioAnalysis[scenario.id] && (
                        <div 
                          className="mt-6 rounded-2xl p-6 animate-slide-in-up"
                          style={{
                            background: '#FAFAFA',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 gradient-brand rounded-xl animate-pulse-once" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
                              <Brain className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-emphasis">AI Analysis Complete</h4>
                                <div className="w-2 h-2 bg-status-success rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-sm text-muted">Scenario impact assessment</p>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-800 leading-relaxed space-y-3">
                              {scenarioAnalysis[scenario.id].split('\n\n').map((paragraph, index) => {
                                if (paragraph.includes('**') || paragraph.includes('✅') || paragraph.includes('⚠️') || paragraph.includes('💡') || paragraph.includes('📊') || paragraph.includes('📈') || paragraph.includes('📋')) {
                                  // Format special sections with better styling
                                  const cleanText = paragraph.replace(/\*\*/g, '').replace(/✅|⚠️|💡|📊|📈|📋/g, '');
                                  const icon = paragraph.match(/✅|⚠️|💡|📊|📈|📋/)?.[0] || '';
                                  
                                  if (paragraph.includes('Analysis Complete')) {
                                    return null; // Skip this as we handle it in header
                                  }
                                  
                                  if (paragraph.includes('Predicted Outcomes:') || paragraph.includes('Scenario:')) {
                                    return (
                                      <div key={index} className="glass-subtle rounded-lg p-4 border border-gray-200">
                                        <div className="font-medium text-gray-900 mb-2">{cleanText}</div>
                                      </div>
                                    );
                                  }
                                  
                                  if (paragraph.includes('Recommendation:') || paragraph.includes('Caution:') || paragraph.includes('Impact')) {
                                    const isRecommendation = paragraph.includes('Recommendation:');
                                    const isCaution = paragraph.includes('Caution:');
                                    const isImpact = paragraph.includes('Impact');
                                    
                                    return (
                                      <div key={index} className={`rounded-lg p-4 border-l-4 ${
                                        isRecommendation ? 'border-l-status-success bg-status-success-light' :
                                        isCaution ? 'border-l-status-warning bg-status-warning-light' :
                                        'border-l-brand-accent bg-status-success-light'
                                      }`}>
                                        <div className="flex items-start gap-3">
                                          <span className="text-lg">{icon}</span>
                                          <span className="font-medium text-gray-900">{cleanText}</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <div key={index} className="font-medium text-gray-900">
                                      {paragraph}
                                    </div>
                                  );
                                } else if (paragraph.includes('•')) {
                                  // Format bullet points
                                  const lines = paragraph.split('\n');
                                  return (
                                    <div key={index} className="space-y-2">
                                      {lines.map((line, lineIndex) => {
                                        if (line.includes('•')) {
                                          return (
                                            <div key={lineIndex} className="flex items-center gap-3">
                                              <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                              <span className="text-gray-700">{line.replace('•', '').trim()}</span>
                                            </div>
                                          );
                                        }
                                        return line && <div key={lineIndex} className="text-gray-700">{line}</div>;
                                      })}
                                    </div>
                                  );
                                } else {
                                  return paragraph && (
                                    <div key={index} className="text-gray-700">
                                      {paragraph}
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar - AI Chat hidden on mobile, other content always visible */}
          <div className="space-y-4 md:space-y-6">
            
            {/* Interactive AI Chat - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col h-96 glass-strong rounded-xl md:rounded-2xl border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h3 className="text-base md:text-lg font-medium text-gray-900 flex items-center gap-3 mb-2">
                  <div className="p-2 gradient-brand rounded-lg">
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-brand-primary" />
                  </div>
                  AI Assistant
                </h3>
                <p className="text-sm md:text-base text-gray-600">Get insights about your field predictions</p>
              </div>
              
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-center text-gray-600 py-8">
                    <div className="p-3 md:p-4 gradient-brand rounded-xl md:rounded-2xl w-fit mx-auto mb-4">
                      <Brain className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
                    </div>
                    <p className="font-medium text-sm md:text-base">Ask me anything about your {fieldData.cropName} predictions!</p>
                    <div className="mt-4 space-y-2 text-xs md:text-sm">
                      <p className="text-brand-primary">"What affects my yield?"</p>
                      <p className="text-brand-primary">"Should I apply fertilizer?"</p>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm p-3 md:p-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium ${
                      chat.type === 'user' 
                        ? 'bg-brand-primary text-white' 
                        : 'glass-subtle text-gray-900 border border-gray-200'
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 md:p-6 border-t border-gray-100">
                <div className="flex gap-2 md:gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about yields, weather, recommendations..."
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white/80"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="btn-primary p-2 md:p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-4 md:mb-6">Quick Questions</h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  "What factors affect my yield?",
                  "Should I apply fertilizer now?",
                  "What's my risk level?",
                  "How confident is this prediction?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setChatMessage(question);
                      handleSendMessage();
                    }}
                    className="w-full text-left p-2 md:p-3 text-xs md:text-sm font-medium text-gray-700 hover:bg-white/80 rounded-lg glass-subtle border border-gray-200 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Historical Accuracy - Always visible */}
            <div className="glass-strong rounded-xl md:rounded-2xl p-4 md:p-6 border-0" style={{ boxShadow: '0 0 6px 0 rgba(194, 196, 197, 0.2)' }}>
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-4 md:mb-6">Historical Accuracy</h3>
              <div className="space-y-3 md:space-y-4">
                {fieldData.historicalAccuracy.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass-subtle rounded-lg border border-gray-200">
                    <span className="text-sm md:text-base text-gray-600">{record.season}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                      <span className="text-sm md:text-base font-semibold text-brand-primary">{record.accuracy}% accurate</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldAnalysisPage;
