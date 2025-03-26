import { useState, useEffect } from 'react';
import {
  BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ZAxis, Cell
} from 'recharts';
import { ViewType, UnitType, Year, ChemicalBreakdown, TabType, MetricType, ViewLevel } from '../../types/analytics';
import { metricsData } from '../../data/metricsData';
import { fieldsData } from '../../data/fieldData';
import { getVariableCosts, getOperationsCosts, getValue, getTotalCosts } from '../../utils/metricsCalculations';
import { AVAILABLE_CROPS } from '../../constants/analytics';
import { FarmOverviewCharts } from './FarmOverviewCharts';

const CHEMICAL_COLORS = {
  traceElement: '#1F2937',  // Darkest gray
  herbicide: '#4B5563',     // Dark gray
  fungicide: '#6B7280',     // Medium gray
  adjuvant: '#9CA3AF'       // Light gray
};

type CostFilters = {
  variable: boolean;
  operations: boolean;
};

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
  selectedCrops: (typeof AVAILABLE_CROPS[number])[];
  costFilters: CostFilters;
  selectedMetric?: MetricType;
  viewLevel?: ViewLevel;
}

const isBasicMetric = (metric: MetricType): metric is Exclude<MetricType, 'variableCosts' | 'operationsCosts' | 'totalCosts' | 'chemicalBreakdown'> => {
  return !['variableCosts', 'operationsCosts', 'totalCosts', 'chemicalBreakdown'].includes(metric);
};

export function MultiYearGraph({
  selectedView,
  selectedYears,
  selectedUnit,
  selectedTab = 'comparison',
  selectedField,
  selectedCrops,
  costFilters,
  selectedMetric: propSelectedMetric,
  viewLevel = 'crop'
}: MultiYearGraphProps) {
  const [stateSelectedMetric, setStateSelectedMetric] = useState<MetricType>('costOfProduction');
  const selectedMetric = propSelectedMetric || stateSelectedMetric;

  const getMetricOptions = () => {
    // Base options that are always shown
    const baseOptions: { value: MetricType; label: string }[] = [
      { value: 'production', label: 'Production' },
      { value: 'yield', label: 'Yield' }
    ];

    // Options for Input Costs (formerly Variable Costs)
    const variableOptions: { value: MetricType; label: string }[] = costFilters.variable ? [
      { value: 'costOfProduction', label: 'Cost of Production' },
      { value: 'seed', label: 'Seed' },
      { value: 'fertiliser', label: 'Fertiliser' },
      { value: 'chemicals', label: 'Chemicals' },
      { value: 'variableCosts', label: 'Input Costs' },
      { value: 'grossMargin', label: 'Gross Margin' }
    ] : [];

    // Options for Operation Costs
    const operationsOptions: { value: MetricType; label: string }[] = costFilters.operations ? [
      { value: 'cultivating', label: 'Cultivating' },
      { value: 'drilling', label: 'Drilling' },
      { value: 'applications', label: 'Applications' },
      { value: 'harvesting', label: 'Harvesting' },
      { value: 'other', label: 'Other' },
      { value: 'operationsCosts', label: 'Operations Costs' }
    ] : [];

    // Combined options that require both filters
    const combinedOptions: { value: MetricType; label: string }[] = (costFilters.variable && costFilters.operations) ? [
      { value: 'totalCosts', label: 'Total Costs' },
      { value: 'netMargin', label: 'Net Margin' }
    ] : [];

    return {
      baseOptions,
      variableOptions,
      operationsOptions,
      combinedOptions
    };
  };

  useEffect(() => {
    // Reset to appropriate default metric based on view level
    const options = getMetricOptions();
    const allOptions = [
      ...options.baseOptions,
      ...options.variableOptions,
      ...options.operationsOptions,
      ...options.combinedOptions
    ];

    // Set default metrics based on view level
    const level = viewLevel as ViewLevel;
    switch (level) {
      case 'farm':
        setStateSelectedMetric('totalCosts');
        break;
      case 'crop':
        // For crop view, prefer grossMargin or first available metric
        if (!allOptions.some(opt => opt.value === selectedMetric)) {
          const defaultMetric = allOptions.find(opt => opt.value === 'grossMargin') || allOptions[0];
          if (defaultMetric) {
            setStateSelectedMetric(defaultMetric.value);
          }
        }
        break;
      case 'field':
        // For field view, prefer yield or first available metric
        if (!allOptions.some(opt => opt.value === selectedMetric)) {
          const defaultMetric = allOptions.find(opt => opt.value === 'yield') || allOptions[0];
          if (defaultMetric) {
            setStateSelectedMetric(defaultMetric.value);
          }
        }
        break;
    }
  }, [selectedView, selectedTab, viewLevel, selectedMetric]);

  // If we're in farm view, render the FarmOverviewCharts component
  if (viewLevel === 'farm') {
    return (
      <FarmOverviewCharts
        selectedYears={selectedYears}
        selectedUnit={selectedUnit}
        selectedMetric={selectedMetric}
        costFilters={costFilters}
      />
    );
  }

  const getMetricValue = (metric: MetricType, year: Year, unit: UnitType): number => {
    switch (metric) {
      case 'variableCosts':
        return costFilters.variable ? getVariableCosts(year, unit) : 0;
      case 'operationsCosts':
        return costFilters.operations ? getOperationsCosts(year, unit) : 0;
      case 'totalCosts':
        const variableCosts = costFilters.variable ? getVariableCosts(year, unit) : 0;
        const operationsCosts = costFilters.operations ? getOperationsCosts(year, unit) : 0;
        return variableCosts + operationsCosts;
      case 'chemicalBreakdown':
        return 0; // This is a special case that should be handled separately
      default:
        if (metric in metricsData) {
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
        const isInvalidField = selectedField === 'field1' && year === '2021';
        
        return {
          year,
          'Field Value': isInvalidField ? null : fieldData.metrics[year][selectedMetric as keyof typeof fieldData.metrics[Year]],
          'Farm Average': isInvalidField ? null : getMetricValue(selectedMetric, year, selectedUnit)
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
      const scatterData: Array<{ x: number, y: number, crop: string, year: string }> = [];
      
      selectedCrops.forEach((crop, cropIndex) => {
        validYears.forEach(year => {
          // Get actual metric value instead of random value
          let value = 0;
          
          if (isBasicMetric(selectedMetric)) {
            value = getValue(selectedMetric, year, selectedUnit, crop);
          } else if (selectedMetric === 'variableCosts') {
            value = getVariableCosts(year, selectedUnit, crop);
          } else if (selectedMetric === 'operationsCosts') {
            value = getOperationsCosts(year, selectedUnit, crop);
          } else if (selectedMetric === 'totalCosts') {
            value = getTotalCosts(year, selectedUnit, crop);
          }
          
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
              <Legend />
              {selectedYears.map(year => (
                <Scatter
                  key={year}
                  name={year}
                  data={getData().filter(item => item.year === year)}
                  fill={YEAR_COLORS[year as keyof typeof YEAR_COLORS] || '#000000'}
                >
                  {getData().filter(item => item.year === year).map((_, i) => (
                    <Cell key={`cell-${i}`} fill={YEAR_COLORS[year as keyof typeof YEAR_COLORS] || '#000000'} />
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