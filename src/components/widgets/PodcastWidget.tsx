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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Latest Podcasts</h2>
      <div className="space-y-4 max-h-[440px] overflow-y-auto">
        {episodes.map((episode, index) => (
          <div 
            key={episode.id} 
            className={`${
              index < episodes.length - 1 ? 'border-b border-gray-100 pb-4' : ''
            }`}
          >
            <div className="flex gap-4">
              {failedImages[episode.id] ? (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <img
                  src={episode.cover_art_url}
                  alt={episode.episode_title}
                  className="w-20 h-20 object-cover rounded"
                  onError={() => handleImageError(episode.id)}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1 text-base truncate">
                  {episode.episode_title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  with {episode.guest_name}
                </p>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {episode.description_snippet}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{episode.duration}</span>
                  <a 
                    href={episode.spotify_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    Listen on Spotify →
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastWidget;