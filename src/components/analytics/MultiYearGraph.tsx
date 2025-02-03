import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ViewType, UnitType, Year } from '../../types/analytics';
import { metricsData } from '../../data/metricsData';

type DataMetricType = keyof typeof metricsData;

interface MultiYearGraphProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
}

export function MultiYearGraph({ selectedView, selectedYears, selectedUnit }: MultiYearGraphProps) {
  const [selectedMetric, setSelectedMetric] = useState<DataMetricType>('costOfProduction');

  const getMetricOptions = (): { value: DataMetricType; label: string }[] => {
    switch (selectedView) {
      case 'Variable':
        return [
          { value: 'costOfProduction', label: 'Cost of Production' },
          { value: 'seed', label: 'Seed' },
          { value: 'fertiliser', label: 'Fertiliser' },
          { value: 'chemicals', label: 'Chemicals' },
          { value: 'production', label: 'Production' },
          { value: 'grossMargin', label: 'Gross Margin' },
          { value: 'yield', label: 'Yield' }
        ];
      case 'Operations':
        return [
          { value: 'cultivating', label: 'Cultivating' },
          { value: 'drilling', label: 'Drilling' },
          { value: 'applications', label: 'Applications' },
          { value: 'harvesting', label: 'Harvesting' },
          { value: 'other', label: 'Other' },
          { value: 'production', label: 'Production' },
          { value: 'grossMargin', label: 'Gross Margin' },
          { value: 'yield', label: 'Yield' }
        ];
      case 'Total':
        return [
          { value: 'production', label: 'Production' },
          { value: 'netMargin', label: 'Net Margin' },
          { value: 'yield', label: 'Yield' }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    // Reset to first metric when view changes
    const options = getMetricOptions();
    if (options.length > 0 && !options.some(opt => opt.value === selectedMetric)) {
      setSelectedMetric(options[0].value);
    }
  }, [selectedView]);

  const getData = () => {
    return selectedYears
      .filter((year): year is Year => {
        return year === 'Yearly avg' || 
          (Number(year) >= 2019 && Number(year) <= 2024 && !isNaN(Number(year)));
      })
      .map(year => {
        const yearData = {
          year,
          value: selectedUnit === '£/t' 
            ? metricsData[selectedMetric][year].perTonne
            : metricsData[selectedMetric][year].perHectare
        };
        return yearData;
      });
  };

  const metricOptions = getMetricOptions();

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4">
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as DataMetricType)}
          className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {metricOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name={`${metricOptions.find(opt => opt.value === selectedMetric)?.label} (${selectedUnit})`}
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}