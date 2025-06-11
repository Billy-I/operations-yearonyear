import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export interface WeatherData {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy';
  temperature: number;
  rainfall: number;
}

interface WeatherWidgetProps {
  weatherData: WeatherData[];
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherData }) => {
  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return <Sun style={{ color: '#F59E0B' }} size={24} />; // Accent-1 400 (Yellow-Orange)
      case 'cloudy':
        return <Cloud style={{ color: '#6B7280' }} size={24} />; // Gray 500
      case 'rainy':
        return <CloudRain style={{ color: '#3B82F6' }} size={24} />; // Graph color-1 500 (Blue)
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-96">
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-lg font-semibold">Weather Forecast</h2>
        <p className="text-sm text-gray-500">5-day outlook</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {weatherData.map((day, index) => (
            <div
              key={day.date}
              className={`flex items-center justify-between py-2 ${
                index < weatherData.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {getWeatherIcon(day.condition)}
                <div>
                  <p className="font-medium text-sm">
                    {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{day.temperature}°C</p>
                <p className="text-xs text-gray-600">{day.rainfall}mm</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;