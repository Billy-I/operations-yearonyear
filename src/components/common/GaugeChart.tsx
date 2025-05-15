import React from 'react';

interface GaugeChartProps {
  value: number; // Percentage value 0-100
  size?: number; // Diameter of the gauge
  strokeWidth?: number;
  label?: string;
  valueText?: string; // Text to display for the value, defaults to `${value.toFixed(0)}%`
  color?: string; // Color of the gauge arc
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  size = 100,
  strokeWidth = 10,
  label,
  valueText,
  color = '#4A5568', // Default to a gray color (Tailwind gray-700)
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circumference for semi-circle
  const offset = circumference - (normalizedValue / 100) * circumference;

  const viewBox = `0 0 ${size} ${size}`;
  const center = size / 2;
  const arcPath = `
    M ${strokeWidth / 2},${center}
    A ${radius},${radius} 0 0 1 ${size - strokeWidth / 2},${center}
  `;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size / 1.6 }}>
      <svg
        width={size}
        height={size / 1.6}
        viewBox={`0 0 ${size} ${size / 1.6}`}
        className="absolute top-0 left-0"
      >
        <g transform={`translate(0, ${size * 0.1})`}>
          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(0, ${center}, ${center})`}
          />
          {/* Filled arc */}
          <path
            d={arcPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(0, ${center}, ${center})`}
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </g>
      </svg>
      {/* Value text */}
      <div
        className="absolute text-center"
        style={{
          top: `${(size / 1.6) * 0.4}px`,
          width: size
        }}
      >
        <div className="text-xl font-bold text-gray-700">
          {valueText !== undefined ? valueText : `${normalizedValue.toFixed(0)}%`}
        </div>
      </div>
      {label && (
        <div
          className="text-xs text-gray-500 mt-1 absolute"
          style={{
            top: `${(size / 1.6) * 0.7}px`
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default GaugeChart;