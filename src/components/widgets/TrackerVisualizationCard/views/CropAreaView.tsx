import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';

interface CropAreaData {
  year: string;
  [key: string]: string | number;
}

interface CropAreaViewProps {
  data: {
    [year: string]: {
      [crop: string]: number;
    };
  };
}

// New palette colors for crop areas
const baseColors = [
  '#006838', // Brand 400 (Dark Green)
  '#3B82F6', // Graph color-1 500 (Blue)
  '#F59E0B', // Accent-1 400 (Yellow-Orange)
  '#DC2626', // Danger 500 (Red)
  '#059855', // Success 400 (Green)
  '#9333EA'  // Graph color-4 500 (Purple)
];

// Patterns for bars using the same colors
const patterns = [
  '', // Solid fill
  'diagonal', // Diagonal lines
  'horizontal', // Horizontal lines
  'vertical', // Vertical lines
  'dots', // Dots
  'grid' // Grid pattern
];

// Combine colors and patterns for crops
const getCropStyle = (cropName: string): { color: string; pattern: string } => {
  const cropList = [
    'First Wheat', 'Winter Oilseed Rape', 'Spring Wheat',
    'Spring Barley', 'Winter Barley', 'Spring Field Bean',
    'Wheat (no prev crop)', 'Spring Oats', 'Second Wheat',
    'Combining Pea', 'Linseed', 'Winter Oats',
    'Mustard', 'Maize (forage)', 'Other'
  ];
  const index = cropList.indexOf(cropName);
  const colorIndex = index % baseColors.length;
  const patternIndex = Math.floor(index / baseColors.length) % patterns.length;
  
  return {
    color: baseColors[colorIndex],
    pattern: patterns[patternIndex]
  };
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  const formatCropName = (name: string, value: number): string => {
    const style = getCropStyle(name);
    const pattern = style.pattern ? ` (${style.pattern})` : '';
    return `${name}${pattern}: ${value.toFixed(1)}%`;
  };

  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-gray-900">{`Year: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600" style={{ color: entry.color }}>
            {formatCropName(entry.name, entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CropAreaView: React.FC<CropAreaViewProps> = ({ data }) => {
  // Transform data for the stacked bar chart
  const transformedData: CropAreaData[] = Object.entries(data).map(([year, crops]) => ({
    year,
    ...crops
  }));

  // Get all unique crop types
  const cropTypes = Array.from(
    new Set(
      Object.values(data).flatMap(yearData => 
        Object.keys(yearData)
      )
    )
  );

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year"
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Harvest Year',
              position: 'bottom',
              offset: 0,
              fontSize: 12
            }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Percentage of Total Field Area',
              angle: -90,
              position: 'left',
              offset: 40,
              fontSize: 12
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          {cropTypes.map((cropType) => {
            const style = getCropStyle(cropType);
            return (
              <Bar
                key={cropType}
                dataKey={cropType}
                stackId="a"
                fill={style.color}
                name={cropType}
              >
                {style.pattern && (
                  <defs>
                    <pattern
                      id={`pattern-${cropType}`}
                      width="4"
                      height="4"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      {style.pattern === 'diagonal' && (
                        <path
                          d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                          stroke="white"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                      )}
                      {style.pattern === 'horizontal' && (
                        <line
                          x1="0"
                          y1="2"
                          x2="4"
                          y2="2"
                          stroke="white"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                      )}
                      {style.pattern === 'vertical' && (
                        <line
                          x1="2"
                          y1="0"
                          x2="2"
                          y2="4"
                          stroke="white"
                          strokeWidth="1"
                          opacity="0.7"
                        />
                      )}
                      {style.pattern === 'dots' && (
                        <circle
                          cx="2"
                          cy="2"
                          r="1"
                          fill="white"
                          opacity="0.7"
                        />
                      )}
                      {style.pattern === 'grid' && (
                        <>
                          <path
                            d="M0,2 h4 M2,0 v4"
                            stroke="white"
                            strokeWidth="1"
                            opacity="0.7"
                          />
                        </>
                      )}
                    </pattern>
                  </defs>
                )}
                <Cell fill={style.pattern ? `url(#pattern-${cropType})` : style.color} />
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CropAreaView;