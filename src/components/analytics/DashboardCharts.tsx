import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { cropData } from '../../data/cropData';
import { yearOnYear } from '../../data/metricsData';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  selectedYear: string;
}

type MetricGroup = {
  name: string;
  metrics: string[];
  unit: string;
  description: string;
};

const metricGroups: MetricGroup[] = [
  {
    name: 'Margins & Costs',
    metrics: ['Net Margin', 'Gross Margin', 'Cost per Hectare'],
    unit: '£/ha',
    description: 'Compare financial performance per hectare'
  },
  {
    name: 'Production',
    metrics: ['Average Yield'],
    unit: 't/ha',
    description: 'Track yield performance'
  },
  {
    name: 'Revenue',
    metrics: ['Total Revenue'],
    unit: '£',
    description: 'Overall farm revenue'
  }
];

const DashboardCharts: React.FC<Props> = ({ selectedYear }) => {
  const [selectedMetricGroup, setSelectedMetricGroup] = useState<MetricGroup>(metricGroups[0]);

  // Function to parse and format metric values
  const parseMetricValue = (metric: any) => {
    if (metric.name === 'Average Yield') {
      return parseFloat(metric.value);
    }
    return parseFloat(metric.value.replace(/[£,]/g, ''));
  };

  // Prepare data for crop distribution pie chart
  const cropDistributionData: ChartData<'pie'> = {
    labels: cropData.map(crop => crop.name),
    datasets: [
      {
        data: cropData.map(crop => parseFloat(crop.area)),
        backgroundColor: cropData.map((_, index) => 
          `hsl(${(index * 360) / cropData.length}, 70%, 50%)`
        ),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Filter and sort metrics based on selected group
  const selectedMetrics = yearOnYear
    .filter(metric => selectedMetricGroup.metrics.includes(metric.name))
    .sort((a, b) => {
      const indexA = selectedMetricGroup.metrics.indexOf(a.name);
      const indexB = selectedMetricGroup.metrics.indexOf(b.name);
      return indexA - indexB;
    });

  // Prepare year-on-year comparison bar chart
  const yoyComparisonData: ChartData<'bar'> = {
    labels: selectedMetrics.map(metric => metric.name.replace(' per Hectare', '')),
    datasets: [
      {
        label: 'Previous Year',
        data: selectedMetrics.map(metric => {
          const currentValue = parseMetricValue(metric);
          const trend = parseFloat(metric.trend.toString());
          return (currentValue * 100) / (100 + trend);
        }),
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
        barThickness: 25,
      },
      {
        label: 'Current Year',
        data: selectedMetrics.map(metric => parseMetricValue(metric)),
        backgroundColor: selectedMetrics.map(metric => {
          const trend = parseFloat(metric.trend.toString());
          return trend >= 0 ? 'rgba(45, 185, 90, 0.7)' : 'rgba(239, 68, 68, 0.7)';
        }),
        borderColor: selectedMetrics.map(metric => {
          const trend = parseFloat(metric.trend.toString());
          return trend >= 0 ? 'rgba(45, 185, 90, 1)' : 'rgba(239, 68, 68, 1)';
        }),
        borderWidth: 1,
        barThickness: 25,
      },
    ],
  };

  const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 80,
        left: 20,
        top: 20,
        bottom: 40
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const metric = selectedMetrics[context.dataIndex];
            const isYield = metric.name === 'Average Yield';
            const formattedValue = isYield
              ? `${value.toFixed(2)} t/ha`
              : `£${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}${selectedMetricGroup.unit === '£/ha' ? '/ha' : ''}`;
            
            if (context.datasetIndex === 1) { // Current Year
              const trend = parseFloat(metric.trend.toString());
              return [
                `${context.dataset.label}: ${formattedValue}`,
                `Change: ${trend >= 0 ? '+' : ''}${trend}%`
              ];
            }
            return `${context.dataset.label}: ${formattedValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        type: 'linear' as const,
        position: 'bottom',
        ticks: {
          padding: 5,
          maxRotation: 0,
          callback: (value) => {
            if (typeof value === 'number') {
              const isYield = selectedMetricGroup.unit === 't/ha';
              if (isYield) {
                return `${value.toFixed(1)}`;
              } else {
                return `£${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
              }
            }
            return value;
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          padding: 25,
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Year on Year Comparison */}
      <div className="col-span-2 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">Year-on-Year Performance</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedMetricGroup.description}</p>
          </div>
          <select
            value={selectedMetricGroup.name}
            onChange={(e) => {
              const group = metricGroups.find(g => g.name === e.target.value);
              if (group) setSelectedMetricGroup(group);
            }}
            className="bg-white border border-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {metricGroups.map(group => (
              <option key={group.name} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span>Previous Year</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Improvement</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Decline</span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
              Values in {selectedMetricGroup.unit}
            </div>
          </div>
        </div>
        <div className="h-[350px] relative">
          <Bar data={yoyComparisonData} options={barOptions} />
          {/* Percentage Indicators */}
          <div className="absolute right-0 top-0 bottom-[40px] flex flex-col justify-around">
            {selectedMetrics.map((metric, index) => (
              <div 
                key={index} 
                className={`px-2 py-1 rounded font-medium ${
                  metric.trend >= 0 
                    ? 'text-green-700 bg-green-50 border border-green-100' 
                    : 'text-red-700 bg-red-50 border border-red-100'
                }`}
              >
                {metric.trend >= 0 ? '+' : ''}{metric.trend}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Distribution Pie Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Crop Area Distribution</h2>
        <div className="h-[350px]">
          <Pie data={cropDistributionData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;