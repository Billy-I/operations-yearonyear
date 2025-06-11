import React, { useState, useEffect } from 'react';
import { InsightData } from '../../data/dashboardMockData';
import ViewSwitcher from '../common/ViewSwitcher';

interface LatestInsightsWidgetProps {
  insights: InsightData[];
}

const LatestInsightsWidget: React.FC<LatestInsightsWidgetProps> = ({ insights }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : insights.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < insights.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Add/remove keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentInsight = insights[currentIndex];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Latest Insights</h2>
        <ViewSwitcher 
          currentIndex={currentIndex}
          totalItems={insights.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>

      <div className="space-y-4">
        <div key={currentInsight.id}>
          <div>
            <h3 className="font-medium mb-2 text-base">{currentInsight.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{currentInsight.summary}</p>
            
            {/* Expanded content is always visible */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {currentInsight.contentType === 'text' && (
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {currentInsight.expandedContent}
                </p>
              )}
              {currentInsight.contentType === 'graph_placeholder' && (
                <div>
                  <img 
                    src={currentInsight.expandedContent} 
                    alt={`${currentInsight.title} - graph`} 
                    className="w-full h-auto rounded-md border border-gray-300" 
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Graph placeholder. Actual chart component will be implemented later.
                  </p>
                </div>
              )}
              {currentInsight.link && (
                <div className="mt-3 text-right">
                  <a 
                    href={currentInsight.link} 
                    className="text-sm hover:underline"
                    style={{ color: '#006838' }}
                  >
                    Go to details →
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              {new Date(currentInsight.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestInsightsWidget;