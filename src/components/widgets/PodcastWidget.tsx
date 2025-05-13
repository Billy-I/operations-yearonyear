import React from 'react';
import { PodcastEpisode } from '../../data/dashboardMockData';

interface PodcastWidgetProps {
  episodes: PodcastEpisode[];
}

const PodcastWidget: React.FC<PodcastWidgetProps> = ({ episodes }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Latest Podcasts</h2>
      <div className="space-y-6">
        {episodes.map((episode, index) => (
          <div 
            key={episode.id} 
            className={index === 0 ? 'border-b border-gray-100 pb-6' : ''}
          >
            <div className="flex gap-4">
              <img 
                src={episode.cover_art_url} 
                alt={episode.episode_title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1">{episode.episode_title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  with {episode.guest_name}
                </p>
                <p className="text-sm text-gray-500 mb-2">
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