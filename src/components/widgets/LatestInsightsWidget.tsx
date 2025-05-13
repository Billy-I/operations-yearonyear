import React, { useState } from 'react';
import { InsightData } from '../../data/dashboardMockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LatestInsightsWidgetProps {
  insights: InsightData[];
}

const LatestInsightsWidget: React.FC<LatestInsightsWidgetProps> = ({ insights }) => {
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);

  const toggleExpand = (insightId: string) => {
    setExpandedInsightId(prevId => (prevId === insightId ? null : insightId));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Latest Insights</h2>
      <div className="space-y-4">
        {insights.map(insight => (
          <div key={insight.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-1 text-base">{insight.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{insight.summary}</p>
                <span className="text-xs text-gray-500">{new Date(insight.date).toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => toggleExpand(insight.id)}
                className="text-blue-600 hover:text-blue-800 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={expandedInsightId === insight.id}
                aria-controls={`insight-content-${insight.id}`}
              >
                {expandedInsightId === insight.id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
                <span className="sr-only">{expandedInsightId === insight.id ? 'See less' : 'See more'}</span>
              </button>
            </div>

            {expandedInsightId === insight.id && (
              <div id={`insight-content-${insight.id}`} className="mt-4 pt-4 border-t border-gray-200">
                {insight.contentType === 'text' && (
                  <p className="text-gray-700 text-sm whitespace-pre-line">{insight.expandedContent}</p>
                )}
                {insight.contentType === 'graph_placeholder' && (
                  <div>
                    <img 
                      src={insight.expandedContent} 
                      alt={`${insight.title} - graph`} 
                      className="w-full h-auto rounded-md border border-gray-300" 
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Graph placeholder. Actual chart component will be implemented later.
                    </p>
                  </div>
                )}
                {insight.link && (
                   <div className="mt-3 text-right">
                     <a href={insight.link} className="text-blue-600 text-sm hover:underline">
                       Go to details →
                     </a>
                   </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestInsightsWidget;