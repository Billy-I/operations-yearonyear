import { useState, useEffect } from 'react';
import {
  BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ZAxis, Cell
} from 'recharts';
import { ViewType, UnitType, Year, ChemicalBreakdown, TabType, MetricsData } from '../../types/analytics';
import { metricsData } from '../../data/metricsData';
import { fieldsData } from '../../data/fieldData';
import { getValue, getVariableCosts, getOperationsCosts, getTotalCosts } from '../../utils/metricsCalculations';
import { AVAILABLE_CROPS } from '../../constants/analytics';

type BasicMetricType = Exclude<keyof MetricsData, 'chemicalBreakdown'>;
type CompositeMetricType = 'variableCosts' | 'operationsCosts' | 'totalCosts';
type DataMetricType = BasicMetricType | CompositeMetricType;

const CHEMICAL_COLORS = {
  traceElement: '#1F2937',  // Darkest gray
  herbicide: '#4B5563',     // Dark gray
  fungicide: '#6B7280',     // Medium gray
  adjuvant: '#9CA3AF'       // Light gray
};

interface CostFilters {
  variable?: boolean;
  operations?: boolean;
}

// Year colors for scatter chart
const YEAR_COLORS = {
  '2019': '#15803d', // Green
  '2020': '#65a30d', // Light green
  '2021': '#ea580c', // Orange
  '2022': '#ca8a04', // Yellow
  '2023': '#0ea5e9', // Blue
  'Yearly avg': '#6b7280', // Gray
};

interface MultiYearGraphProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
  selectedTab?: TabType;
  selectedField?: string;
  selectedCrop?: typeof AVAILABLE_CROPS[number];
  selectedCrops: (typeof AVAILABLE_CROPS[number])[];
  costFilters?: CostFilters;
  selectedMetric?: DataMetricType;
}

const isBasicMetric = (metric: DataMetricType): metric is BasicMetricType => {
  return metric !== 'variableCosts' && metric !== 'operationsCosts' && metric !== 'totalCosts';
};

export function MultiYearGraph({
  selectedView,
  selectedYears,
  selectedUnit,
  selectedTab = 'comparison',
  selectedField,
  selectedCrop,
  selectedCrops,
  costFilters = { variable: true, operations: true },
  selectedMetric: propSelectedMetric
}: MultiYearGraphProps) {
  const [stateSelectedMetric, setStateSelectedMetric] = useState<DataMetricType>('costOfProduction');
  // Use the prop value if provided, otherwise use the state value
  const selectedMetric = propSelectedMetric || stateSelectedMetric;

  const getMetricOptions = () => {
    // Base options that are always shown
    const baseOptions: { value: DataMetricType; label: string }[] = [
      { value: 'production', label: 'Production' },
      { value: 'yield', label: 'Yield' }
    ];

    // Options for Input Costs (formerly Variable Costs)
    const variableOptions: { value: DataMetricType; label: string }[] = costFilters.variable ? [
      { value: 'costOfProduction', label: 'Cost of Production' },
      { value: 'seed', label: 'Seed' },
      { value: 'fertiliser', label: 'Fertiliser' },
      { value: 'chemicals', label: 'Chemicals' },
      { value: 'variableCosts', label: 'Input Costs' },
      { value: 'grossMargin', label: 'Gross Margin' }
    ] : [];

    // Options for Operation Costs
    const operationsOptions: { value: DataMetricType; label: string }[] = costFilters.operations ? [
      { value: 'cultivating', label: 'Cultivating' },
      { value: 'drilling', label: 'Drilling' },
      { value: 'applications', label: 'Applications' },
      { value: 'harvesting', label: 'Harvesting' },
      { value: 'other', label: 'Other' },
      { value: 'operationsCosts', label: 'Operations Costs' }
    ] : [];

    // Combined options that require both filters
    const combinedOptions: { value: DataMetricType; label: string }[] = (costFilters.variable && costFilters.operations) ? [
      { value: 'totalCosts', label: 'Total Costs' },
      { value: 'netMargin', label: 'Net Margin' }
    ] : [];

    // Return categorized options
    return {
      baseOptions,
      variableOptions,
      operationsOptions,
      combinedOptions
    };
  };

  useEffect(() => {
    // Reset to first metric when view changes
    const options = getMetricOptions();
    const allOptions = [
      ...options.baseOptions,
      ...options.variableOptions,
      ...options.operationsOptions,
      ...options.combinedOptions
    ];
    if (allOptions.length > 0 && !allOptions.some(opt => opt.value === selectedMetric)) {
      setStateSelectedMetric(allOptions[0].value);
    }
  }, [selectedView, selectedTab]);

  const getMetricValue = (metric: DataMetricType, year: Year, unit: UnitType): number => {
    switch (metric) {
      case 'variableCosts':
        return costFilters.variable ? getVariableCosts(year, unit) : 0;
      case 'operationsCosts':
        return costFilters.operations ? getOperationsCosts(year, unit) : 0;
      case 'totalCosts':
        const variableCosts = costFilters.variable ? getVariableCosts(year, unit) : 0;
        const operationsCosts = costFilters.operations ? getOperationsCosts(year, unit) : 0;
        return variableCosts + operationsCosts;
      default:
        if (isBasicMetric(metric) && metric in metricsData) {
          const metricData = metricsData[metric];
          // Check if this metric should be shown based on active filters
          const isVariableMetric = ['costOfProduction', 'seed', 'fertiliser', 'chemicals', 'grossMargin'].includes(metric);
          const isOperationsMetric = ['cultivating', 'drilling', 'applications', 'harvesting', 'other'].includes(metric);
          const isCommonMetric = ['production', 'yield'].includes(metric);
          const isNetMargin = metric === 'netMargin';

          if ((isVariableMetric && costFilters.variable) ||
              (isOperationsMetric && costFilters.operations) ||
              (isNetMargin && costFilters.variable && costFilters.operations) ||
              isCommonMetric) {
            return unit === '£/t' ? metricData[year].perTonne : metricData[year].perHectare;
          }
          return 0;
        }
        return 0;
    }
  };

  const getData = () => {
    const validYears = selectedYears.filter((year): year is Year => {
      return year === 'Yearly avg' ||
        (Number(year) >= 2019 && Number(year) <= 2024 && !isNaN(Number(year)));
    });

    // Field rotation view
    if (selectedTab === 'rotation' && selectedField) {
      const fieldData = fieldsData.find(field => field.id === selectedField);
      if (!fieldData) return [];

      return validYears.map(year => {
        const yearKey = year as Year;
        const isInvalidField = selectedField === 'field1' && year === '2021';
        
        return {
          year,
          'Field Value': isInvalidField ? null : fieldData.metrics[yearKey][selectedMetric as keyof typeof fieldData.metrics[Year]],
          'Farm Average': isInvalidField ? null :
            isBasicMetric(selectedMetric) ? getValue(selectedMetric, yearKey, selectedUnit) : getMetricValue(selectedMetric, yearKey, selectedUnit)
        };
      });
    }

    // Chemicals breakdown view
    if (selectedMetric === 'chemicals' && selectedCrops.length === 1) {
      return validYears.map(year => {
        const chemicalTypes = Object.keys(metricsData.chemicalBreakdown) as Array<keyof ChemicalBreakdown>;
        const yearData: { [key: string]: any } = { year };
        
        chemicalTypes.forEach(type => {
          yearData[type] = selectedUnit === '£/t'
            ? metricsData.chemicalBreakdown[type][year].perTonne
            : metricsData.chemicalBreakdown[type][year].perHectare;
        });
        
        return yearData;
      });
    }

    // Multi-crop view (scatter chart)
    if (selectedCrops.length > 1) {
      // For scatter chart, we need data in format: { x: cropIndex, y: value, crop: cropName, year: year }
      const scatterData: Array<{ x: number, y: number, crop: string, year: string }> = [];
      
      selectedCrops.forEach((crop, cropIndex) => {
        validYears.forEach(year => {
          const yearKey = year as Year;
          // Mock data - in a real app, you would fetch actual data for each crop
          // This would need to be replaced with actual data fetching logic
          const value = Math.random() * 5000 + 500; // Random value between 500 and 5500
          
          scatterData.push({
            x: cropIndex,
            y: value,
            crop,
            year
          });
        });
      });
      
      return scatterData;
    }

    // Single crop view (bar chart)
    return validYears.map(year => ({
      year,
      value: getMetricValue(selectedMetric, year, selectedUnit)
    }));
  };

  const metricOptions = getMetricOptions();
  const allOptions = [
    ...metricOptions.baseOptions,
    ...metricOptions.variableOptions,
    ...metricOptions.operationsOptions,
    ...metricOptions.combinedOptions
  ];

  return (
    <div className="mt-6">

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {selectedCrops.length > 1 ? (
            // Scatter chart for multiple crops
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="crop"
                tickFormatter={(value) => selectedCrops[value] || ''}
                domain={[0, selectedCrops.length - 1]}
                ticks={Array.from({ length: selectedCrops.length }, (_, i) => i)}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={`${allOptions.find(opt => opt.value === selectedMetric)?.label}`}
                unit={
                  (selectedMetric === 'yield' || selectedMetric === 'production')
                    ? ' t' // Always display in tonnes
                    : (selectedUnit === '£/t' ? ' £/t' : selectedUnit === '£/ha' ? ' £/ha' : ' £')
                }
              />
              <ZAxis range={[60, 60]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: any, name: string) => {
                  if (name === 'y') {
                    const isYieldOrProduction = selectedMetric === 'yield' || selectedMetric === 'production';
                    const unitDisplay = isYieldOrProduction
                      ? 't' // Always display in tonnes
                      : (selectedUnit === '£' ? '£' : selectedUnit);
                    return [`${value} ${unitDisplay}`, `${allOptions.find(opt => opt.value === selectedMetric)?.label}`];
                  }
                  return [value, 'Crop'];
                }}
                labelFormatter={() => ''}
              />
              <Legend
                formatter={(value, entry, index) => {
                  // Return year for the legend
                  return value;
                }}
              />
              {selectedYears.map((year, index) => (
                <Scatter
                  key={year}
                  name={year}
                  data={getData().filter(item => item.year === year)}
                  fill={YEAR_COLORS[year as keyof typeof YEAR_COLORS] || '#000000'}
                >
                  {getData().filter(item => item.year === year).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={YEAR_COLORS[year as keyof typeof YEAR_COLORS] || '#000000'} />
                  ))}
                </Scatter>
              ))}
            </ScatterChart>
          ) : (
            // Bar chart for single crop
            <BarChart data={getData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                label={{
                  value: selectedMetric === 'yield' || selectedMetric === 'production'
                    ? 't' // Always display in tonnes
                    : (selectedUnit === '£' ? '£' : selectedUnit),
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip
                formatter={(value: any, name: string) => {
                  const isYieldOrProduction = selectedMetric === 'yield' || selectedMetric === 'production';
                  const unitDisplay = isYieldOrProduction
                    ? 't' // Always display in tonnes
                    : (selectedUnit === '£' ? '£' : selectedUnit);
                  return [`${value} ${unitDisplay}`, name];
                }}
              />
              <Legend />
              {(selectedTab === 'rotation' && (selectedView === 'Variable' || selectedView === 'Operations' || selectedView === 'Total')) ? (
                <>
                  <Bar
                    dataKey="Field Value"
                    name={`Field Value (${selectedUnit})`}
                    fill="#6B7280"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Farm Average"
                    name={`Farm Average (${selectedUnit})`}
                    fill="#9CA3AF"
                    radius={[4, 4, 0, 0]}
                  />
                </>
              ) : selectedMetric === 'chemicals' ? (
                <>
                  <Bar
                    dataKey="traceElement"
                    name={`Trace Element (${selectedUnit})`}
                    fill={CHEMICAL_COLORS.traceElement}
                    stackId="chemicals"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="herbicide"
                    name={`Herbicide (${selectedUnit})`}
                    fill={CHEMICAL_COLORS.herbicide}
                    stackId="chemicals"
                  />
                  <Bar
                    dataKey="fungicide"
                    name={`Fungicide (${selectedUnit})`}
                    fill={CHEMICAL_COLORS.fungicide}
                    stackId="chemicals"
                  />
                  <Bar
                    dataKey="adjuvant"
                    name={`Adjuvant (${selectedUnit})`}
                    fill={CHEMICAL_COLORS.adjuvant}
                    stackId="chemicals"
                  />
                </>
              ) : (
                <Bar
                  dataKey="value"
                  name={`${allOptions.find(opt => opt.value === selectedMetric)?.label} (${
                    (selectedMetric === 'yield' || selectedMetric === 'production')
                      ? 't' // Always display in tonnes
                      : selectedUnit
                  })`}
                  fill="#6B7280"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}