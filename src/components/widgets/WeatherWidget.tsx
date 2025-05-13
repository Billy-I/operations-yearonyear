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
        return <Sun className="text-yellow-500" size={24} />;
      case 'cloudy':
        return <Cloud className="text-gray-500" size={24} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Weather Forecast</h2>
      <div className="space-y-4">
        {weatherData.map((day, index) => (
          <div 
            key={day.date} 
            className={`flex items-center justify-between ${
              index < weatherData.length - 1 ? 'border-b border-gray-100 pb-4' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {getWeatherIcon(day.condition)}
              <div>
                <p className="font-medium">
                  {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{day.temperature}°C</p>
              <p className="text-sm text-gray-600">{day.rainfall}mm</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;