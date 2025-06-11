import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MockMultiYearTrendsDataType, MetricTrend } from '../../data/dashboardMockData'; // Adjust path as needed

interface MultiYearTrendsWidgetProps {
  trendsData: MockMultiYearTrendsDataType;
}

const MultiYearTrendsWidget: React.FC<MultiYearTrendsWidgetProps> = ({ trendsData }) => {
  const metricKeys = Object.keys(trendsData.availableMetrics);
  const initialMetricKey = trendsData.availableMetrics['totalCosts'] ? 'totalCosts' : (metricKeys[0] || '');
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>(initialMetricKey);

  const selectedMetric: MetricTrend | undefined = trendsData.availableMetrics[selectedMetricKey];

  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMetricKey(event.target.value);
  };

  if (!selectedMetric) {
    return (
      <div 
        className="p-6 h-full flex flex-col"
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Multi-Year Trends</h3>
        <p className="text-gray-500">No trend data available.</p>
      </div>
    );
  }

  return (
    <div 
      className="p-6 h-full flex flex-col"
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Multi-Year Trends</h3>
        {metricKeys.length > 1 && (
          <select 
            value={selectedMetricKey}
            onChange={handleMetricChange}
            className="p-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {metricKeys.map(key => (
              <option key={key} value={key}>
                {trendsData.availableMetrics[key].label}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mb-1">Displaying: <span className="font-semibold">{selectedMetric.label}</span></p>
      <p className="text-xs text-gray-400 mb-3">{trendsData.contextName}</p>

      <div className="h-52 w-full flex-grow" > {/* Adjusted height for better fit */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={selectedMetric.history} 
            margin={{ top: 5, right: 25, left: -10, bottom: 5 }} // Adjusted margins
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280' }} />
            <YAxis 
              tick={{ fontSize: 10, fill: '#6b7280' }} 
              domain={['dataMin - 10', 'dataMax + 10']} // Dynamic domain with padding
              label={{ value: selectedMetric.unit, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' , dx: -5}}
            />
            <Tooltip 
              contentStyle={{ fontSize: 12, borderRadius: '4px', padding: '4px 8px'}} 
              itemStyle={{ fontSize: 12 }}
              formatter={(value: number) => [`${value} ${selectedMetric.unit}`, selectedMetric.label]}
            />
            <Legend verticalAlign="top" height={25} iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
            <Line 
              type="monotone" 
              dataKey="value" 
              name={selectedMetric.label} // Name for Legend
              stroke="#05976A" 
              strokeWidth={2} 
              dot={{ r: 3, fill: '#05976A' }} 
              activeDot={{ r: 5, fill: '#047857' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button 
        className="mt-4 w-full text-white font-semibold py-2 px-4 transition duration-150 ease-in-out"
        style={{ 
          borderRadius: '8px',
          backgroundColor: '#006838'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#004D28';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#006838';
        }}
      >
        View Full Multi-Year Report
      </button>
    </div>
  );
};

export default MultiYearTrendsWidget;
