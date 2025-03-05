import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { UnitType, Year, MetricType } from '../../types/analytics';
import { metricsData } from '../../data/metricsData';
import { AVAILABLE_CROPS } from '../../constants/analytics';
import { getVariableCosts, getOperationsCosts } from '../../utils/metricsCalculations';

interface FarmOverviewChartsProps {
  selectedYears: string[];
  selectedUnit: UnitType;
  selectedMetric: MetricType;
  costFilters: {
    variable: boolean;
    operations: boolean;
  };
}

export function FarmOverviewCharts({
  selectedYears,
  selectedUnit,
  selectedMetric,
  costFilters
}: FarmOverviewChartsProps) {
  const getMetricValue = (metric: MetricType, year: Year, unit: UnitType, crop?: string): number => {
    switch (metric) {
      case 'variableCosts':
        return costFilters.variable ? getVariableCosts(year, unit, crop) : 0;
      case 'operationsCosts':
        return costFilters.operations ? getOperationsCosts(year, unit, crop) : 0;
      case 'totalCosts':
        const variableCosts = costFilters.variable ? getVariableCosts(year, unit, crop) : 0;
        const operationsCosts = costFilters.operations ? getOperationsCosts(year, unit, crop) : 0;
        return variableCosts + operationsCosts;
      case 'chemicalBreakdown':
        return 0; // This is a special case that should be handled separately
      default:
        if (metric in metricsData) {
          const metricData = metricsData[metric];
          if (year in metricData) {
            return unit === '£/t' ? metricData[year].perTonne : metricData[year].perHectare;
          }
        }
        return 0;
    }
  };

  const getData = () => {
    const validYears = selectedYears.filter((year): year is Year => {
      return year === 'Yearly avg' ||
        (Number(year) >= 2019 && Number(year) <= 2024 && !isNaN(Number(year)));
    });

    // Create stacked data where each year has values for each crop
    return validYears.map(year => {
      const yearData: { [key: string]: any } = { year };
      
      // Add value for each crop
      AVAILABLE_CROPS.forEach(crop => {
        yearData[crop] = getMetricValue(selectedMetric, year, selectedUnit, crop);
      });

      // Add total for the tooltip
      yearData.total = AVAILABLE_CROPS.reduce((sum, crop) => sum + yearData[crop], 0);
      
      return yearData;
    });
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'variableCosts':
        return 'Total Input Costs';
      case 'operationsCosts':
        return 'Total Operations Costs';
      case 'totalCosts':
        return 'Total Costs';
      case 'grossMargin':
        return 'Gross Margin';
      case 'netMargin':
        return 'Net Margin';
      default:
        return selectedMetric;
    }
  };

  // Generate grayscale colors for each crop (from dark to light)
  const cropColors = AVAILABLE_CROPS.reduce((colors, crop, index) => {
    // Calculate grayscale value from 30 to 80 (darker to lighter)
    const grayValue = 30 + (index * (50 / (AVAILABLE_CROPS.length - 1)));
    colors[crop] = `rgb(${grayValue}%, ${grayValue}%, ${grayValue}%)`;
    return colors;
  }, {} as { [key: string]: string });

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={getData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{
              value: selectedUnit,
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip
            formatter={(value: number, name: string, props: any) => {
              if (name === 'total') return ['', ''];
              const total = props.payload.total;
              const percentage = ((value / total) * 100).toFixed(1);
              return [`${value} ${selectedUnit} (${percentage}%)`, name];
            }}
            labelFormatter={(label) => `${getMetricLabel()} for ${label}`}
          />
          <Legend />
          {AVAILABLE_CROPS.map(crop => (
            <Bar
              key={crop}
              dataKey={crop}
              name={crop}
              stackId="crops"
              fill={cropColors[crop]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}