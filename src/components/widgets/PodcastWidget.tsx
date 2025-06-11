import React, { useState } from 'react';
import { PodcastEpisode } from '../../data/dashboardMockData';

interface PodcastWidgetProps {
  episodes: PodcastEpisode[];
}

const PodcastWidget: React.FC<PodcastWidgetProps> = ({ episodes }) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (episodeId: string) => {
    setFailedImages(prev => ({ ...prev, [episodeId]: true }));
  };
  return (
    <div
      className="p-6 relative overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Latest Podcasts</h2>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-3 max-h-[440px] overflow-y-auto">
          {episodes.map((episode, index) => (
            <div
              key={episode.id}
              className={`group hover:bg-gray-50 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm ${
                index < episodes.length - 1 ? 'border-b border-gray-100 border-opacity-50 pb-4 mb-3' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 flex-shrink-0 relative">
                  {failedImages[episode.id] ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={episode.cover_art_url}
                      alt={episode.episode_title}
                      className="w-full h-full object-cover rounded-xl shadow-md border border-gray-200"
                      onError={() => handleImageError(episode.id)}
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black opacity-10"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 text-base truncate text-gray-900 group-hover:text-purple-600 transition-colors">
                    {episode.episode_title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    with <span className="text-purple-600 font-medium">{episode.guest_name}</span>
                  </p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                    {episode.description_snippet}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{episode.duration}</span>
                    <a
                      href={episode.spotify_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 px-4 py-2 rounded-full transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                      Play
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastWidget;