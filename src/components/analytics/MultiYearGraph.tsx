import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ViewType, UnitType, Year, ChemicalBreakdown, TabType, MetricsData } from '../../types/analytics';
import { metricsData } from '../../data/metricsData';
import { fieldsData } from '../../data/fieldData';
import { getValue, getVariableCosts, getOperationsCosts, getTotalCosts } from '../../utils/metricsCalculations';

type BasicMetricType = Exclude<keyof MetricsData, 'chemicalBreakdown'>;
type CompositeMetricType = 'variableCosts' | 'operationsCosts' | 'totalCosts';
type DataMetricType = BasicMetricType | CompositeMetricType;

const CHEMICAL_COLORS = {
  traceElement: '#1F2937',  // Darkest gray
  herbicide: '#4B5563',     // Dark gray
  fungicide: '#6B7280',     // Medium gray
  adjuvant: '#9CA3AF'       // Light gray
};

interface MultiYearGraphProps {
  selectedView: ViewType;
  selectedYears: string[];
  selectedUnit: UnitType;
  selectedTab?: TabType;
  selectedField?: string;
}

const isBasicMetric = (metric: DataMetricType): metric is BasicMetricType => {
  return metric !== 'variableCosts' && metric !== 'operationsCosts' && metric !== 'totalCosts';
};

export function MultiYearGraph({ 
  selectedView, 
  selectedYears, 
  selectedUnit,
  selectedTab = 'comparison',
  selectedField
}: MultiYearGraphProps) {
  const [selectedMetric, setSelectedMetric] = useState<DataMetricType>('costOfProduction');

  const getMetricOptions = (): { value: DataMetricType; label: string }[] => {
    if (selectedTab === 'rotation') {
      switch (selectedView) {
        case 'Operations':
          return [
            { value: 'cultivating', label: 'Cultivating' },
            { value: 'drilling', label: 'Drilling' },
            { value: 'applications', label: 'Applications' },
            { value: 'harvesting', label: 'Harvesting' },
            { value: 'other', label: 'Other' },
            { value: 'production', label: 'Production' },
            { value: 'yield', label: 'Yield' }
          ];
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
        case 'Total':
          return [
            { value: 'variableCosts', label: 'Variable Costs' },
            { value: 'operationsCosts', label: 'Operations Costs' },
            { value: 'totalCosts', label: 'Total Costs' },
            { value: 'production', label: 'Production' },
            { value: 'netMargin', label: 'Net Margin' },
            { value: 'yield', label: 'Yield' }
          ];
        default:
          return [];
      }
    }

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
          { value: 'yield', label: 'Yield' }
        ];
      case 'Total':
        return [
          { value: 'production', label: 'Production' },
          { value: 'variableCosts', label: 'Variable Costs' },
          { value: 'operationsCosts', label: 'Operations Costs' },
          { value: 'totalCosts', label: 'Total Costs' },
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
  }, [selectedView, selectedTab]);

  const getMetricValue = (metric: DataMetricType, year: Year, unit: UnitType): number => {
    switch (metric) {
      case 'variableCosts':
        return getVariableCosts(year, unit);
      case 'operationsCosts':
        return getOperationsCosts(year, unit);
      case 'totalCosts':
        return getTotalCosts(year, unit);
      default:
        if (isBasicMetric(metric) && metric in metricsData) {
          const metricData = metricsData[metric];
          return unit === '£/t' ? metricData[year].perTonne : metricData[year].perHectare;
        }
        return 0;
    }
  };

  const getData = () => {
    const validYears = selectedYears.filter((year): year is Year => {
      return year === 'Yearly avg' ||
        (Number(year) >= 2019 && Number(year) <= 2024 && !isNaN(Number(year)));
    });

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

    if (selectedMetric === 'chemicals') {
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

    return validYears.map(year => ({
      year,
      value: getMetricValue(selectedMetric, year, selectedUnit)
    }));
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
          <BarChart data={getData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
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
                name={`${metricOptions.find(opt => opt.value === selectedMetric)?.label} (${selectedUnit})`}
                fill="#6B7280"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}